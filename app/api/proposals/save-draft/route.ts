import { NextResponse } from "next/server";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jobId, proposal } = body;

    if (!jobId || !proposal) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(`📝 Starting save-draft for job: ${jobId}`);

    // 1. Create New_Quotes record
    const quotePayload = {
      Name: proposal.title || "Untitled Proposal",
      Quote_Status: "Draft", // Confirmed from plan
      Job_Ticket: jobId,     // Confirmed lookup field
    };

    const quoteResponse = await zohoClient.createRecord("New_Quotes", quotePayload);

    if (!quoteResponse || quoteResponse.status !== "success" || !quoteResponse.details?.id) {
      console.error("❌ Failed to create quote record:", quoteResponse);
      return NextResponse.json(
        { success: false, error: "Failed to create quote record", details: quoteResponse },
        { status: 500 }
      );
    }

    const quoteId = quoteResponse.details.id;
    console.log(`✅ Quote created successfully: ${quoteId}`);

    // 2. Prepare Product_X_Quotes records
    const lineItemsToSave = proposal.sections.flatMap((s: any) => s.lineItems)
      .filter((li: any) => li.zohoProductId);

    const relationshipPayloads = lineItemsToSave.map((li: any) => ({
      Quotes: quoteId,
      Products: li.zohoProductId,
      Pricing: li.price,
      Quantity: 1,
      Product_Description: li.description || "",
      Purchase_Option: li.optional ? "Optional" : "Mandatory",
    }));

    let createdCount = 0;
    if (relationshipPayloads.length > 0) {
      console.log(`📦 Creating ${relationshipPayloads.length} relationship records...`);
      // sequential create as suggested in plan to ensure error visibility
      for (const payload of relationshipPayloads) {
        try {
          const res = await zohoClient.createRecord("Product_X_Quotes", payload);
          if (res && res.status === "success") {
            createdCount++;
          } else {
            console.warn(`⚠️ Failed to create relationship for product ${payload.Products}:`, res);
          }
        } catch (e) {
          console.error(`❌ Error creating relationship for product ${payload.Products}:`, e);
        }
      }
    }

    const skippedManualCount = proposal.sections.flatMap((s: any) => s.lineItems).length - lineItemsToSave.length;

    console.log(`🎉 Save-draft complete. Created: ${createdCount}, Skipped: ${skippedManualCount}`);

    return NextResponse.json({
      success: true,
      quoteId,
      createdProductQuoteCount: createdCount,
      skippedManualItemCount: skippedManualCount,
      savedAt: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("❌ Fatal error in save-draft API route:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
