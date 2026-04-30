// components/time-entry/TimeEntryForm.tsx
// Issues 1, 2, 3, 4:
//   - Multi-punch dynamic form (Issue 3)
//   - Negative/zero duration guard (Issue 1) via calculateDuration → sumPunches
//   - Correct duration math (Issue 2) via lib/time-utils
//   - No hardcoded job "123" — jobs come from /api/jobs (Issue 4)
"use client";

import { useState, useEffect, useCallback } from "react";
import { PunchRow } from "./PunchRow";
import { sumPunches, hasPunchOverlap } from "@/lib/time-utils";
import type { Job, Punch } from "@/lib/types/time-entry";

// ── Helpers ───────────────────────────────────────────────────────────────────

let _uid = 0;
function uid() {
  return `punch-${++_uid}-${Date.now()}`;
}

function newPunch(): Punch {
  return { id: uid(), clockIn: "", clockOut: "", jobId: "", hours: null };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface TimeEntryFormProps {
  employeeId: string;
  date: string; // "YYYY-MM-DD"
  onSuccess?: (totalHours: number) => void;
}

export function TimeEntryForm({ employeeId, date, onSuccess }: TimeEntryFormProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [punches, setPunches] = useState<Punch[]>([newPunch()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ── Issue 4: Fetch real jobs (no hardcoded "123") ─────────────────────────
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data: { jobs?: Job[] }) => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch((e) => console.error("[TimeEntryForm] Failed to load jobs:", e));
  }, []);

  const addPunch = useCallback(() => setPunches((prev) => [...prev, newPunch()]), []);

  const updatePunch = useCallback((i: number, updated: Punch) => {
    setPunches((prev) => {
      const next = [...prev];
      next[i] = updated;
      return next;
    });
  }, []);

  const removePunch = useCallback((i: number) => {
    setPunches((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  // ── Submit with all validations ───────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Issue 1 & 2: Check each closed punch for valid (positive) duration
    for (const p of punches) {
      if (p.clockIn && p.clockOut) {
        const { calculateDuration } = await import("@/lib/time-utils");
        const dur = calculateDuration(p.clockIn, p.clockOut);
        if (dur === null || dur <= 0) {
          setError("One or more punches have invalid times — clock-out must be after clock-in.");
          return;
        }
      }
    }

    const closedPunches = punches.filter((p) => p.clockOut);
    if (closedPunches.length === 0) {
      setError("At least one completed punch (with clock-out) is required.");
      return;
    }

    // Issue 3: Overlap guard
    if (hasPunchOverlap(punches)) {
      setError("Punch times overlap — please review your entries.");
      return;
    }

    const total = sumPunches(punches);
    if (total <= 0) {
      setError("Total hours must be greater than zero.");
      return;
    }

    // Check all closed punches have a job selected
    const missingJob = closedPunches.find((p) => !p.jobId);
    if (missingJob) {
      setError("Please select a job for every punch.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/time-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, date, punches }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Submission failed.");
        return;
      }

      setSuccess(true);
      setPunches([newPunch()]);
      onSuccess?.(total);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const total = sumPunches(punches);

  return (
    <form className="time-entry-form" onSubmit={handleSubmit} noValidate>
      <h2 className="time-entry-form__title">Log Time Entry</h2>
      <p className="time-entry-form__date">{date}</p>

      {/* Punch list */}
      <div className="time-entry-form__punches">
        {punches.map((p, i) => (
          <PunchRow
            key={p.id}
            punch={p}
            jobs={jobs}
            index={i}
            onChange={(updated) => updatePunch(i, updated)}
            onRemove={() => removePunch(i)}
            canRemove={punches.length > 1}
          />
        ))}
      </div>

      {/* Add punch button */}
      <button
        type="button"
        className="time-entry-form__add-punch"
        onClick={addPunch}
        disabled={submitting}
      >
        + Add Another Punch
      </button>

      {/* Running total */}
      <p className="time-entry-form__total">
        Total: <strong>{total.toFixed(2)} hrs</strong>
      </p>

      {/* Error / success feedback */}
      {error && (
        <p role="alert" className="time-entry-form__error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="time-entry-form__success">
          ✓ Time entry submitted successfully.
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="time-entry-form__submit"
        disabled={submitting}
      >
        {submitting ? "Submitting…" : "Submit Time Entry"}
      </button>
    </form>
  );
}
