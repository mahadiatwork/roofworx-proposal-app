// app/api/time-entries/[entryId]/route.ts
// PATCH — update (add/edit/remove a punch) on an existing time-entry record.
// DELETE — delete a single Zoho time-entry record.

import { NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";
import { calculateDuration } from "@/lib/time-utils";

interface Params {
  params: Promise<{ entryId: string }>;
}

// ── PATCH /api/time-entries/[entryId] ─────────────────────────────────────────
export async function PATCH(req: Request, { params }: Params) {
  const { entryId } = await params;

  let body: {
    clockIn?: string;
    clockOut?: string;
    jobId?: string;
    notes?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { clockIn, clockOut, jobId, notes } = body;

  // Validate time range if both provided
  if (clockIn && clockOut) {
    const hours = calculateDuration(clockIn, clockOut);
    if (hours === null || hours <= 0) {
      return NextResponse.json(
        { error: "Invalid time range: clock-out must be strictly after clock-in" },
        { status: 422 }
      );
    }

    try {
      const updated = await zohoClient.updateRecord("Time_Entries", entryId, {
        Clock_In: clockIn,
        Clock_Out: clockOut,
        Hours: hours,
        ...(jobId ? { Job_Ticket: jobId } : {}),
        ...(notes !== undefined ? { Notes: notes } : {}),
      });
      return NextResponse.json({ success: true, record: updated });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`[time-entries PATCH ${entryId}] Zoho update failed:`, msg);
      return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
    }
  }

  // Partial update (e.g., just notes or jobId)
  const payload: Record<string, string> = {};
  if (jobId) payload.Job_Ticket = jobId;
  if (notes !== undefined) payload.Notes = notes;

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
  }

  try {
    const updated = await zohoClient.updateRecord("Time_Entries", entryId, payload);
    return NextResponse.json({ success: true, record: updated });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[time-entries PATCH ${entryId}] Zoho update failed:`, msg);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

// ── DELETE /api/time-entries/[entryId] ────────────────────────────────────────
export async function DELETE(_req: Request, { params }: Params) {
  const { entryId } = await params;

  try {
    // Zoho delete uses the bulk delete endpoint with a single ID
    await zohoClient.makeRequest("delete", `/Time_Entries?ids=${entryId}`);
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[time-entries DELETE ${entryId}] Error:`, msg);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
