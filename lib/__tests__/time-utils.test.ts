// lib/__tests__/time-utils.test.ts
// Unit tests for Issues 1 & 2 — canonical duration calculation and AM/PM conversion.
// Run with: npx jest lib/__tests__/time-utils.test.ts

import {
  calculateDuration,
  to24Hour,
  sumPunches,
  hasPunchOverlap,
} from "@/lib/time-utils";
import type { Punch } from "@/lib/types/time-entry";

// ── Helper ────────────────────────────────────────────────────────────────────
function punch(clockIn: string, clockOut: string, jobId = "job-1"): Punch {
  return { id: `p-${Math.random()}`, clockIn, clockOut, jobId, hours: null };
}

// ── Issue 2: calculateDuration — correct math ─────────────────────────────────
describe("calculateDuration", () => {
  it("7:00 AM to 5:30 PM = 10.50 (not 10.57)", () =>
    expect(calculateDuration("07:00", "17:30")).toBe(10.5));

  it("7:00 AM to 5:00 PM = 10.00 (not 11.00)", () =>
    expect(calculateDuration("07:00", "17:00")).toBe(10.0));

  it("8:00 AM to 4:15 PM = 8.25", () =>
    expect(calculateDuration("08:00", "16:15")).toBe(8.25));

  it("9:00 AM to 12:00 PM = 3.00", () =>
    expect(calculateDuration("09:00", "12:00")).toBe(3.0));

  it("7:00 AM to 3:30 PM = 8.50", () =>
    expect(calculateDuration("07:00", "15:30")).toBe(8.5));

  // Issue 1: Negative / zero guards
  it("returns null for reversed times (clockOut before clockIn)", () =>
    expect(calculateDuration("17:00", "07:00")).toBeNull());

  it("returns null for equal times (zero duration)", () =>
    expect(calculateDuration("09:00", "09:00")).toBeNull());

  it("returns null for unparseable input", () =>
    expect(calculateDuration("abc", "def")).toBeNull());
});

// ── Issue 2: to24Hour — AM/PM normalisation ───────────────────────────────────
describe("to24Hour", () => {
  it("5:30 PM → 17:30", () => expect(to24Hour("5:30 PM")).toBe("17:30"));
  it("7:00 AM → 07:00", () => expect(to24Hour("7:00 AM")).toBe("07:00"));
  it("12:00 AM → 00:00", () => expect(to24Hour("12:00 AM")).toBe("00:00"));
  it("12:00 PM → 12:00", () => expect(to24Hour("12:00 PM")).toBe("12:00"));
  it("12:30 AM → 00:30", () => expect(to24Hour("12:30 AM")).toBe("00:30"));
  it("passes through 24-hour strings unchanged", () =>
    expect(to24Hour("14:45")).toBe("14:45"));
});

// ── Issue 3: sumPunches ───────────────────────────────────────────────────────
describe("sumPunches", () => {
  it("sums two non-overlapping punches", () => {
    const punches = [punch("07:00", "12:00"), punch("13:00", "17:00")];
    expect(sumPunches(punches)).toBe(9.0);
  });

  it("excludes open punches (no clockOut)", () => {
    const punches = [punch("07:00", "12:00"), punch("13:00", "")];
    expect(sumPunches(punches)).toBe(5.0);
  });

  it("returns 0 for an empty array", () => expect(sumPunches([])).toBe(0));
});

// ── Issue 3: hasPunchOverlap ──────────────────────────────────────────────────
describe("hasPunchOverlap", () => {
  it("returns false for non-overlapping punches", () => {
    const punches = [punch("07:00", "12:00"), punch("13:00", "17:00")];
    expect(hasPunchOverlap(punches)).toBe(false);
  });

  it("returns true for overlapping punches", () => {
    const punches = [punch("07:00", "13:00"), punch("11:00", "15:00")];
    expect(hasPunchOverlap(punches)).toBe(true);
  });

  it("allows boundary touch (end === start of next)", () => {
    const punches = [punch("07:00", "12:00"), punch("12:00", "17:00")];
    expect(hasPunchOverlap(punches)).toBe(false);
  });

  it("skips open punches in overlap check", () => {
    const punches = [punch("07:00", "12:00"), punch("11:00", "")];
    // Second punch is open — should not trigger overlap
    expect(hasPunchOverlap(punches)).toBe(false);
  });
});
