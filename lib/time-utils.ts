// lib/time-utils.ts
// Canonical time-entry utility functions.
// All duration math must go through calculateDuration() — never inline.

import type { Punch } from "@/lib/types/time-entry";

// ── Issue 2: Canonical duration calculation ───────────────────────────────────

/**
 * Calculates duration in decimal hours between two HH:mm (24-hour) strings.
 *
 * Divides by 60, NOT 100 — fixing the common 10.57 → 10.50 bug.
 * Returns null if:
 *   - Either string is unparseable
 *   - clockOut is not strictly after clockIn (blocks negatives — Issue 1)
 */
export function calculateDuration(clockIn: string, clockOut: string): number | null {
  const [inH, inM] = clockIn.split(":").map(Number);
  const [outH, outM] = clockOut.split(":").map(Number);

  if ([inH, inM, outH, outM].some(isNaN)) return null;

  const startMinutes = inH * 60 + inM;
  const endMinutes = outH * 60 + outM;
  const diffMinutes = endMinutes - startMinutes;

  // Rejects zero-duration and negative durations (Issue 1 guard)
  if (diffMinutes <= 0) return null;

  // Key: divide by 60, not 100. Round to 2 decimal places.
  return Math.round((diffMinutes / 60) * 100) / 100;
}

// ── Issue 2: AM/PM → 24-hour normaliser ──────────────────────────────────────

/**
 * Converts a 12-hour time string ("h:mm AM" / "h:mm PM") to 24-hour "HH:mm".
 * Handles edge cases: 12:00 AM → "00:00", 12:00 PM → "12:00".
 *
 * Pass raw clock-picker values through this before calling calculateDuration().
 */
export function to24Hour(timeStr: string): string {
  const parts = timeStr.trim().toUpperCase().split(" ");
  if (parts.length === 1) {
    // Already 24-hour format — return as-is after zero-padding
    const [h, m] = parts[0].split(":").map(Number);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const [time, meridiem] = parts;
  let [h, m] = time.split(":").map(Number);

  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ── Issue 3: Multi-punch helpers ──────────────────────────────────────────────

/** Converts an "HH:mm" string to total minutes since midnight. */
function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Sums the duration of all closed punches (those with a non-empty clockOut).
 * Open punches (no clockOut) are excluded from the total.
 */
export function sumPunches(punches: Punch[]): number {
  return punches
    .filter((p) => p.clockOut)
    .reduce((total, p) => {
      const hours = calculateDuration(p.clockIn, p.clockOut);
      return total + (hours ?? 0);
    }, 0);
}

/**
 * Returns true if any two closed punches overlap in time.
 * An exact boundary touch (e.g., 12:00 end / 12:00 start) is NOT an overlap.
 */
export function hasPunchOverlap(punches: Punch[]): boolean {
  const sorted = [...punches]
    .filter((p) => p.clockOut)
    .map((p) => ({
      start: toMinutes(p.clockIn),
      end: toMinutes(p.clockOut),
    }))
    .sort((a, b) => a.start - b.start);

  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].end > sorted[i + 1].start) return true;
  }
  return false;
}
