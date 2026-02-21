import { TZDate } from '@date-fns/tz';
import { format, formatDistanceToNow, parseISO, startOfWeek } from 'date-fns';

import type { DateAnalysis, TimeOfDay } from '../types';

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

// export function convertToLocalTimezone(
//   origDate: Date,
//   timezone: string | null | undefined,
// ): string {
//   if (!timezone) return origDate.toISOString();
//   try {
//     const utcDate = origDate;
//     const localDate = new TZDate(utcDate.getTime(), timezone);
//     return formatWithTimezone(localDate, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone: timezone });
//   } catch {
//     return origDate.toISOString();
//   }
// }

export function parseDate(orig: string, timezone: string | null | undefined): DateAnalysis {
  const local = orig && timezone ? new TZDate(orig, timezone) : null;
  const date = local ?? parseISO(orig);

  const weekStart = format(startOfWeek(date), 'yyyy-MM-dd');
  const dayOfWeek = date.getDay();
  const hourOfDay = date.getHours();

  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isWorkHour = hourOfDay >= 9 && hourOfDay < 17;

  const timeOfDay: TimeOfDay = isWeekend ? 'weekend' : isWorkHour ? 'workday' : 'offHours';

  return { orig, local: local?.toString() ?? null, weekStart, dayOfWeek, hourOfDay, timeOfDay };
}
