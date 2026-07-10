import { NextResponse } from "next/server";
import { parseProposalItems } from "@/lib/proposal-products";
import { zohoClient } from "@/lib/zoho/ZohoCRMClient";

type RelationshipRecord = Record<string, unknown> & { id: string };

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json().catch(() => null);
    const requestBody =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as { jobId?: unknown; proposal?: unknown })
        : null;
    const proposal =
      requestBody?.proposal &&
      typeof requestBody.proposal === "object" &&
      !Array.isArray(requestBody.proposal)
        ? (requestBody.proposal as { id?: unknown; title?: unknown })
        : null;
    const parsedItems = parseProposalItems(requestBody?.proposal);

    if (
      typeof requestBody?.jobId !== "string" ||
      requestBody.jobId.trim().length === 0 ||
      typeof proposal?.title !== "string" ||
      !parsedItems
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid proposal payload" },
        { status: 400 }
      );
    }

    if (parsedItems.productItems.length > 1) {
      return NextResponse.json(
        { success: false, error: "An estimate can contain only one product" },
        { status: 400 }
      );
    }

    const jobId = requestBody.jobId.trim();
    const existingQuoteId =
      typeof proposal.id === "string" &&
      proposal.id.trim().length > 0 &&
      !proposal.id.startsWith("new-")
        ? proposal.id
        : null;
    const quotePayload = {
      Name: proposal.title.trim() || "Untitled Proposal",
      Quote_Status: "Draft",
      Job_Ticket: jobId,
    };

    let existingRelationships: RelationshipRecord[] = [];
    if (existingQuoteId) {
      const existingQuote = await zohoClient.getRecord("New_Quotes", existingQuoteId);
      const linkedJob = existingQuote?.Job_Ticket;
      const linkedJobId =
        typeof linkedJob === "string"
          ? linkedJob
          : linkedJob && typeof linkedJob === "object" && !Array.isArray(linkedJob)
            ? (linkedJob as { id?: unknown }).id
            : null;
      if (linkedJobId !== jobId) {
        return NextResponse.json(
          { success: false, error: "Estimate not found for this job" },
          { status: 404 }
        );
      }

      const records = await zohoClient.searchRecords(
        "Product_X_Quotes",
        `(Quotes:equals:${existingQuoteId})`,
        true
      );
      if (records.some((record) => typeof record.id !== "string" || record.id.length === 0)) {
        throw new Error("Zoho returned a product relationship without an id");
      }
      existingRelationships = records as RelationshipRecord[];
    }

    let quoteId = existingQuoteId;
    if (quoteId) {
      const response = await zohoClient.updateRecord("New_Quotes", quoteId, quotePayload);
      if (!response || response.status !== "success") {
        throw new Error("Failed to update quote record");
      }
    } else {
      const response = await zohoClient.createRecord("New_Quotes", quotePayload);
      if (!response || response.status !== "success" || !response.details?.id) {
        throw new Error("Failed to create quote record");
      }
      quoteId = response.details.id;
    }

    const product = parsedItems.productItems[0];
    const relationshipPayload = product
      ? {
          Quotes: quoteId,
          Products: product.zohoProductId.trim(),
          Pricing: product.price,
          Quantity: 1,
          Product_Description: product.description,
          Purchase_Option:
            product.purchaseOption === "Accepted"
              ? "Accepted"
              : product.optional
                ? "Optional"
                : "Mandatory",
        }
      : null;

    let createdCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;

    if (!existingQuoteId) {
      if (relationshipPayload) {
        const response = await zohoClient.createRecord("Product_X_Quotes", relationshipPayload);
        if (!response || response.status !== "success") {
          throw new Error("Failed to create product relationship");
        }
        createdCount = 1;
      }
    } else {
      const preferredRelationshipId = typeof product?.id === "string" ? product.id : null;
      const keeper = relationshipPayload
        ? existingRelationships.find((record) => record.id === preferredRelationshipId) ??
          existingRelationships[0]
        : undefined;

      if (relationshipPayload && keeper) {
        const response = await zohoClient.updateRecord(
          "Product_X_Quotes",
          keeper.id,
          relationshipPayload
        );
        if (!response || response.status !== "success") {
          throw new Error("Failed to update product relationship");
        }
        updatedCount = 1;
      } else if (relationshipPayload) {
        const response = await zohoClient.createRecord("Product_X_Quotes", relationshipPayload);
        if (!response || response.status !== "success") {
          throw new Error("Failed to create product relationship");
        }
        createdCount = 1;
      }

      const staleRelationships = keeper
        ? existingRelationships.filter((record) => record.id !== keeper.id)
        : existingRelationships;
      for (const stale of staleRelationships) {
        const response = await zohoClient.deleteRecord("Product_X_Quotes", stale.id);
        if (!response || response.status !== "success") {
          throw new Error("Failed to remove old product relationship");
        }
        deletedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      quoteId,
      createdProductQuoteCount: createdCount,
      updatedProductQuoteCount: updatedCount,
      deletedProductQuoteCount: deletedCount,
      skippedManualItemCount: parsedItems.lineItems.length - parsedItems.productItems.length,
      savedAt: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("Error saving proposal draft:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
