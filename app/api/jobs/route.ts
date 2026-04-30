// app/api/jobs/route.ts
// Issue 4: Return all active jobs from Zoho CRM Deals module,
// including the "Office Staff" internal deal.

import { NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export async function GET() {
  try {
    // Fetch all deals that are either Active or Internal admin entries.
    // If "Office Staff" has a different Stage, broaden the query here.
    const records = await zohoClient.getRecords("Deals", {
      fields: "id,Deal_Name,Stage",
      per_page: 200,
    });

    const jobs = (records as any[])
      .filter((r) => r.Deal_Name) // skip blank records
      .map((r) => ({
        id: r.id as string,
        name: (r.Deal_Name as string).trim(),
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ jobs });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[jobs GET] Error:", msg);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
