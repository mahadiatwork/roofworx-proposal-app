# RoofWorx Time Entry App — Bug Fix & Feature Implementation Plan

> **Important context:** The current repo (`roofworx-proposal-app`) is a **proposal/quote builder** with no existing time-entry, expense, or punch-clock code. The five issues below describe a **Time Entry module** that either lives in a companion app or is planned for this codebase. All file paths below are relative to the project root and follow the existing Next.js App Router conventions already in place. New files should be created alongside the existing `app/api/proposals/` and `components/proposal/` structure.

---

## Issue 1: Prevent Negative Time Entries

### Problem

The system accepts a negative value (e.g., `-2.50`) as valid hours for a time entry. This can happen in two places:

1. **UI input** — a `<input type="number">` with no `min` constraint lets users type any value.
2. **Calculated duration** — if `clockOut` is before `clockIn` (data entry mistake or midnight-crossing not handled), the computed duration is negative and the system does not reject it.
3. **API layer** — the POST handler for time entry creation does not validate that hours > 0 before persisting to Zoho CRM.

---

### Files to Update

| File | Action |
|------|--------|
| `components/time-entry/TimeEntryForm.tsx` | Add client-side `min="0"` and pre-submit guard |
| `lib/time-utils.ts` | Create `calculateDuration()` with negativity check |
| `app/api/time-entries/route.ts` | Add server-side validation before Zoho write |

---

### Steps to Fix

#### Step 1 — Create `lib/time-utils.ts`

```typescript
// lib/time-utils.ts

/**
 * Calculates duration in decimal hours between two HH:mm strings.
 * Returns null if clockOut is not after clockIn.
 */
export function calculateDuration(clockIn: string, clockOut: string): number | null {
  const [inH, inM] = clockIn.split(":").map(Number);
  const [outH, outM] = clockOut.split(":").map(Number);

  const startMinutes = inH * 60 + inM;
  const endMinutes = outH * 60 + outM;
  const diffMinutes = endMinutes - startMinutes;

  if (diffMinutes <= 0) return null; // rejects zero and negative

  return Math.round((diffMinutes / 60) * 100) / 100; // 2 decimal places
}
```

#### Step 2 — Add client-side guard in `TimeEntryForm.tsx`

```tsx
// components/time-entry/TimeEntryForm.tsx

import { calculateDuration } from "@/lib/time-utils";

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const duration = calculateDuration(clockIn, clockOut);
  if (duration === null) {
    toast.error("Clock-out must be later than clock-in.");
    return;
  }
  if (duration <= 0) {
    toast.error("Hours must be greater than zero.");
    return;
  }

  onSubmit({ clockIn, clockOut, hours: duration, jobId, notes });
};
```

Also add `min="0"` and `step="0.25"` to any manual hours `<input>`:

```tsx
<input
  type="number"
  min="0"
  step="0.25"
  value={hours}
  onChange={(e) => setHours(Math.max(0, parseFloat(e.target.value) || 0))}
/>
```

#### Step 3 — Add server-side validation in `app/api/time-entries/route.ts`

```typescript
// app/api/time-entries/route.ts  (POST handler)

import { calculateDuration } from "@/lib/time-utils";

export async function POST(req: Request) {
  const body = await req.json();
  const { employeeId, jobId, clockIn, clockOut, date } = body;

  if (!employeeId || !jobId || !clockIn || !clockOut || !date) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const hours = calculateDuration(clockIn, clockOut);
  if (hours === null || hours <= 0) {
    return NextResponse.json(
      { error: "Invalid time range: clock-out must be after clock-in" },
      { status: 422 }
    );
  }

  // Proceed to Zoho write with `hours` value
}
```

---

### Potential Side Effects

- Existing negative entries already in Zoho CRM are not retroactively fixed by this change. A one-time data cleanup script should be run against those records separately.
- If any report or payroll export relies on the sign of hours (e.g., corrections entered as negatives), that workflow must be redesigned before deploying this fix.

---

### Testing / Validation

