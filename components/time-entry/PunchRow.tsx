// components/time-entry/PunchRow.tsx
// Issue 3: A single editable punch row within the TimeEntryForm.
// Shows job selector, clock-in/out time pickers, live duration, and a remove button.
"use client";

import { calculateDuration } from "@/lib/time-utils";
import type { Job, Punch } from "@/lib/types/time-entry";

interface PunchRowProps {
  punch: Punch;
  jobs: Job[];
  index: number;
  onChange: (updated: Punch) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function PunchRow({ punch, jobs, index, onChange, onRemove, canRemove }: PunchRowProps) {
  const duration =
    punch.clockIn && punch.clockOut
      ? calculateDuration(punch.clockIn, punch.clockOut)
      : null;

  const hasTimeError =
    punch.clockIn && punch.clockOut && duration === null;

  return (
    <div className="punch-row" aria-label={`Punch ${index + 1}`}>
      {/* Job selector */}
      <div className="punch-field">
        <label htmlFor={`job-${punch.id}`} className="punch-label">
          Job
        </label>
        <select
          id={`job-${punch.id}`}
          className="punch-select"
          value={punch.jobId}
          onChange={(e) => onChange({ ...punch, jobId: e.target.value })}
        >
          <option value="">— Select job —</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>
      </div>

      {/* Clock In */}
      <div className="punch-field">
        <label htmlFor={`in-${punch.id}`} className="punch-label">
          Clock In
        </label>
        <input
          id={`in-${punch.id}`}
          type="time"
          className="punch-input"
          value={punch.clockIn}
          onChange={(e) => onChange({ ...punch, clockIn: e.target.value })}
        />
      </div>

      {/* Clock Out */}
      <div className="punch-field">
        <label htmlFor={`out-${punch.id}`} className="punch-label">
          Clock Out
        </label>
        <input
          id={`out-${punch.id}`}
          type="time"
          className={`punch-input${hasTimeError ? " punch-input--error" : ""}`}
          value={punch.clockOut}
          onChange={(e) => onChange({ ...punch, clockOut: e.target.value })}
        />
      </div>

      {/* Duration badge */}
      <div className="punch-duration" aria-live="polite">
        {hasTimeError ? (
          <span className="punch-duration--error">⚠ Invalid</span>
        ) : duration !== null ? (
          <span className="punch-duration--value">{duration.toFixed(2)} hrs</span>
        ) : (
          <span className="punch-duration--open">Open</span>
        )}
      </div>

      {/* Notes */}
      <div className="punch-field punch-field--notes">
        <label htmlFor={`notes-${punch.id}`} className="punch-label">
          Notes
        </label>
        <input
          id={`notes-${punch.id}`}
          type="text"
          className="punch-input"
          placeholder="Optional notes…"
          value={punch.notes ?? ""}
          onChange={(e) => onChange({ ...punch, notes: e.target.value })}
        />
      </div>

      {/* Remove button */}
      {canRemove && (
        <button
          type="button"
          className="punch-remove"
          onClick={onRemove}
          aria-label={`Remove punch ${index + 1}`}
        >
          Remove
        </button>
      )}
    </div>
  );
}
