import { NextRequest, NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const quoteId = formData.get("quoteId") as string;
    const jobId = formData.get("jobId") as string;
    const signatureBase64 = formData.get("signature") as string;

    if (!quoteId || !jobId) {
      return NextResponse.json(
        { success: false, error: "Missing quoteId or jobId" },
        { status: 400 }
      );
    }

    if (formData.get("agreementAccepted") !== "true") {
      return NextResponse.json(
        { success: false, error: "Terms and deposit acknowledgment are required." },
        { status: 400 }
      );
    }

    console.log(`✅ Approving quote ${quoteId} for job ${jobId}`);

    // Update the record status in Zoho CRM
    try {
      await zohoClient.updateRecord("New_Quotes", quoteId, {
        Quote_Status: "Accepted",
        Approval_Date: new Date().toISOString().split('T')[0],
      });

      // 1. Upload Signature JPG to Zoho
      if (signatureBase64) {
        const sigBuffer = Buffer.from(signatureBase64.split(",")[1], 'base64');
        await zohoClient.uploadAttachment("New_Quotes", quoteId, sigBuffer, `Signature-${Date.now()}.jpg`);
        console.log("💾 Signature attached to record");
      }

      // 2. Update Optional items to "Accepted"
      const selectedOptionalsStr = formData.get("selectedOptionals") as string;
      if (selectedOptionalsStr) {
        const selectedIds = JSON.parse(selectedOptionalsStr) as string[];
        console.log(`📦 Updating ${selectedIds.length} optional items to 'Accepted'...`);
        for (const itemId of selectedIds) {
           if (itemId && !itemId.startsWith('new-')) {
             await zohoClient.updateRecord("Product_X_Quotes", itemId, {
               Purchase_Option: "Accepted"
             });
           }
        }
      }

      return NextResponse.json({
        success: true,
        message: "Proposal approved.",
        quoteId,
      });

    } catch (zohoError: any) {
      console.error("❌ Zoho Update Error:", zohoError?.response?.data || zohoError.message);
      return NextResponse.json(
        { success: false, error: "Could not sync approval to CRM. Please contact your representative." },
        { status: 502 }
      );
    }

  } catch (error: any) {
    console.error("❌ Approval API Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