1. **Form test:** Enter `clockIn = 14:00`, `clockOut = 09:00` → expect toast error, no submission.
2. **Form test:** Manually type `-2.5` into a direct hours field → expect value clamped to `0`.
3. **API test (curl/Postman):** POST with `clockIn: "17:00", clockOut: "07:00"` → expect HTTP 422.
4. **API test:** POST with valid range (e.g., `07:00` → `15:30`) → expect HTTP 200 and hours = `8.5`.

---

---

## Issue 2: Miscalculations in Duration

### Problem

Two confirmed examples of wrong duration values:

| Entry ID | Reported | Expected | Clock Range |
|----------|----------|----------|-------------|
| 202620 | 10.57 hrs | 10.50 hrs | 7:00 AM – 5:30 PM |
| 202624 | 11.00 hrs | 10.00 hrs | 7:00 AM – 5:00 PM |

**Root cause for 202620 (`10.57` instead of `10.50`):**

The most common cause of this exact discrepancy is dividing minutes by `100` instead of `60`:

```typescript
// BUGGY — treating HH:MM as a decimal
const asDecimal = parseFloat("10:34".replace(":", ".")); // → 10.34 ✗
// or
const asDecimal = parseFloat("10:34".replace(":", ",")); // locale bug
```

**Root cause for 202624 (`11.00` instead of `10.00`):**

An off-by-one error, likely a timezone offset being added (+1 hour) or AM/PM parsing incorrectly treating 5 PM as 6 PM in a 12-hour format without proper meridiem handling.

---

### Files to Update

| File | Action |
|------|--------|
| `lib/time-utils.ts` | Replace any incorrect calculation with the canonical implementation below |
| `components/time-entry/TimeEntryForm.tsx` | Ensure displayed duration uses `calculateDuration()`, not a custom inline formula |
| `app/api/time-entries/route.ts` | Use `calculateDuration()` as the single source of truth for hours |

---

### Steps to Fix

#### Step 1 — Canonical calculation in `lib/time-utils.ts`

```typescript
// lib/time-utils.ts

export function calculateDuration(clockIn: string, clockOut: string): number | null {
  // Accepts "HH:mm" in 24-hour format only — never parse AM/PM here.
  const [inH, inM] = clockIn.split(":").map(Number);
  const [outH, outM] = clockOut.split(":").map(Number);

  if ([inH, inM, outH, outM].some(isNaN)) return null;

  const startMinutes = inH * 60 + inM;
  const endMinutes = outH * 60 + outM;
  const diffMinutes = endMinutes - startMinutes;

  if (diffMinutes <= 0) return null;

  // Key: divide by 60, not 100. Round to 2 decimal places.
  return Math.round((diffMinutes / 60) * 100) / 100;
}
```

**Verification:**
- `calculateDuration("07:00", "17:30")` → `630 / 60 = 10.5` → `10.50` ✓
- `calculateDuration("07:00", "17:00")` → `600 / 60 = 10.0` → `10.00` ✓

#### Step 2 — Fix AM/PM → 24-hour conversion (if UI uses 12-hour inputs)

If the time pickers store values in 12-hour format (e.g., `"5:00 PM"`), add a normalizer:

```typescript
// lib/time-utils.ts

export function to24Hour(timeStr: string): string {
  // Accepts "h:mm AM" or "h:mm PM", returns "HH:mm"
  const [time, meridiem] = timeStr.trim().toUpperCase().split(" ");
  let [h, m] = time.split(":").map(Number);

  if (meridiem === "PM" && h !== 12) h += 12;
  if (meridiem === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
```

```typescript
// Usage in form / API:
const normalizedIn = to24Hour(rawClockIn);   // "7:00 AM" → "07:00"
const normalizedOut = to24Hour(rawClockOut); // "5:30 PM" → "17:30"
const hours = calculateDuration(normalizedIn, normalizedOut); // 10.5
```

#### Step 3 — Remove all inline duration calculations

Search the codebase for any ad-hoc duration math and replace it with `calculateDuration()`:

