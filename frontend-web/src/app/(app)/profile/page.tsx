'use client';

import { useApi } from '@/hooks/useApi';
import { useAuth } from '@/hooks/useAuth';
import { profileApi } from '@/lib/api/profile';
import { resultsApi } from '@/lib/api/results';
import { ErrorDisplay, Skeleton, EmptyState } from '@/components/common';
import { Button, Avatar, AvatarFallback, Card, CardContent } from '@/components/ui';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  User,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Trophy,
  Clock,
  Edit3,
  Camera,
  Target,
  ClipboardList,
  BookOpen,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: personalProfile,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  } = useApi({
    apiFn: () => profileApi.getPersonalProfile(),
    deps: [],
  });

  const { data: historyData, loading: historyLoading } = useApi({
    apiFn: () => resultsApi.getHistory(1, 1),
    deps: [],
  });

  const loading = profileLoading || historyLoading;

  if (loading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto py-10 px-4">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 md:col-span-2 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <ErrorDisplay message={profileError} onRetry={refetchProfile} />
      </div>
    );
  }

  const getInitials = () => {
    if (personalProfile?.first_name && personalProfile?.last_name) {
      return `${personalProfile.first_name[0]}${personalProfile.last_name[0]}`.toUpperCase();
    }
    return (user?.name || user?.username || 'U')
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8"
    >
      {/* Hero Header Section */}
      <motion.div variants={itemVariants} className="relative group">
        <div className="h-40 sm:h-56 w-full rounded-[2.5rem] bg-gradient-to-r from-primary via-indigo-500 to-secondary overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:bg-black/20" />
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 blur-3xl rounded-full animate-pulse" />
          <div className="absolute bottom-[-30%] left-[-5%] w-80 h-80 bg-black/5 blur-3xl rounded-full" />

          <button className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-2.5 rounded-full transition-all active:scale-90 border border-white/20">
            <Camera className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 px-8 -mt-12 sm:-mt-16 relative z-10">
          <div className="relative group/avatar">
            <Avatar className="h-32 w-32 sm:h-40 sm:w-40 border-[6px] border-background shadow-2xl rounded-[2.5rem] bg-background overflow-hidden">
              <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl font-black">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-1.5 rounded-[2rem] border border-white/20 pointer-events-none" />
          </div>

          <div className="flex-1 text-center sm:text-left pb-4 space-y-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
              {personalProfile?.first_name && personalProfile?.last_name
                ? `${personalProfile.first_name} ${personalProfile.last_name}`
                : user?.name || user?.username || 'User'}
            </h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/80 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                <Target className="w-4 h-4 text-primary" />
                EQ Score: 87%
              </span>
              <span className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground/80 bg-muted/50 px-3 py-1 rounded-full border border-border/50">
                <Trophy className="w-4 h-4 text-amber-500" />
                Expert Level
              </span>
            </div>
          </div>

          <div className="pb-4">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Account Details */}
        <div className="space-y-8">
          <motion.div variants={itemVariants}>
            <Card className="rounded-[2.5rem] border-none bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5">
              <CardContent className="p-8">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Account Identity
                </h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-border/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Username</span>
                    </div>
                    <span className="text-sm font-bold">{user?.username}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-border/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Email</span>
                    </div>
                    <span className="text-sm font-bold truncate max-w-[120px]">
                      {user?.email || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-transparent hover:border-border/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-green-500/10 text-green-500">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Joined</span>
                    </div>
                    <span className="text-sm font-bold">
                      {user?.created_at
                        ? new Date(user.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-primary to-indigo-600 dark:from-primary/20 dark:to-indigo-600/20 shadow-xl text-white dark:text-foreground">
              <CardContent className="p-8 space-y-4">
                <div className="p-3 rounded-2xl bg-white/20 w-fit">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-black">
                  Member Since {user?.created_at ? new Date(user.created_at).getFullYear() : '2026'}
                </h3>
                <p className="text-sm opacity-80 font-medium">
                  You have been identifying emotions and growing your EQ for over 3 months!
                </p>
                <div className="pt-2">
                  <div className="w-full bg-white/20 rounded-full h-1.5">
                    <div className="bg-white h-full rounded-full w-[65%]" />
                  </div>
                  <p className="text-[10px] mt-2 font-bold uppercase tracking-widest opacity-70">
                    Experience: 750 / 1000 XP
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Profile Information & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: 'Exams Taken',
                  value: historyData?.total_count || '0',
                  icon: ClipboardList,
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10',
                },
                {
                  label: 'Journal Logs',
                  value: '12',
                  icon: BookOpen,
                  color: 'text-green-500',
                  bg: 'bg-green-500/10',
                },
                {
                  label: 'Streak Days',
                  value: '5',
                  icon: Trophy,
                  color: 'text-orange-500',
                  bg: 'bg-orange-500/10',
                },
                {
                  label: 'Insights',
                  value: '8',
                  icon: Target,
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/10',
                },
              ].map((stat, i) => (
                <Card
                  key={i}
                  className="rounded-3xl border-none shadow-lg shadow-black/5 hover:scale-105 transition-transform duration-300"
                >
                  <CardContent className="p-6 text-center space-y-2">
                    <div className={cn('mx-auto p-3 rounded-2xl w-fit', stat.bg)}>
                      <stat.icon className={cn('w-5 h-5', stat.color)} />
                    </div>
                    <p className="text-2xl font-black text-foreground">{stat.value}</p>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="rounded-[2.5rem] border-none bg-background/60 backdrop-blur-xl shadow-xl shadow-black/5">
              <CardContent className="p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                    <Edit3 className="w-6 h-6 text-primary" />
                    Bio Details
                  </h2>
                </div>

                {personalProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <DetailItem icon={Calendar} label="Age" value={personalProfile.age} />
                      <DetailItem
                        icon={User}
                        label="Gender"
                        value={personalProfile.gender}
                        className="capitalize"
                      />
                    </div>
                    <div className="space-y-6">
                      <DetailItem
                        icon={Briefcase}
                        label="Occupation"
                        value={personalProfile.occupation}
                      />
                      <DetailItem
                        icon={GraduationCap}
                        label="Education"
                        value={personalProfile.education_level}
                      />
                    </div>
                  </div>
                ) : (
                  <EmptyState
                    title="No Bio Found"
                    description="Fill in your bio details to help us personalize your EQ growth path."
                    action={
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(true)}
                        className="rounded-full px-8"
                      >
                        Complete Profile
                      </Button>
                    }
                  />
                )}

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-10 pt-8 border-t border-border/40"
                  >
                    <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                      <p className="text-sm text-primary font-semibold flex items-center gap-2">
                        <Edit3 className="w-4 h-4" />
                        Interactive editing form is coming soon!
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 font-medium">
                        You'll soon be able to update your name, occupation, and education level
                        directly from this page.
                      </p>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: any;
  label: string;
  value?: string | number;
  className?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 p-4 rounded-3xl bg-muted/20 border border-transparent hover:border-border/40 transition-all group">
      <div className="p-3 rounded-2xl bg-white shadow-sm group-hover:shadow-md transition-shadow">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest leading-loose">
          {label}
        </p>
        <p className={cn('text-lg font-black text-foreground', className)}>{value}</p>
      </div>
    </div>
  );
}
