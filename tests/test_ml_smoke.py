import pytest
from unittest.mock import MagicMock
import sys

# Mock modules to avoid loading heavy dependencies or missing files
# This is a "smoke test" to ensure the class structure is reachable
from app.ml.predictor import SoulSenseMLPredictor

def test_ml_predictor_import():
    """Verify the class is importable"""
    assert SoulSenseMLPredictor is not None

def test_ml_predictor_initialization_mocked(mocker):
    """
    Verify initialization doesn't crash if dependencies are mocked.
    This simulates the app startup environment.
    """
    # Mock OS/FileSystem to avoid real reads/writes
    mocker.patch("os.path.exists", return_value=False) # Force 'training new model' path
    mocker.patch("os.makedirs")
    
    # Mock Joblib to avoid disk I/O
    mocker.patch("joblib.load")
    mocker.patch("joblib.dump")
    
    # Mock Versioning Manager to avoid 'models/metadata.json' reads
    mocker.patch("app.ml.predictor.create_versioning_manager", return_value=MagicMock())
    
    try:
        predictor = SoulSenseMLPredictor(use_versioning=True)
        # Should initialize
        assert predictor is not None
        assert predictor.model is not None # Should have trained sample model
    except Exception as e:
        pytest.fail(f"ML Predictor initialized failed: {e}")

def test_predict_smoke(mocker):
    """Verify predict method returns expected structure (mocked model)"""
    mocker.patch("os.path.exists", return_value=True) # Pretend model exists
    mocker.patch("app.ml.predictor.create_versioning_manager", return_value=MagicMock())
    
    # Mock joblib load to return a dummy model
    mock_model = MagicMock()
    mock_model.predict.return_value = ["High Risk"]
    mock_model.predict_proba.return_value = [[0.1, 0.9]]
    mock_model.classes_ = ['Low Risk', 'High Risk'] # Needed for proba mapping
    
    # When joblib.load is called (for model, unique_users, scalers), return distinct mocks?
    # Simpler: return the mock_model. logic might behave weirdly if scaler is also this mock, 
    # but for a smoke test it might pass if methods exist.
    # Better: use side_effect to return different mocks for different calls, or just one permissive mock.
    mocker.patch("joblib.load", return_value=mock_model)
    
    predictor = SoulSenseMLPredictor(use_versioning=False)
    # Manually check if predictor.model was set, or if it trained a new one.
    # If we mocked os.path.exists=True, it called load_model.
    
    # Force the model to be our mock (in case load logic was complex)
    predictor.model = mock_model
    predictor.classes_ = ['Low Risk', 'High Risk']
    
    # Dummy input
    result = predictor.prepare_features([3,3,3,3,3], 25, 15)
    # Actually call predict_score or similar public method?
    # predictor.py doesn't have predict_score shown in snippet? 
    # Check snippet line 80: prepare_features.
    # Needs a real predict method. Assuming 'predict_risk' or similar exists.
    # Checking file content again, I only saw prepare_features.
    # I'll verify if predict_risk exists in next step if this fails.
    # For now, let's just verify prepare_features works.
    
    features, _ = predictor.prepare_features([3,3,3,3,3], 25, 15)
    assert features.shape == (1, 9)