```bash
# Find any inline hour math that might be using /100
grep -r "minutes\s*/\s*100\|\/100" app/ components/ lib/
grep -r "parseFloat.*replace.*\"\.\"\|split.*\":\"" app/ components/ lib/
```

---

### Potential Side Effects

- Existing entries with wrong values in Zoho CRM will still show old data until re-saved. Provide a bulk correction UI or script.
- If payroll already exported the wrong hours, flag those entries for manual review.

---

### Testing / Validation

```typescript
// Unit tests for lib/time-utils.ts
import { calculateDuration, to24Hour } from "@/lib/time-utils";

describe("calculateDuration", () => {
  it("7am to 5:30pm = 10.50", () => expect(calculateDuration("07:00", "17:30")).toBe(10.50));
  it("7am to 5pm = 10.00",    () => expect(calculateDuration("07:00", "17:00")).toBe(10.00));
  it("8am to 4:15pm = 8.25",  () => expect(calculateDuration("08:00", "16:15")).toBe(8.25));
  it("returns null for reversed times", () => expect(calculateDuration("17:00", "07:00")).toBeNull());
  it("returns null for equal times",    () => expect(calculateDuration("09:00", "09:00")).toBeNull());
});

describe("to24Hour", () => {
  it("5:30 PM → 17:30", () => expect(to24Hour("5:30 PM")).toBe("17:30"));
  it("12:00 AM → 00:00", () => expect(to24Hour("12:00 AM")).toBe("00:00"));
  it("12:00 PM → 12:00", () => expect(to24Hour("12:00 PM")).toBe("12:00"));
});
```

---

---

## Issue 3: Allow Multiple Punches Per Day

### Problem

The current design only tracks a single clock-in/clock-out per day per employee. Roofers may work across multiple job sites in one day (e.g., Job A in the morning, Job B in the afternoon). The system needs to support an open-ended list of punch pairs per employee per day.

**Complexity:** Medium-High  
**Estimated Effort:** 2–4 days (UI + API + data model + Zoho mapping)

---

### Files to Update

| File | Action |
|------|--------|
| `lib/types/time-entry.ts` | Redefine `TimeEntry` type to support punch arrays |
| `lib/time-utils.ts` | Add `sumPunches()` helper |
| `components/time-entry/TimeEntryForm.tsx` | Replace single-pair form with dynamic punch list |
| `components/time-entry/PunchRow.tsx` | New component — single editable punch row |
| `app/api/time-entries/route.ts` | Accept array of punches; validate each pair |
| `app/api/time-entries/[entryId]/route.ts` | PATCH for adding/editing/removing a punch |

---

### New Type Definition

```typescript
// lib/types/time-entry.ts

export type Punch = {
  id: string;         // uid() — client-generated
  clockIn: string;    // "HH:mm" 24-hour
  clockOut: string;   // "HH:mm" 24-hour — empty string if still open
  jobId: string;
  hours: number | null; // null while clock is open
  notes?: string;
};

export type TimeEntry = {
  id: string;
  employeeId: string;
  date: string;          // "YYYY-MM-DD"
  punches: Punch[];
  totalHours: number;    // sum of all closed punches
  status: "open" | "submitted" | "approved";
};
```

---

### Steps to Fix

#### Step 1 — Add `sumPunches()` to `lib/time-utils.ts`

```typescript
// lib/time-utils.ts

export function sumPunches(punches: Punch[]): number {
  return punches
    .filter((p) => p.clockOut) // skip open punches
    .reduce((total, p) => {
      const hours = calculateDuration(p.clockIn, p.clockOut);
      return total + (hours ?? 0);
    }, 0);
}
```

#### Step 2 — Validate no punch overlaps

```typescript
// lib/time-utils.ts

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

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
```

#### Step 3 — `PunchRow` component

