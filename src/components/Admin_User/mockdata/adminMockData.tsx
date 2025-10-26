export interface AdminKPI {
    label: string;
    value: number | string;
    change: number;
    changeLabel: string;
  }
  
  export interface AuditLogEntry {
    id: string;
    adminId: string;
    adminName: string;
    action: string;
    context: string;
    timestamp: Date;
    reason?: string;
  }
  
  export interface ModerationItem {
    id: string;
    type: 'review' | 'photo';
    contentId: string;
    reportReason: string;
    reportedBy: string;
    reportedAt: Date;
    status: 'pending' | 'approved' | 'rejected';
    content: any;
  }
  
  export interface TranslationJob {
    id: string;
    type: 'ui' | 'profiles' | 'reviews';
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    totalItems: number;
    startedAt: Date;
    completedAt?: Date;
    errors?: string[];
  }
  
  export const adminKPIs: AdminKPI[] = [
    { label: 'Total Providers', value: 247, change: 12, changeLabel: '+12 this week' },
    { label: 'Total Customers', value: 1823, change: 45, changeLabel: '+45 this week' },
    { label: 'MAU (30d)', value: 1456, change: 8.5, changeLabel: '+8.5% vs last month' },
    { label: 'New Signups (7d)', value: 57, change: -3, changeLabel: '-3 vs last week' },
    { label: 'Average Rating', value: '4.6', change: 2, changeLabel: '+0.2 this month' },
    { label: 'Open Moderation', value: 8, change: -5, changeLabel: '-5 from yesterday' },
  ];
  
  export const recentActivity = [
    { id: '1', type: 'signup', user: 'Thabo Mokoena', role: 'provider', time: '2 minutes ago' },
    { id: '2', type: 'review', user: 'Sarah van der Merwe', action: 'left a review', time: '15 minutes ago' },
    { id: '3', type: 'profile_update', user: 'Zanele Dlamini', action: 'updated profile', time: '1 hour ago' },
    { id: '4', type: 'signup', user: 'Johan Botha', role: 'customer', time: '2 hours ago' },
    { id: '5', type: 'verification', user: 'Nomvula Khumalo', action: 'submitted verification docs', time: '3 hours ago' },
  ];
  
  export const moderationQueue: ModerationItem[] = [
    {
      id: 'mod-1',
      type: 'review',
      contentId: 'review-123',
      reportReason: 'Inappropriate language',
      reportedBy: 'user-456',
      reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending',
      content: {
        rating: 1,
        text: 'Terrible service, never showed up!',
        author: 'Angry Customer',
        provider: 'Joe\'s Plumbing',
      },
    },
    {
      id: 'mod-2',
      type: 'photo',
      contentId: 'photo-789',
      reportReason: 'Not work-related content',
      reportedBy: 'user-789',
      reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      status: 'pending',
      content: {
        url: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837',
        provider: 'Sarah\'s Cleaning',
        uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      },
    },
  ];
  
  export const translationJobs: TranslationJob[] = [
    {
      id: 'job-1',
      type: 'profiles',
      status: 'completed',
      progress: 100,
      totalItems: 247,
      startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'job-2',
      type: 'ui',
      status: 'running',
      progress: 65,
      totalItems: 150,
      startedAt: new Date(Date.now() - 30 * 60 * 1000),
    },
    {
      id: 'job-3',
      type: 'reviews',
      status: 'failed',
      progress: 45,
      totalItems: 500,
      startedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      errors: ['API rate limit exceeded', 'Translation timeout for 3 items'],
    },
  ];
  
  export const auditLogs: AuditLogEntry[] = [
    {
      id: 'log-1',
      adminId: 'admin-1',
      adminName: 'Admin User',
      action: 'Suspended user',
      context: 'User ID: user-123 (Spam reports)',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      reason: 'Multiple spam reports',
    },
    {
      id: 'log-2',
      adminId: 'admin-2',
      adminName: 'Moderator Jane',
      action: 'Approved review',
      context: 'Review ID: review-456',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    },
    {
      id: 'log-3',
      adminId: 'admin-1',
      adminName: 'Admin User',
      action: 'Verified provider',
      context: 'Provider ID: provider-789 (Thabo Mokoena)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      reason: 'Verification documents approved',
    },
    {
      id: 'log-4',
      adminId: 'admin-1',
      adminName: 'Admin User',
      action: 'Updated system settings',
      context: 'Changed max search radius to 50km',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    },
  ];
  
  export const topSearchTerms = [
    { term: 'plumber', count: 342, trend: 15 },
    { term: 'electrician', count: 298, trend: 8 },
    { term: 'cleaner', count: 256, trend: -5 },
    { term: 'gardener', count: 187, trend: 22 },
    { term: 'painter', count: 145, trend: 3 },
    { term: 'handyman', count: 134, trend: 12 },
    { term: 'carpenter', count: 98, trend: -2 },
    { term: 'tiler', count: 76, trend: 18 },
  ];
  
  export const ratingDistribution = [
    { rating: 5, count: 450, percentage: 62 },
    { rating: 4, count: 180, percentage: 25 },
    { rating: 3, count: 65, percentage: 9 },
    { rating: 2, count: 20, percentage: 3 },
    { rating: 1, count: 8, percentage: 1 },
  ];
  
  export const signupData = [
    { date: '2025-10-15', providers: 8, customers: 25 },
    { date: '2025-10-16', providers: 12, customers: 32 },
    { date: '2025-10-17', providers: 6, customers: 18 },
    { date: '2025-10-18', providers: 15, customers: 40 },
    { date: '2025-10-19', providers: 10, customers: 28 },
    { date: '2025-10-20', providers: 9, customers: 22 },
    { date: '2025-10-21', providers: 14, customers: 35 },
    { date: '2025-10-22', providers: 11, customers: 30 },
  ];
  
  export const funnelData = [
    { stage: 'Discovery', users: 1456, percentage: 100 },
    { stage: 'View Provider', users: 876, percentage: 60 },
    { stage: 'Contact Provider', users: 342, percentage: 23 },
    { stage: 'Booking', users: 156, percentage: 11 },
  ];