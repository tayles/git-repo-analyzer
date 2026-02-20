import { format, formatDistanceToNow, parseISO, startOfWeek } from 'date-fns';

export function relativeDateLabel(date: string): string {
  const relativeTimePast = formatDistanceToNow(parseISO(date), { addSuffix: true });
  return relativeTimePast;
}

export function weekStart(date: string): string {
  return format(startOfWeek(parseISO(date)), 'yyyy-MM-dd');
}

export function formatWeekLabel(date: string): string {
  return format(parseISO(date), 'LLL d');
}

export function formatDate(date: string): string {
  return format(parseISO(date), 'PP');
}
