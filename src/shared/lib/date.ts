import {
  addDays,
  differenceInCalendarMonths,
  differenceInCalendarYears,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  isFuture,
} from 'date-fns';

export function toMilliseconds(n: number, t: 'secs' | 'mins' | 'hours' | 'days' | 'months'): number {
  const conversions: Record<string, number> = {
    secs: 1000,
    mins: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
  };

  if (!conversions[t]) {
    throw new Error(`Invalid time unit: ${t}`);
  }

  return n * conversions[t];
}

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'medium',
});

export function formatDateTime(date: Date | number, _ = 'short-date-medium-time') {
  return dateFormatter.format(date);
}

export const toDateInputValue = (date: Date, type: 'date' | 'datetime-local') => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  if (type === 'date') {
    return `${year}-${month}-${day}`;
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const minInputDate = (minDate?: string, minDays = 0) => {
  if (!minDate) return toDateInputValue(new Date(), 'datetime-local');
  const minDateAsDate = new Date(minDate);

  return toDateInputValue(addDays(minDateAsDate, minDays), 'datetime-local');
};

export function toRelativeDate(date: Date, prefix: { future: string; past: string } = { future: 'em', past: 'há' }) {
  const now = new Date();

  const diffYears = Math.abs(differenceInCalendarYears(now, date));
  const diffMonths = Math.abs(differenceInCalendarMonths(now, date));
  const diffDays = Math.abs(differenceInDays(now, date));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffHours = Math.abs(differenceInHours(now, date));
  const diffMinutes = Math.abs(differenceInMinutes(now, date));

  const inFuture = isFuture(date);

  const template = (date: string) => `${prefix[inFuture ? 'future' : 'past']} ${date}`;

  if (diffYears) {
    return template(`${diffYears} ano${diffYears > 1 ? 's' : ''}`);
  }

  if (diffMonths) {
    return template(`${diffMonths} mês${diffMonths > 1 ? 'es' : ''}`);
  }

  if (diffDays) {
    if (diffDays === 1) {
      return inFuture ? 'Amanhã' : 'Ontem';
    }

    if (diffDays < 7) {
      return template(`${diffDays} dia${diffDays > 1 ? 's' : ''}`);
    }

    if (diffWeeks === 1) {
      return template('uma semana');
    }

    return template(`${diffWeeks} semana${diffWeeks > 1 ? 's' : ''}`);
  }

  if (diffHours) {
    if (diffHours === 1) {
      return template('1 hora');
    }

    return `${diffHours} horas atrás`;
  }

  if (diffMinutes) {
    if (diffMinutes === 1) {
      return '1 minuto atrás';
    }

    return `${diffMinutes} minutos atrás`;
  }

  return 'Agora';
}
