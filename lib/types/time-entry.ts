// lib/types/time-entry.ts
// Shared type definitions for the Time Entry module.

// ── Issue 3: Multi-punch data model ──────────────────────────────────────────

/**
 * A single clock-in / clock-out pair tied to one job.
 * `id` is a client-generated UID for React key stability.
 * `clockOut` is an empty string while the punch is still open.
 * `hours` is null while the punch is open; populated on close.
 */
export type Punch = {
  id: string;
  clockIn: string;   // "HH:mm" 24-hour
  clockOut: string;  // "HH:mm" 24-hour — empty string if still open
  jobId: string;
  hours: number | null; // null while clock is open
  notes?: string;
};

/**
 * A full time-entry record for one employee on one calendar day.
 * May contain multiple punches (e.g., different jobs in the same day).
 */
export type TimeEntry = {
  id: string;
  employeeId: string;
  date: string;         // "YYYY-MM-DD"
  punches: Punch[];
  totalHours: number;   // sum of all closed punches
  status: "open" | "submitted" | "approved";
};

/**
 * Lightweight job shape used in dropdowns and punch rows.
 */
export type Job = {
  id: string;
  name: string;
};

/**
 * Shape of the expense submission payload.
 */
export type ExpenseSubmission = {
  employeeId: string;
  jobId: string;
  amount: number;
  category: string;
  date: string;         // "YYYY-MM-DD"
  receipt?: File | null;
};