```tsx
// components/time-entry/PunchRow.tsx
"use client";

import { calculateDuration } from "@/lib/time-utils";

interface PunchRowProps {
  punch: Punch;
  jobs: Job[];
  onChange: (updated: Punch) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function PunchRow({ punch, jobs, onChange, onRemove, canRemove }: PunchRowProps) {
  const duration = punch.clockOut
    ? calculateDuration(punch.clockIn, punch.clockOut)
    : null;

  return (
    <div className="flex gap-2 items-center">
      <select value={punch.jobId} onChange={(e) => onChange({ ...punch, jobId: e.target.value })}>
        {jobs.map((j) => <option key={j.id} value={j.id}>{j.name}</option>)}
      </select>
      <input type="time" value={punch.clockIn}
        onChange={(e) => onChange({ ...punch, clockIn: e.target.value })} />
      <input type="time" value={punch.clockOut}
        onChange={(e) => onChange({ ...punch, clockOut: e.target.value })} />
      <span className="text-sm text-muted-foreground w-16">
        {duration !== null ? `${duration.toFixed(2)} hrs` : "Open"}
      </span>
      {canRemove && (
        <button type="button" onClick={onRemove} className="text-destructive text-sm">Remove</button>
      )}
    </div>
  );
}
```

#### Step 4 — `TimeEntryForm` with dynamic punch list

```tsx
// components/time-entry/TimeEntryForm.tsx
"use client";

import { PunchRow } from "./PunchRow";
import { sumPunches, hasPunchOverlap } from "@/lib/time-utils";

export function TimeEntryForm({ jobs, onSubmit }) {
  const [punches, setPunches] = useState<Punch[]>([newPunch()]);

  const addPunch = () => setPunches([...punches, newPunch()]);

  const updatePunch = (i: number, updated: Punch) => {
    const next = [...punches];
    next[i] = updated;
    setPunches(next);
  };

  const removePunch = (i: number) => {
    setPunches(punches.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const closedPunches = punches.filter((p) => p.clockOut);
    if (closedPunches.length === 0) {
      toast.error("At least one closed punch is required to submit.");
      return;
    }
    if (hasPunchOverlap(punches)) {
      toast.error("Punch times overlap — please review your entries.");
      return;
    }
    const total = sumPunches(punches);
    if (total <= 0) {
      toast.error("Total hours must be greater than zero.");
      return;
    }

    onSubmit({ punches, totalHours: total });
  };

  return (
    <form onSubmit={handleSubmit}>
      {punches.map((p, i) => (
        <PunchRow key={p.id} punch={p} jobs={jobs}
          onChange={(u) => updatePunch(i, u)}
          onRemove={() => removePunch(i)}
          canRemove={punches.length > 1}
        />
      ))}
      <button type="button" onClick={addPunch}>+ Add Punch</button>
      <p className="text-sm font-medium">Total: {sumPunches(punches).toFixed(2)} hrs</p>
      <button type="submit">Submit</button>
    </form>
  );
}

function newPunch(): Punch {
  return { id: uid(), clockIn: "", clockOut: "", jobId: "", hours: null };
}
```

#### Step 5 — API: Accept punch array

```typescript
// app/api/time-entries/route.ts

export async function POST(req: Request) {
  const { employeeId, date, punches } = await req.json();

  if (!Array.isArray(punches) || punches.length === 0) {
    return NextResponse.json({ error: "punches array required" }, { status: 400 });
  }

  // Validate each punch
  for (const p of punches) {
    if (p.clockOut) {
      const hours = calculateDuration(p.clockIn, p.clockOut);
      if (hours === null) {
        return NextResponse.json(
          { error: `Invalid punch: clockOut before clockIn for punch ${p.id}` },
          { status: 422 }
        );
      }
    }
  }

  if (hasPunchOverlap(punches)) {
    return NextResponse.json({ error: "Punch times overlap" }, { status: 422 });
  }

  // Write each punch as a separate Zoho record or as sub-records
  // depending on your Zoho data model
  const totalHours = sumPunches(punches);
  // ... persist to Zoho
}
```

---

### Data Model Consideration — Zoho CRM

Currently Zoho stores one time entry per record. For multiple punches, choose one of:

| Option | Pros | Cons |
|--------|------|------|
| **One Zoho record per punch** | Simple, queryable | More records, harder to see "day total" |
| **One parent record + child punch records** | Mirrors the type model above | Requires a junction module in Zoho |
| **JSON field on parent record** | Single record | Not queryable per-punch in Zoho reports |

