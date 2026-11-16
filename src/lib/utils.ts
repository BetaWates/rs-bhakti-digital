// ============================================================================
// RS Bhakti Digital SIMRS - Foundation Layer: Helper Utilities
// Formatting, Queue Logic, Date / Age Calculation, Greeting, & Styling Helpers
// ============================================================================

/**
 * Formats a numeric amount as Indonesian Rupiah (IDR).
 * Example: 150000 -> "Rp 150.000"
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rp 0';
  }
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  // Normalize spacing between currency symbol and amount
  return formatted.replace(/^Rp\s*/, 'Rp ');
}

/**
 * Formats a date into localized Indonesian representation.
 * Supports styles: 'short' (14/11/2026), 'medium' (14 Nov 2026),
 * 'long' (14 November 2026), 'full' (Sabtu, 14 November 2026).
 */
export function formatDate(
  dateInput: string | Date | number | null | undefined,
  style: 'short' | 'medium' | 'long' | 'full' = 'long'
): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  if (style === 'short') {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  }

  if (style === 'medium') {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  }

  if (style === 'full') {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  // Default: 'long'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Formats a date and time into Indonesian standard with WIB zone indication.
 * Example: "14 Nov 2026, 09:15 WIB"
 */
export function formatDateTime(
  dateInput: string | Date | number | null | undefined,
  includeSeconds: boolean = false
): string {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '-';

  const datePart = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: false,
  }).format(date);

  return `${datePart}, ${timePart.replace('.', ':')} WIB`;
}

/**
 * Generates an outpatient clinic queue ticket number.
 * Example: generateQueueNumber('A', 1) -> "A-001"
 */
export function generateQueueNumber(prefixOrPoli: string, currentNumber: number): string {
  const prefix = (prefixOrPoli.trim().toUpperCase() || 'A').slice(0, 3);
  const formattedNumber = String(currentNumber).padStart(3, '0');
  return `${prefix}-${formattedNumber}`;
}

/**
 * Returns an Indonesian formal greeting according to the current local time.
 * - Pagi: 04:00 - 10:59
 * - Siang: 11:00 - 14:59
 * - Sore: 15:00 - 18:29
 * - Malam: 18:30 - 03:59
 */
export function getGreeting(date: Date = new Date()): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const decimalHours = hours + minutes / 60;

  if (decimalHours >= 4 && decimalHours < 11) {
    return 'Selamat pagi';
  }
  if (decimalHours >= 11 && decimalHours < 15) {
    return 'Selamat siang';
  }
  if (decimalHours >= 15 && decimalHours < 18.5) {
    return 'Selamat sore';
  }
  return 'Selamat malam';
}

/**
 * Calculates accurate chronological age in years from a birth date.
 */
export function calculateAge(birthDateInput: string | Date | null | undefined): number {
  if (!birthDateInput) return 0;
  const birthDate = typeof birthDateInput === 'string' ? new Date(birthDateInput) : birthDateInput;
  if (isNaN(birthDate.getTime())) return 0;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return Math.max(0, age);
}

/**
 * Helper to display human-readable age text.
 * Example: 34 -> "34 tahun"
 */
export function formatAge(birthDateInput: string | Date | null | undefined): string {
  const age = calculateAge(birthDateInput);
  return `${age} thn`;
}

/**
 * Generates or increments an Indonesian Medical Record Number (No. RM).
 * Example: 2495 -> "RM-002495", "RM-002494" -> "RM-002495"
 */
export function generateNoRM(counterOrLastNoRM?: number | string): string {
  if (typeof counterOrLastNoRM === 'number') {
    return `RM-${String(counterOrLastNoRM).padStart(6, '0')}`;
  }

  if (typeof counterOrLastNoRM === 'string' && counterOrLastNoRM.startsWith('RM-')) {
    const rawDigits = counterOrLastNoRM.replace(/\D/g, '');
    const currentVal = parseInt(rawDigits, 10);
    if (!isNaN(currentVal)) {
      return `RM-${String(currentVal + 1).padStart(6, '0')}`;
    }
  }

  // Fallback generation based on incremental timestamp digits
  const fallback = Math.floor(2500 + Math.random() * 500);
  return `RM-${String(fallback).padStart(6, '0')}`;
}

/**
 * Utility type for class value joining without external dependencies.
 */
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | undefined | null }
  | ClassValue[];

/**
 * Merges conditional CSS class names into a single clean string.
 * Native replacement for clsx / classnames suitable for Tailwind CSS v4.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) classes.push(nested);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (Boolean(value)) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Formats a 16-digit Indonesian NIK with groupings.
 * Example: 3171014503920001 -> "3171-0145-0392-0001"
 */
export function formatNIK(nik?: string): string {
  if (!nik) return '-';
  const clean = nik.replace(/\D/g, '');
  if (clean.length !== 16) return nik;
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}-${clean.slice(8, 12)}-${clean.slice(12, 16)}`;
}

/**
 * Formats a 13-digit BPJS Kesehatan card number.
 * Example: 0001234567891 -> "000-123-456-789-1"
 */
export function formatBPJS(noBpjs?: string): string {
  if (!noBpjs) return '-';
  const clean = noBpjs.replace(/\D/g, '');
  if (clean.length < 11) return noBpjs;
  return clean.replace(/(\d{3})(?=\d)/g, '$1-');
}
