'use client';

import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { profileApi, UserSettings, UpdateSettings } from '@/lib/api/profile';
import { ErrorDisplay, Skeleton } from '@/components/common';
import { Button, Card, CardContent } from '@/components/ui';
import { Settings, Bell, Globe, Palette, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

type FeedbackState = { type: 'success' | 'error'; message: string } | null;

export default function SettingsPage() {
  const {
    data: settings,
    loading,
    error,
    refetch,
  } = useApi({
    apiFn: () => profileApi.getSettings(),
    deps: [],
  });

  const [form, setForm] = useState<UpdateSettings>({
    theme: 'system',
    notifications_enabled: true,
    email_notifications: true,
    language: 'en',
  });
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  // Sync API data into form when loaded
  useEffect(() => {
    if (settings) {
      setForm({
        theme: settings.theme ?? 'system',
        notifications_enabled: settings.notifications_enabled ?? true,
        email_notifications: settings.email_notifications ?? true,
        language: settings.language ?? 'en',
      });
    }
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      await profileApi.updateSettings(form);
      setFeedback({ type: 'success', message: 'Settings saved successfully!' });
      refetch();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  const updateField = <K extends keyof UpdateSettings>(key: K, value: UpdateSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border p-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your preferences.</p>
        </div>
        <ErrorDisplay message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
          <Settings className="w-7 h-7 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your preferences and account settings.</p>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-2xl border ${
            feedback.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
        </motion.div>
      )}

      {/* Appearance */}
      <Card className="rounded-[2rem] border-none bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5">
        <CardContent className="p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Appearance
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">Choose your preferred color scheme</p>
            </div>
            <select
              value={form.theme}
              onChange={(e) => updateField('theme', e.target.value as UpdateSettings['theme'])}
              className="px-4 py-2 rounded-xl border bg-muted/40 text-sm font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-[2rem] border-none bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5">
        <CardContent className="p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Get notified about new insights</p>
              </div>
              <button
                onClick={() => updateField('notifications_enabled', !form.notifications_enabled)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                  form.notifications_enabled ? 'bg-primary' : 'bg-muted'
                }`}
                role="switch"
                aria-checked={form.notifications_enabled}
                aria-label="Toggle push notifications"
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    form.notifications_enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive email updates and reminders</p>
              </div>
              <button
                onClick={() => updateField('email_notifications', !form.email_notifications)}
                className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
                  form.email_notifications ? 'bg-primary' : 'bg-muted'
                }`}
                role="switch"
                aria-checked={form.email_notifications}
                aria-label="Toggle email notifications"
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                    form.email_notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Language */}
      <Card className="rounded-[2rem] border-none bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5">
        <CardContent className="p-8">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Language
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Display Language</p>
              <p className="text-xs text-muted-foreground">Choose your preferred language</p>
            </div>
            <select
              value={form.language}
              onChange={(e) => updateField('language', e.target.value)}
              className="px-4 py-2 rounded-xl border bg-muted/40 text-sm font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </motion.div>
  );
}