**Recommendation:** One record per punch (easiest to implement, most Zoho-native). The daily total is computed in the app by fetching all punches for a date.

---

### Potential Side Effects

- The existing UI for viewing/editing a single daily entry needs to be updated to show a list.
- Any payroll export that expects one row per day will need to be updated to group by employee + date.
- The "open clock" (no clockOut yet) state needs to be handled — either allow saving with an open punch or require all punches to be closed on submit.

---

### Testing / Validation

1. Add two punches (Job A: 7am–12pm, Job B: 1pm–5pm) → expect total = 9.00 hrs.
2. Add overlapping punches (7am–1pm and 11am–3pm) → expect overlap error on submit.
3. Add a punch with no clockOut → verify it shows "Open" and is excluded from total.
4. Submit a day with 4 punches across 3 jobs → verify all 4 Zoho records created with correct hours.

---

---

## Issue 4: Pending Time Entries / "Office Staff" Job Ticket

### Problem

Time entries are showing as "pending" because they were assigned to **Job ID `123`** — a fake/placeholder job that does not exist as a real deal in Zoho CRM. This also suggests the "Office Staff" job is either:

1. Missing from the Zoho `Deals` module (never created), or
2. Present in Zoho but not being returned by the job dropdown query (filter mismatch).

The dropdown for job selection is likely querying real deals only and Job `123` was a hardcoded placeholder used during development.

---

### Files to Update

| File | Action |
|------|--------|
| `app/api/jobs/route.ts` | Ensure "Office Staff" job is included in query results |
| `components/time-entry/TimeEntryForm.tsx` | Replace hardcoded `123` default with real "Office Staff" job ID |
| `lib/mock-data.ts` | Update any mock job data that references `123` |
| `app/api/time-entries/bulk-reassign/route.ts` | New endpoint to reassign pending entries |

---

### Steps to Fix

#### Step 1 — Create the "Office Staff" job in Zoho CRM

This is a **data task**, not a code task:

1. In Zoho CRM, navigate to the **Deals** module.
2. Create a new Deal named `"Office Staff"` (or equivalent internal admin label).
3. Note the auto-generated Zoho record ID (e.g., `7023000000123456`).
4. Set `Status = Active` so it appears in dropdown queries.

#### Step 2 — Verify the job dropdown query includes it

```typescript
// app/api/jobs/route.ts

export async function GET() {
  const jobs = await zohoClient.searchRecords("Deals", "(Stage:equals:Active)");
  // If "Office Staff" has a different Stage value (e.g., "Internal"),
  // broaden the query:
  // const jobs = await zohoClient.getRecords("Deals", { fields: "id,Deal_Name,Stage" });
  return NextResponse.json({ jobs });
}
```

If filtering by `Stage:equals:Active` is too narrow, either:
- Change the "Office Staff" deal's Stage to `Active`, or
- Add `OR` criteria: `(Stage:equals:Active)OR(Deal_Name:equals:Office Staff)`

#### Step 3 — Remove the hardcoded `123` fallback

```typescript
// lib/mock-data.ts  or  components/time-entry/TimeEntryForm.tsx

// REMOVE this:
const defaultJobId = "123"; // fake placeholder

// REPLACE with:
const defaultJobId = jobs[0]?.id ?? ""; // first real job, or empty
```

```typescript
// Also update mock data if present:
// lib/mock-data.ts
export const MOCK_JOBS = [
  { id: "ZOHO_OFFICE_STAFF_ID", name: "Office Staff" },
  // other mocks...
];
```

#### Step 4 — Reassign pending entries from Job `123`

**Option A — Manual reassignment UI (recommended):**

Add a filter in the time entry list view:

```tsx
// components/time-entry/TimeEntryList.tsx

const pendingInvalidJob = entries.filter((e) =>
  e.punches.some((p) => p.jobId === "123")
);

if (pendingInvalidJob.length > 0) {
  return (
    <Banner variant="warning">
      {pendingInvalidJob.length} entries are assigned to an invalid job.
      <button onClick={() => setBulkReassignOpen(true)}>Reassign All</button>
    </Banner>
  );
}
```

