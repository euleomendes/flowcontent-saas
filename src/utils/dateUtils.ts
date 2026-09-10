import { StaggerScheduleConfig } from '../types';

export const MONTH_NAMES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const WEEKDAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const WEEKDAYS_FULL_PT = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTimeToHHMM(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function getTodayISODate(): string {
  return formatDateToISO(new Date());
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return `${String(day).padStart(2, '0')} de ${MONTH_NAMES_PT[month - 1]}`;
}

export function formatDisplayDateTime(isoDate: string, time: string): string {
  return `${formatDisplayDate(isoDate)} às ${time}`;
}

// Generate calendar days for a given year and month (0-indexed)
export function getCalendarGrid(year: number, month: number): {
  date: Date;
  isoDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}[] {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = lastDayOfMonth.getDate();
  
  const grid: {
    date: Date;
    isoDate: string;
    isCurrentMonth: boolean;
    isToday: boolean;
  }[] = [];

  const todayISO = getTodayISODate();

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDate = new Date(year, month - 1, prevMonthLastDay - i);
    const isoDate = formatDateToISO(prevDate);
    grid.push({
      date: prevDate,
      isoDate,
      isCurrentMonth: false,
      isToday: isoDate === todayISO
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = new Date(year, month, day);
    const isoDate = formatDateToISO(currentDate);
    grid.push({
      date: currentDate,
      isoDate,
      isCurrentMonth: true,
      isToday: isoDate === todayISO
    });
  }

  // Next month leading days to complete full 35 or 42 grid cells
  const remainingCells = (7 - (grid.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextDate = new Date(year, month + 1, i);
    const isoDate = formatDateToISO(nextDate);
    grid.push({
      date: nextDate,
      isoDate,
      isCurrentMonth: false,
      isToday: isoDate === todayISO
    });
  }

  return grid;
}

// Helper to advance date by N business or regular days
export function advanceDate(baseDate: Date, days: number, skipWeekends = false): Date {
  const d = new Date(baseDate);
  if (!skipWeekends) {
    d.setDate(d.getDate() + days);
    return d;
  }

  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const dayOfWeek = d.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      added++;
    }
  }
  return d;
}

// Generate N well-distributed time slots across the day with optional organic broken minutes
export function generateDistributedTimeSlots(
  count: number,
  startHour = 8,
  endHour = 22,
  useOrganicMinutes = true
): string[] {
  if (count <= 0) return ['18:00'];
  if (count === 1) return ['18:14'];

  const totalMinutes = (endHour - startHour) * 60;
  const stepMinutes = Math.floor(totalMinutes / (count - 1 || 1));
  const slots: string[] = [];

  // Organic minute perturbations to avoid bot-like rounded times (e.g. 08:14 instead of 08:00)
  const organicJitters = [14, 32, 7, 48, 23, 39, 11, 52, 17, 29, 43, 6];

  for (let i = 0; i < count; i++) {
    let minuteOffset = startHour * 60 + i * stepMinutes;
    if (useOrganicMinutes && i > 0 && i < count - 1) {
      const jitter = (organicJitters[i % organicJitters.length] % 15) - 7;
      minuteOffset = Math.max(startHour * 60, Math.min(endHour * 60, minuteOffset + jitter));
    } else if (useOrganicMinutes && i === 0) {
      minuteOffset += 14; // e.g. 08:14
    } else if (useOrganicMinutes && i === count - 1) {
      minuteOffset -= 8; // e.g. 21:52
    }

    const h = Math.floor(minuteOffset / 60);
    const m = Math.floor(minuteOffset % 60);
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
  }

  return slots;
}

// Flexible Stagger schedule generator
export function calculateStaggeredSchedule(
  count: number,
  config: StaggerScheduleConfig
): { scheduledDate: string; scheduledTime: string }[] {
  const results: { scheduledDate: string; scheduledTime: string }[] = [];
  if (count <= 0) return results;

  const [startYear, startMonth, startDay] = config.startDate.split('-').map(Number);
  const baseStartDate = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);

  // 1. FREE POSTS PER DAY MODE (Core feature requested)
  if (config.rule === 'posts_per_day' || (config.postsPerDay && config.postsPerDay > 0)) {
    const postsPerDay = config.postsPerDay && config.postsPerDay > 0 
      ? config.postsPerDay 
      : (config.customTimeSlots && config.customTimeSlots.length > 0 ? config.customTimeSlots.length : 1);

    // Prepare time slots
    let slots = config.customTimeSlots && config.customTimeSlots.length > 0
      ? [...config.customTimeSlots]
      : [];

    // If user specified postsPerDay > slots provided, generate distributed slots
    if (slots.length < postsPerDay) {
      const generated = generateDistributedTimeSlots(postsPerDay, 8, 22, true);
      // Keep any already filled slots and append generated
      for (let i = slots.length; i < postsPerDay; i++) {
        slots.push(generated[i]);
      }
    } else if (slots.length > postsPerDay) {
      slots = slots.slice(0, postsPerDay);
    }

    for (let i = 0; i < count; i++) {
      const dayIndex = Math.floor(i / postsPerDay);
      const slotIndex = i % postsPerDay;
      const slotTime = slots[slotIndex] || '18:00';

      const postDate = advanceDate(baseStartDate, dayIndex, !!config.skipWeekends);

      results.push({
        scheduledDate: formatDateToISO(postDate),
        scheduledTime: slotTime,
      });
    }

    return results;
  }

  // 2. DAILY AT SAME TIME (Supports arbitrary minute/hour like 08:14)
  if (config.rule === 'daily_same_time') {
    const targetTime = config.startTime || '18:14';
    for (let i = 0; i < count; i++) {
      const postDate = advanceDate(baseStartDate, i, !!config.skipWeekends);
      results.push({
        scheduledDate: formatDateToISO(postDate),
        scheduledTime: targetTime,
      });
    }
    return results;
  }

  // 3. WEEKDAYS ONLY
  if (config.rule === 'weekdays_only') {
    const targetTime = config.startTime || '14:32';
    for (let i = 0; i < count; i++) {
      const postDate = advanceDate(baseStartDate, i, true);
      results.push({
        scheduledDate: formatDateToISO(postDate),
        scheduledTime: targetTime,
      });
    }
    return results;
  }

  // 4. TWICE DAILY (Supports custom slots e.g. 08:14 and 18:32)
  if (config.rule === 'twice_daily') {
    const slots = config.customTimeSlots && config.customTimeSlots.length >= 2
      ? config.customTimeSlots
      : ['12:15', '18:45'];

    for (let i = 0; i < count; i++) {
      const dayIndex = Math.floor(i / 2);
      const slotIndex = i % 2;
      const postDate = advanceDate(baseStartDate, dayIndex, !!config.skipWeekends);
      results.push({
        scheduledDate: formatDateToISO(postDate),
        scheduledTime: slots[slotIndex],
      });
    }
    return results;
  }

  // 5. CUSTOM GAP IN DAYS
  if (config.rule === 'custom_gap') {
    const gap = config.gapDays || 2;
    const targetTime = config.startTime || '18:00';
    for (let i = 0; i < count; i++) {
      const postDate = advanceDate(baseStartDate, i * gap, !!config.skipWeekends);
      results.push({
        scheduledDate: formatDateToISO(postDate),
        scheduledTime: targetTime,
      });
    }
    return results;
  }

  // 6. CONTINUOUS INTERVAL (Minutes / Hours) e.g. every 90 minutes from 08:14
  const [startHour, startMin] = (config.startTime || '08:14').split(':').map(Number);
  let currentCursor = new Date(startYear, startMonth - 1, startDay, startHour, startMin);
  const incrementMinutes = config.gapMinutes || (config.gapHours ? config.gapHours * 60 : 240);

  for (let i = 0; i < count; i++) {
    results.push({
      scheduledDate: formatDateToISO(currentCursor),
      scheduledTime: formatTimeToHHMM(currentCursor),
    });

    const nextDate = new Date(currentCursor.getTime() + incrementMinutes * 60 * 1000);
    currentCursor = nextDate;
  }

  return results;
}
