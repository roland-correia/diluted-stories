// Calendar reminders, as .ics files the visitor adds to their own calendar.
// Made on the device and handed straight to the browser: nothing is sent anywhere,
// and Good Call never sees the calendar.

export interface Reminder {
  title: string;
  start: Date;
  minutes: number;
  description: string;
  /** Where the reminder leads back to. */
  url: string;
}

const two = (n: number) => String(n).padStart(2, '0');

// Local "floating" time: the event happens at 8pm wherever the visitor is.
const local = (d: Date) =>
  `${d.getFullYear()}${two(d.getMonth() + 1)}${two(d.getDate())}T${two(d.getHours())}${two(d.getMinutes())}00`;
const utc = (d: Date) =>
  `${d.getUTCFullYear()}${two(d.getUTCMonth() + 1)}${two(d.getUTCDate())}T${two(d.getUTCHours())}${two(d.getUTCMinutes())}${two(d.getUTCSeconds())}Z`;

// Text values escape backslashes, semicolons, commas and new lines (RFC 5545, 3.3.11).
const escape = (text: string) => text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

// Lines longer than 75 bytes are folded onto the next line, which starts with a space
// (RFC 5545, 3.1). Counted in UTF-8 bytes, so a £ or an emoji typed into a plan
// never makes a line too long, and never splits a character in two.
const bytes = (text: string) => new TextEncoder().encode(text).length;

function fold(line: string): string {
  const parts: string[] = [];
  let current = '';
  for (const char of line) {
    // The first line may have 75 bytes; each continuation starts with a space, so 74 more.
    const limit = parts.length === 0 ? 75 : 74;
    if (bytes(current + char) > limit) {
      parts.push(current);
      current = char;
    } else {
      current += char;
    }
  }
  parts.push(current);
  return parts.join('\r\n ');
}

export function icsText(reminder: Reminder): string {
  const end = new Date(reminder.start.getTime() + reminder.minutes * 60000);
  const uid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}@good-call`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Good Call//Reminders//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${utc(new Date())}`,
    `DTSTART:${local(reminder.start)}`,
    `DTEND:${local(end)}`,
    `SUMMARY:${escape(reminder.title)}`,
    `DESCRIPTION:${escape(`${reminder.description}\n${reminder.url}`)}`,
    `URL:${reminder.url}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escape(reminder.title)}`,
    'TRIGGER:PT0M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .map(fold)
    .join('\r\n');
}

/** Hands the reminder to the browser as a file, which the calendar app opens. */
export function addToCalendar(reminder: Reminder, filename = 'good-call-reminder.ics') {
  const blob = new Blob([icsText(reminder)], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 10000);
}

/** A time today or later: `days` from today at `hour` o'clock. */
function at(days: number, hour: number, now = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + days, hour, 0, 0);
}

/** Good moments for the next short session, all still in the future. */
export function nextMoments(now = new Date()): { label: string; start: Date }[] {
  const moments = [
    { label: 'Tonight, 8pm', start: at(0, 20, now) },
    { label: 'Tomorrow, 8am', start: at(1, 8, now) },
    { label: 'Tomorrow, 7pm', start: at(1, 19, now) },
    { label: 'In two days, 7pm', start: at(2, 19, now) },
  ];
  // At least half an hour away, so the reminder is not already due.
  return moments.filter((m) => m.start.getTime() - now.getTime() > 30 * 60000).slice(0, 3);
}

/** Tomorrow at 7pm, for a habit reminder. */
export const tomorrowEvening = (now = new Date()) => at(1, 19, now);
