'use client';

import { useApi, useOnlineStatus } from '@/hooks/useApi';
import { dashboardApi } from '@/lib/api/dashboard';
import { ErrorDisplay, LoadingState, OfflineBanner, Skeleton } from '@/components/common';

export default function DashboardPage() {
  const isOnline = useOnlineStatus();
  const {
    data: summary,
    loading,
    error,
    refetch,
  } = useApi({
    apiFn: () => dashboardApi.getSummary(),
    deps: [],
  });

  if (loading) {
    return (
      <div className="space-y-6">
        {!isOnline && <OfflineBanner className="mb-4" />}
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border bg-card p-6 space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-20" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border bg-card p-6">
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {!isOnline && <OfflineBanner className="mb-4" />}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here&apos;s your dashboard overview.
          </p>
        </div>
        <ErrorDisplay message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!summary) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {!isOnline && <OfflineBanner className="mb-4" />}

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s your dashboard overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-sm text-muted-foreground">Total Tests Taken</h3>
          <p className="text-3xl font-bold mt-2">{summary.total_assessments}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-sm text-muted-foreground">Average Score</h3>
          <p className="text-3xl font-bold mt-2">{summary.average_score}%</p>
        </div>
        <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-sm text-muted-foreground">Journal Entries</h3>
          <p className="text-3xl font-bold mt-2">{summary.journal_entries_count}</p>
        </div>
        <div className="rounded-lg border bg-card p-6 hover:shadow-md transition-shadow">
          <h3 className="font-semibold text-sm text-muted-foreground">Current Streak</h3>
          <p className="text-3xl font-bold mt-2">{summary.current_streak} days</p>
        </div>
      </div>

      {/* Wellbeing Score (if available) */}
      {summary.wellbeing_score !== undefined && (
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Overall Wellbeing</h2>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-primary">{summary.wellbeing_score}</div>
            <div className="flex-1">
              <div className="h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500"
                  style={{ width: `${summary.wellbeing_score}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {summary.wellbeing_score >= 80
                  ? 'Excellent'
                  : summary.wellbeing_score >= 60
                    ? 'Good'
                    : summary.wellbeing_score >= 40
                      ? 'Fair'
                      : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        {summary.recent_activity && summary.recent_activity.length > 0 ? (
          <div className="space-y-3">
            {summary.recent_activity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === 'assessment'
                      ? 'bg-blue-500'
                      : activity.type === 'journal'
                        ? 'bg-emerald-500'
                        : 'bg-amber-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  {activity.description && (
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">
            No recent activity. Start by taking an assessment!
          </p>
        )}
      </div>
    </div>
  );
}
