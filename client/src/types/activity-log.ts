// client/src/types/activity-log.ts
export interface ActivityLog {
  id: number;
  user_id: number;
  activity: string;
  timestamp: string; // or Date if you want, but keep consistent
}
