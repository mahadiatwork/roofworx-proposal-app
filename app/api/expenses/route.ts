// app/api/expenses/route.ts
// Issue 5: POST — create an expense record in Zoho CRM, optionally uploading a receipt.

import { NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

const MAX_RECEIPT_BYTES = 20 * 1024 * 1024; // 20 MB — Zoho attachment limit

export async function POST(req: Request) {
  // ── Parse multipart form data ────────────────────────────────────────────
  let body: FormData;
  try {
    body = await req.formData();
  } catch (e) {
    console.error("[expenses POST] Failed to parse FormData:", e);
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const employeeId = body.get("employeeId") as string | null;
  const jobId = body.get("jobId") as string | null;
  const amount = body.get("amount") as string | null;
  const category = body.get("category") as string | null;
  const date = body.get("date") as string | null;
  const receipt = body.get("receipt") as File | null;

  // Log received fields for diagnostics
  console.log("[expenses POST] Received fields:", {
    employeeId,
    jobId,
    amount,
    category,
    date,
    receiptName: receipt?.name ?? null,
    receiptSize: receipt?.size ?? null,
  });

  // ── Required field validation ─────────────────────────────────────────────
  const missing: string[] = [];
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

  const parsedAmount = parseFloat(amount!);
  if (parsedAmount <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than zero" },
      { status: 422 }
    );
  }

  // ── Receipt size guard (client can't always enforce this) ─────────────────
  if (receipt && receipt.size > MAX_RECEIPT_BYTES) {
    return NextResponse.json(
      { error: "Receipt file must be under 20 MB" },
      { status: 413 }
    );
  }

  // ── Zoho CRM write ────────────────────────────────────────────────────────
  try {
    const record = await zohoClient.createRecord("Expenses", {
      Employee: employeeId,
      Job_Ticket: jobId,
      Amount: parsedAmount,
      Category: category,
      Expense_Date: date,
    });

    const recordId: string | undefined = (record as any)?.details?.id;

    // Only upload receipt if provided and record was created successfully
    if (receipt && recordId) {
      const buffer = Buffer.from(await receipt.arrayBuffer());
      await zohoClient.uploadAttachment("Expenses", recordId, buffer, receipt.name);
    }

    return NextResponse.json({ success: true, expenseId: recordId });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[expenses POST] Zoho write failed:", msg);
    return NextResponse.json(
      { error: "Failed to save expense. Check server logs." },
      { status: 500 }
    );
  }
}
