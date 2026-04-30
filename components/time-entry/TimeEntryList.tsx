// components/time-entry/TimeEntryList.tsx
// Issue 4: Shows a warning banner when entries are assigned to the placeholder job "123".
// Also renders a list of submitted time entries.
"use client";

import { useState } from "react";
import type { TimeEntry } from "@/lib/types/time-entry";

const INVALID_JOB_ID = "123"; // placeholder job used during development

interface TimeEntryListProps {
  entries: TimeEntry[];
  onEntriesUpdated?: () => void;
}

export function TimeEntryList({ entries, onEntriesUpdated }: TimeEntryListProps) {
  const [reassigning, setReassigning] = useState(false);
  const [reassignJobId, setReassignJobId] = useState("");
  const [reassignResult, setReassignResult] = useState<string | null>(null);
  const [bulkReassignOpen, setBulkReassignOpen] = useState(false);

  // Issue 4: Find entries with the invalid placeholder job
  const pendingInvalidJob = entries.filter((e) =>
    e.punches.some((p) => p.jobId === INVALID_JOB_ID)
  );

  const handleBulkReassign = async () => {
    if (!reassignJobId.trim()) {
      setReassignResult("Please enter a valid Zoho job ID.");
      return;
    }

    setReassigning(true);
    setReassignResult(null);

    try {
      const res = await fetch("/api/time-entries/bulk-reassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fromJobId: INVALID_JOB_ID, toJobId: reassignJobId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReassignResult(`Error: ${data.error}`);
        return;
      }
      setReassignResult(
        `✓ Reassigned ${data.updated} of ${data.total} entries. ${data.failed > 0 ? `${data.failed} failed — check logs.` : ""}`
      );
      setBulkReassignOpen(false);
      onEntriesUpdated?.();
    } catch (err: unknown) {
      setReassignResult(err instanceof Error ? err.message : "Network error.");
    } finally {
      setReassigning(false);
    }
  };

  return (
    <div className="time-entry-list">
      {/* Issue 4: Warning banner for invalid-job entries */}
      {pendingInvalidJob.length > 0 && (
        <div className="time-entry-list__banner time-entry-list__banner--warning" role="alert">
          <p>
            <strong>{pendingInvalidJob.length}</strong>{" "}
            {pendingInvalidJob.length === 1 ? "entry is" : "entries are"} assigned to an invalid
            placeholder job.
          </p>
          <button
            type="button"
            className="time-entry-list__banner-btn"
            onClick={() => setBulkReassignOpen((v) => !v)}
          >
            Reassign All
          </button>

          {bulkReassignOpen && (
            <div className="time-entry-list__reassign-panel">
              <label htmlFor="reassign-job-id" className="time-entry-list__reassign-label">
                Target Zoho Job ID (the real "Office Staff" deal ID):
              </label>
              <input
                id="reassign-job-id"
                type="text"
                className="time-entry-list__reassign-input"
                placeholder="e.g. 7023000000123456"
                value={reassignJobId}
                onChange={(e) => setReassignJobId(e.target.value)}
              />
              <button
                type="button"
                className="time-entry-list__reassign-confirm"
                onClick={handleBulkReassign}
                disabled={reassigning}
              >
                {reassigning ? "Reassigning…" : "Confirm Reassign"}
              </button>
              {reassignResult && (
                <p className="time-entry-list__reassign-result">{reassignResult}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Entry list */}
      {entries.length === 0 ? (
        <p className="time-entry-list__empty">No time entries found.</p>
      ) : (
        <ul className="time-entry-list__items">
          {entries.map((entry) => (
            <li key={entry.id} className="time-entry-list__item">
              <div className="time-entry-list__item-header">
                <span className="time-entry-list__item-date">{entry.date}</span>
                <span className={`time-entry-list__item-status time-entry-list__item-status--${entry.status}`}>
                  {entry.status}
                </span>
                <span className="time-entry-list__item-total">
                  {entry.totalHours.toFixed(2)} hrs total
                </span>
              </div>
              <ul className="time-entry-list__punches">
                {entry.punches.map((p) => (
                  <li key={p.id} className="time-entry-list__punch">
                    <span>{p.clockIn} → {p.clockOut || "Open"}</span>
                    {p.hours !== null && (
                      <span className="time-entry-list__punch-hours">
                        {p.hours.toFixed(2)} hrs
                      </span>
                    )}
                    {p.jobId === INVALID_JOB_ID && (
                      <span className="time-entry-list__punch-invalid">
                        ⚠ Invalid job
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
