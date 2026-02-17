'use client';

import { useApi } from '@/hooks/useApi';
import { resultsApi } from '@/lib/api/results';
import { RecommendationCard } from '@/components/results';
import { ErrorDisplay, LoadingState, EmptyState, Skeleton } from '@/components/common';

export default function ResultsPage() {
  // Fetch assessment history to get the latest assessment ID
  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = useApi({
    apiFn: () => resultsApi.getHistory(1, 1), // Get just the latest
    deps: [],
  });

  // Get latest assessment ID
  const latestAssessmentId = historyData?.assessments?.[0]?.id;

  // Fetch detailed results for the latest assessment
  const {
    data: detailedResult,
    loading: resultsLoading,
    error: resultsError,
    refetch,
  } = useApi({
    apiFn: () =>
      latestAssessmentId
        ? resultsApi.getDetailedResult(latestAssessmentId)
        : Promise.reject(new Error('No assessments found')),
    deps: [latestAssessmentId],
    immediate: !!latestAssessmentId,
  });

  const loading = historyLoading || resultsLoading;
  const error = historyError || resultsError;

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="rounded-lg border bg-card p-8 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            View your exam results and personalized recommendations.
          </p>
        </div>
        <ErrorDisplay message={error} onRetry={refetch} />
      </div>
    );
  }

  // No assessments taken yet
  if (!latestAssessmentId || !detailedResult) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
          <p className="text-muted-foreground mt-2">
            View your exam results and personalized recommendations.
          </p>
        </div>
        <EmptyState
          title="No Assessments Yet"
          description="You haven't taken any assessments yet. Start your first assessment to get personalized insights and recommendations."
          action={
            <button
              onClick={() => (window.location.href = '/exam')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Take Your First Assessment
            </button>
          }
        />
      </div>
    );
  }

  const recommendations = detailedResult.recommendations || [];
  const highPriorityRecs = recommendations.filter((rec) => rec.priority === 'high');

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assessment Results</h1>
        <p className="text-muted-foreground mt-2">
          View your exam results and personalized recommendations.
        </p>
      </div>

      {/* Results Summary Card */}
      <div className="rounded-lg border bg-card p-8">
        <div className="space-y-4">
          <div className="pb-4 border-b">
            <p className="font-semibold">Latest Assessment</p>
            <p className="text-muted-foreground text-sm">
              Overall Score: {detailedResult.overall_score}%
            </p>
            {detailedResult.completed_at && (
              <p className="text-xs text-muted-foreground mt-1">
                Completed: {new Date(detailedResult.completed_at).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Category Scores */}
          {detailedResult.category_scores && detailedResult.category_scores.length > 0 && (
            <div className="space-y-2">
              <p className="font-medium text-sm">Category Breakdown</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {detailedResult.category_scores.map((cat) => (
                  <div key={cat.category_name} className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs text-muted-foreground">{cat.category_name}</p>
                    <p className="text-lg font-bold">{cat.score}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* High-Priority Recommendations Section */}
      {highPriorityRecs.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Top Priorities</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Focus on these high-priority recommendations for maximum impact
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {highPriorityRecs.map((rec, index) => (
              <RecommendationCard
                key={`high-${rec.category_name}-${index}`}
                recommendation={rec}
                showAnimation={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Recommendations Section */}
      {recommendations.length > 0 ? (
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold">All Recommendations</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Personalized insights based on your assessment results
            </p>
          </div>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={`${rec.category_name}-${index}`}
                recommendation={rec}
                showAnimation={true}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="No Recommendations Available"
          description="Complete an assessment to receive personalized recommendations."
        />
      )}

      {/* Next Steps */}
      <div className="rounded-lg border bg-muted/50 p-6">
        <h3 className="font-semibold mb-2">What&apos;s Next?</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Review each recommendation and click to expand for more details</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Start with high-priority items for the most significant improvement</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>Retake the assessment in 2-4 weeks to track your progress</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