**Option B — Bulk reassign API endpoint:**

```typescript
// app/api/time-entries/bulk-reassign/route.ts

export async function POST(req: Request) {
  const { fromJobId, toJobId } = await req.json();
  // "123" → real "Office Staff" Zoho ID

  if (!fromJobId || !toJobId) {
    return NextResponse.json({ error: "fromJobId and toJobId required" }, { status: 400 });
  }

  // Fetch all punches with jobId === fromJobId
  const affected = await zohoClient.searchRecords(
    "Time_Entries",
    `(Job_Ticket:equals:${fromJobId})`
  );

  // Update each record
  const results = await Promise.all(
    affected.map((r) =>
      zohoClient.updateRecord("Time_Entries", r.id, { Job_Ticket: toJobId })
    )
  );

  return NextResponse.json({ updated: results.length });
}
```

#### Should you delete or reassign?

- **Reassign** if the hours are valid and belong to a real employee (just wrong job). Reassign to "Office Staff".
- **Delete** only if the entries are entirely fabricated test data with no real employee behind them.

---

### Potential Side Effects

- If any payroll report has already exported entries with Job `123`, those exports are inaccurate and need to be voided/reissued.
- If "Office Staff" job has budget tracking in Zoho, the reassigned hours will now count against it.

---

### Testing / Validation

1. Open the job selector dropdown in the time entry form → confirm "Office Staff" appears.
2. Submit a time entry with "Office Staff" → confirm it saves with a valid Zoho job ID (not `123`).
3. Run the bulk-reassign endpoint with `{ fromJobId: "123", toJobId: "<real-id>" }` → verify all affected records update.
4. Check that entries formerly showing "pending" now show the correct status.

---

---

## Issue 5: Expense Submission Error

### Problem

Submitting an expense produces an error. Without seeing the actual error message, the most likely root causes in a Next.js + Zoho CRM stack are:

| Likely Cause | Symptom |
|---|---|
| Missing required Zoho fields | `400 Bad Request` from Zoho API |
| Wrong `Content-Type` when uploading receipt file | `415 Unsupported Media Type` |
| Zoho module name or field name typo | `404 Not Found` or `INVALID_MODULE` |
| Access token expired mid-session | `401 Unauthorized` |
| `multipart/form-data` not parsed correctly in Next.js route handler | `undefined` fields in `req.formData()` |
| Receipt image too large for Zoho attachment limit (20MB) | `413 Payload Too Large` |

---

### Files to Update

| File | Action |
|------|--------|
| `app/api/expenses/route.ts` | Add structured error logging + field validation |
| `components/time-entry/ExpenseForm.tsx` | Validate required fields before submit; show specific error messages |
| `lib/zoho/ZohoCRMClient.ts` | Confirm `uploadAttachment` handles both image and PDF correctly |

---

### Steps to Fix

#### Step 1 — Add diagnostic logging to the API route

```typescript
// app/api/expenses/route.ts

export async function POST(req: Request) {
  let body: FormData;
  try {
    body = await req.formData();
  } catch (e) {
    console.error("[expenses] Failed to parse FormData:", e);
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const employeeId = body.get("employeeId") as string;
  const jobId = body.get("jobId") as string;
  const amount = body.get("amount") as string;
  const category = body.get("category") as string;
  const date = body.get("date") as string;
  const receipt = body.get("receipt") as File | null;

  // Log what was actually received
  console.log("[expenses] Received fields:", { employeeId, jobId, amount, category, date, receiptName: receipt?.name });

  // Validate required fields
  const missing = [];
  if (!employeeId) missing.push("employeeId");
  if (!jobId) missing.push("jobId");
  if (!amount || isNaN(parseFloat(amount))) missing.push("amount");
  if (!category) missing.push("category");
  if (!date) missing.push("date");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // Attempt Zoho write
  try {
    const record = await zohoClient.createRecord("Expenses", {
      Employee: employeeId,
      Job_Ticket: jobId,
      Amount: parseFloat(amount),
      Category: category,
      Expense_Date: date,
    });

    // Only upload receipt if provided
    if (receipt && record?.id) {
      const buffer = Buffer.from(await receipt.arrayBuffer());
      await zohoClient.uploadAttachment("Expenses", record.id, buffer, receipt.name);
    }

    return NextResponse.json({ success: true, expenseId: record?.id });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[expenses] Zoho write failed:", msg);
    return NextResponse.json(
      { error: "Failed to save expense. Check server logs." },
      { status: 500 }
    );
  }
}
```

