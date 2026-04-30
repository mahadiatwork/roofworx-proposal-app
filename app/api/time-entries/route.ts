// app/api/time-entries/route.ts
// POST — create a new time entry (one or more punches for a single employee/day).
// GET  — list time entries (filter by employeeId and/or date via query params).

import { NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";
import { calculateDuration, sumPunches, hasPunchOverlap } from "@/lib/time-utils";
import type { Punch } from "@/lib/types/time-entry";

// ── GET /api/time-entries ─────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");
  const date = searchParams.get("date");

  try {
    const criteria: string[] = [];
    if (employeeId) criteria.push(`(Employee:equals:${employeeId})`);
    if (date) criteria.push(`(Entry_Date:equals:${date})`);

    const records =
      criteria.length > 0
        ? await zohoClient.searchRecords(
            "Time_Entries",
            criteria.join("AND")
          )
        : await zohoClient.getRecords("Time_Entries");

    return NextResponse.json({ entries: records });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[time-entries GET] Error:", msg);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}

// ── POST /api/time-entries ────────────────────────────────────────────────────
export async function POST(req: Request) {
  let body: {
    employeeId?: string;
    date?: string;
    punches?: Punch[];
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { employeeId, date, punches } = body;

  // ── Required field validation ──────────────────────────────────────────────
  const missing: string[] = [];
  if (!employeeId) missing.push("employeeId");
  if (!date) missing.push("date");
  if (!Array.isArray(punches) || punches.length === 0) missing.push("punches");

  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // ── Issue 1 & 2: Validate each punch — no negatives, correct calculation ──
  for (const p of punches!) {
    if (!p.clockIn) {
      return NextResponse.json(
        { error: `Punch ${p.id} is missing clockIn` },
        { status: 422 }
      );
    }

    if (p.clockOut) {
      const hours = calculateDuration(p.clockIn, p.clockOut);
      if (hours === null || hours <= 0) {
        return NextResponse.json(
          {
            error: `Invalid time range for punch ${p.id}: clock-out must be strictly after clock-in`,
          },
          { status: 422 }
        );
      }
    }
  }

  // ── Issue 3: Check for overlapping punches ─────────────────────────────────
  if (hasPunchOverlap(punches!)) {
    return NextResponse.json({ error: "Punch times overlap — please review your entries" }, { status: 422 });
  }

  const totalHours = sumPunches(punches!);
  if (totalHours <= 0) {
    return NextResponse.json(
      { error: "Total hours must be greater than zero" },
      { status: 422 }
    );
  }

  // ── Persist each punch as a separate Zoho record (one-record-per-punch) ───
  try {
    const results = await Promise.all(
      punches!
        .filter((p) => p.clockOut) // only persist closed punches
        .map((p) => {
          const hours = calculateDuration(p.clockIn, p.clockOut)!;
          return zohoClient.createRecord("Time_Entries", {
            Employee: employeeId,
            Entry_Date: date,
            Job_Ticket: p.jobId,
            Clock_In: p.clockIn,
            Clock_Out: p.clockOut,
            Hours: hours,
            Notes: p.notes ?? "",
            Status: "Submitted",
          });
        })
    );

    return NextResponse.json({ success: true, records: results, totalHours });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[time-entries POST] Zoho write failed:", msg);
    return NextResponse.json({ error: "Failed to save time entry. Check server logs." }, { status: 500 });
  }
}
