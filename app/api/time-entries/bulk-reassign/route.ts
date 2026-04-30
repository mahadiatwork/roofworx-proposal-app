// app/api/time-entries/bulk-reassign/route.ts
// Issue 4: Bulk reassign time-entry records from a placeholder job ID (e.g. "123")
// to a valid Zoho CRM job ID (e.g., the real "Office Staff" deal ID).

import { NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export async function POST(req: Request) {
  let body: { fromJobId?: string; toJobId?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { fromJobId, toJobId } = body;

  if (!fromJobId || !toJobId) {
    return NextResponse.json(
      { error: "Both fromJobId and toJobId are required" },
      { status: 400 }
    );
  }

  try {
    // Fetch all records still pointing at the invalid/placeholder job
    const affected = await zohoClient.searchRecords(
      "Time_Entries",
      `(Job_Ticket:equals:${fromJobId})`
    );

    if (affected.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: `No time entries found with Job_Ticket = "${fromJobId}"`,
      });
    }

    // Update each record in parallel
    const results = await Promise.allSettled(
      affected.map((r: any) =>
        zohoClient.updateRecord("Time_Entries", r.id as string, {
          Job_Ticket: toJobId,
        })
      )
    );

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      total: affected.length,
      updated: succeeded,
      failed,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[bulk-reassign] Error:", msg);
    return NextResponse.json({ error: "Bulk reassignment failed. Check server logs." }, { status: 500 });
  }
}
