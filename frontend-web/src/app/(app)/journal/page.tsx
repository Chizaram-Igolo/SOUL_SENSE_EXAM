'use client';

import { useState, useCallback } from 'react';
import { useApi } from '@/hooks/useApi';
import { journalApi, JournalEntry, CreateJournalEntry } from '@/lib/api/journal';
import { ErrorDisplay, Skeleton } from '@/components/common';
import { Button, Card, CardContent } from '@/components/ui';
import {
  BookOpen,
  Plus,
  Calendar,
  Tag,
  Search,
  X,
  ChevronDown,
  Smile,
  Meh,
  Frown,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MOOD_ICONS = {
  positive: { icon: Smile, color: 'text-green-500', bg: 'bg-green-500/10' },
  neutral: { icon: Meh, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  negative: { icon: Frown, color: 'text-red-500', bg: 'bg-red-500/10' },
};

function getMoodCategory(score?: number) {
  if (score == null) return 'neutral';
  if (score >= 60) return 'positive';
  if (score >= 40) return 'neutral';
  return 'negative';
}

export default function JournalPage() {
  const [page, setPage] = useState(1);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<CreateJournalEntry>({
    content: '',
    title: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: journalData,
    loading,
    error,
    refetch,
  } = useApi({
    apiFn: () => journalApi.listEntries(page, 10),
    deps: [page],
  });

  const handleSubmit = useCallback(async () => {
    if (!newEntry.content.trim()) return;
    setSubmitting(true);
    try {
      await journalApi.createEntry(newEntry);
      setNewEntry({ content: '', title: '', tags: [] });
      setIsNewEntryOpen(false);
      refetch();
    } catch {
      // Error handling could be improved with a toast system
    } finally {
      setSubmitting(false);
    }
  }, [newEntry, refetch]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !newEntry.tags?.includes(tag)) {
      setNewEntry((prev) => ({ ...prev, tags: [...(prev.tags || []), tag] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewEntry((prev) => ({ ...prev, tags: prev.tags?.filter((t) => t !== tag) }));
  };

  const handleDelete = useCallback(
    async (id: number) => {
      try {
        await journalApi.deleteEntry(id);
        refetch();
      } catch {
        // TODO: toast
      }
    },
    [refetch]
  );

  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const entries = journalData?.entries ?? [];
  const total = journalData?.total ?? 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-primary" />
            Journal
          </h1>
          <p className="text-muted-foreground mt-2">
            Reflect on your emotional journey. {total > 0 && `${total} entries`}
          </p>
        </div>
        <Button
          onClick={() => setIsNewEntryOpen(!isNewEntryOpen)}
          className="rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* New Entry Form */}
      <AnimatePresence>
        {isNewEntryOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="rounded-[2rem] border-none bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5 overflow-hidden">
              <CardContent className="p-8 space-y-5">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    New Journal Entry
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={newEntry.title}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border bg-muted/30 text-sm font-medium focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-muted-foreground/60"
                />
                <textarea
                  placeholder="What's on your mind today?"
                  value={newEntry.content}
                  onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border bg-muted/30 text-sm leading-relaxed resize-none focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-muted-foreground/60"
                />

                {/* Tags */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      className="flex-1 px-3 py-2 rounded-lg border bg-muted/20 text-sm outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                    />
                  </div>
                  {(newEntry.tags?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {newEntry.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-red-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsNewEntryOpen(false)}
                    className="rounded-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !newEntry.content.trim()}
                    className="rounded-full px-6 shadow-lg shadow-primary/20"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
                    ) : null}
                    {submitting ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border p-6 space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && <ErrorDisplay message={error} onRetry={refetch} />}

      {/* Empty State */}
      {!loading && !error && entries.length === 0 && (
        <Card className="rounded-[2rem] border-dashed border-2 bg-muted/10">
          <CardContent className="p-12 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold">No journal entries yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Start your reflection journey. Tap "New Entry" to write your first journal entry.
            </p>
            <Button onClick={() => setIsNewEntryOpen(true)} className="rounded-full px-6 mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Write Your First Entry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Entries List */}
      {!loading && entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry, index) => {
            const mood = getMoodCategory(entry.sentiment_score ?? entry.mood_score);
            const MoodIcon = MOOD_ICONS[mood].icon;

            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-[2rem] border-none bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 hover:shadow-xl transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Title & Date */}
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${MOOD_ICONS[mood].bg}`}>
                            <MoodIcon className={`w-4 h-4 ${MOOD_ICONS[mood].color}`} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold truncate">
                              {entry.title || 'Untitled Entry'}
                            </h3>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(entry.timestamp)}
                            </p>
                          </div>
                        </div>

                        {/* Content Preview */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {entry.content}
                        </p>

                        {/* Tags */}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {entry.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
                        aria-label="Delete entry"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-full"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground font-medium">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-full"
          >
            Next
          </Button>
        </div>
      )}
    </motion.div>
  );
}