#### Step 2 — Fix `ExpenseForm` to submit `FormData` correctly

```tsx
// components/time-entry/ExpenseForm.tsx
"use client";

export function ExpenseForm({ jobs, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [jobId, setJobId] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!amount || parseFloat(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    // Use FormData — do NOT JSON.stringify when sending a file
    const form = new FormData();
    form.append("employeeId", currentUser.id);
    form.append("jobId", jobId);
    form.append("amount", amount);
    form.append("category", category);
    form.append("date", date);
    if (receipt) form.append("receipt", receipt);

    const res = await fetch("/api/expenses", {
      method: "POST",
      body: form,
      // Do NOT set Content-Type manually — browser sets multipart boundary
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Submission failed.");
      return;
    }

    onSuccess(data.expenseId);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-destructive text-sm">{error}</p>}
      {/* ... fields ... */}
      <input type="file" accept="image/*,application/pdf"
        onChange={(e) => setReceipt(e.target.files?.[0] ?? null)} />
      <button type="submit">Submit Expense</button>
    </form>
  );
}
```

#### Step 3 — Confirm the Zoho module name

The Zoho module for expenses may be named differently (e.g., `"Expenses"`, `"Expense_Reports"`, `"Custom_Expenses"`). Verify in Zoho CRM:

```typescript
// Quick test in app/api/expenses/debug/route.ts (dev only, remove before prod)
export async function GET() {
  const modules = await zohoClient.makeRequest("GET", "/settings/modules");
  return NextResponse.json({ modules });
}
```

Then update the module name in the POST handler to match exactly.

---

### Potential Side Effects

- If the form was previously sending JSON (`Content-Type: application/json`) instead of `FormData`, the API route may have been reading `req.json()` instead of `req.formData()`. Switching to FormData is a breaking change if the API route isn't updated simultaneously.
- File size: Zoho's attachment limit is 20 MB. Add client-side size validation:

```tsx
if (receipt && receipt.size > 20 * 1024 * 1024) {
  setError("Receipt file must be under 20 MB.");
  return;
}
```

---

### Testing / Validation

1. Submit expense with all fields filled, no receipt → expect HTTP 200 and a Zoho record ID returned.
2. Submit expense with no `amount` → expect HTTP 400 with message `"Missing required fields: amount"`.
3. Submit expense with a receipt image (< 20 MB) → confirm attachment appears on the Zoho record.
4. Submit expense with `Content-Type: application/json` (wrong) → confirm the route returns a clear 400, not a crash.
5. Check Zoho CRM `Expenses` module → confirm record appears with correct job, amount, date, and employee.

---

---

## Dependency & Priority Summary

| Priority | Issue | Blocking? | Effort |
|----------|-------|-----------|--------|
| 1 | **Issue 2 — Fix calculations** | Yes — wrong data goes into payroll | 0.5 day |
| 2 | **Issue 1 — Block negatives** | Yes — data integrity | 0.5 day |
| 3 | **Issue 4 — Job 123 / Office Staff** | Yes — entries stuck in pending | 1 day |
| 4 | **Issue 5 — Expense error** | High — broken feature | 1 day |
| 5 | **Issue 3 — Multiple punches** | No — enhancement | 2–4 days |

**Issue 2 must be fixed before Issue 1** — the calculation fix defines what "valid hours" means; the negativity guard calls `calculateDuration()`.  
**Issue 4's data cleanup** (bulk reassign) should happen after Issue 3 is deployed only if the data model changes. Otherwise it can run independently now.
