// components/time-entry/ExpenseForm.tsx
// Issue 5: Expense submission form — sends FormData (not JSON) to /api/expenses.
// Validates required fields, amount > 0, and receipt size < 20 MB before submitting.
"use client";

import { useState, useEffect } from "react";
import type { Job } from "@/lib/types/time-entry";

const MAX_RECEIPT_BYTES = 20 * 1024 * 1024; // 20 MB

interface ExpenseFormProps {
  employeeId: string;
  onSuccess?: (expenseId: string) => void;
}

export function ExpenseForm({ employeeId, onSuccess }: ExpenseFormProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [amount, setAmount] = useState("");
  const [jobId, setJobId] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Load jobs for the dropdown (Issue 4 fix — no hardcoded IDs)
  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data: { jobs?: Job[] }) => {
        if (data.jobs) setJobs(data.jobs);
      })
      .catch((e) => console.error("[ExpenseForm] Failed to load jobs:", e));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > MAX_RECEIPT_BYTES) {
      setError("Receipt file must be under 20 MB.");
      e.target.value = "";
      return;
    }
    setError(null);
    setReceipt(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!jobId) {
      setError("Please select a job.");
      return;
    }
    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }
    if (!category) {
      setError("Please select a category.");
      return;
    }
    if (!date) {
      setError("Please select a date.");
      return;
    }
    if (receipt && receipt.size > MAX_RECEIPT_BYTES) {
      setError("Receipt file must be under 20 MB.");
      return;
    }

    // Build FormData — do NOT set Content-Type manually
    const form = new FormData();
    form.append("employeeId", employeeId);
    form.append("jobId", jobId);
    form.append("amount", amount);
    form.append("category", category);
    form.append("date", date);
    if (receipt) form.append("receipt", receipt);

    setSubmitting(true);
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        body: form,
        // ⚠ Do NOT set Content-Type here — browser sets multipart boundary automatically
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Submission failed.");
        return;
      }

      setSuccess(true);
      // Reset form
      setAmount("");
      setJobId("");
      setCategory("");
      setDate(new Date().toISOString().split("T")[0]);
      setReceipt(null);
      onSuccess?.(data.expenseId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <h2 className="expense-form__title">Submit Expense</h2>

      {/* Job */}
      <div className="expense-form__field">
        <label htmlFor="expense-job" className="expense-form__label">
          Job <span aria-hidden="true">*</span>
        </label>
        <select
          id="expense-job"
          className="expense-form__select"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          required
        >
          <option value="">— Select job —</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div className="expense-form__field">
        <label htmlFor="expense-amount" className="expense-form__label">
          Amount ($) <span aria-hidden="true">*</span>
        </label>
        <input
          id="expense-amount"
          type="number"
          className="expense-form__input"
          min="0.01"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>

      {/* Category */}
      <div className="expense-form__field">
        <label htmlFor="expense-category" className="expense-form__label">
          Category <span aria-hidden="true">*</span>
        </label>
        <select
          id="expense-category"
          className="expense-form__select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">— Select category —</option>
          <option value="Materials">Materials</option>
          <option value="Equipment">Equipment</option>
          <option value="Fuel">Fuel</option>
          <option value="Meals">Meals</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Date */}
      <div className="expense-form__field">
        <label htmlFor="expense-date" className="expense-form__label">
          Date <span aria-hidden="true">*</span>
        </label>
        <input
          id="expense-date"
          type="date"
          className="expense-form__input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {/* Receipt upload */}
      <div className="expense-form__field">
        <label htmlFor="expense-receipt" className="expense-form__label">
          Receipt <span className="expense-form__optional">(optional, max 20 MB)</span>
        </label>
        <input
          id="expense-receipt"
          type="file"
          className="expense-form__file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />
      </div>

      {/* Error / success feedback */}
      {error && (
        <p role="alert" className="expense-form__error">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="expense-form__success">
          ✓ Expense submitted successfully.
        </p>
      )}

      <button
        type="submit"
        className="expense-form__submit"
        disabled={submitting}
      >
        {submitting ? "Submitting…" : "Submit Expense"}
      </button>
    </form>
  );
}
