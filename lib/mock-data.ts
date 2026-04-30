// lib/mock-data.ts
// Structured to mirror the shape of data that will come from Zoho + DB later.
// Replace `getProposalData` with a real fetch when ready.
//
// Zoho CRM (manual setup — not enforced by code): In Setup → Modules & Fields, rename the
// "Our Products" module to "Scopes of Work" so CRM labels match the app. Update API module
// names in `ZohoCRMClient` / `getProposalData` if your Zoho API name changes after rename.

export type LineItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  optional: boolean;
  purchaseOption?: "Mandatory" | "Optional" | "Accepted";
  zohoProductId?: string;
};

export type ProposalSection = {
  id: string;
  title: string;
  lineItems: LineItem[];
};

export type Proposal = {
  id: string;
  title: string;
  introText: string;
  sections: ProposalSection[];
  status: "draft" | "sent" | "approved" | "declined";
  lastEditedAt: string;
  discount: number;
};

/** Map Zoho New_Quotes.Quote_Status picklist values to app status. */
export function normalizeProposalStatusFromZoho(raw: unknown): Proposal["status"] {
  const s = String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
  if (s === "sent" || s === "proposal sent") return "sent";
  if (s === "approved" || s === "accepted") return "approved";
  if (s === "declined" || s === "rejected") return "declined";
  return "draft";
}

export type JobMeta = {
  jobTicket: string;
  proposalNumber: string;
  accountName: string;
  contactName: string;
  contactEmail: string;
  propertyAddress: string;
  propertyClass: string;
  salesperson: string;
  recipientModule: string;
  recipientId: string;
};

export type ExistingProposalSummary = {
  id: string;
  name: string;
  status: string;
  modifiedTime?: string;
  createdTime?: string;
  isActive?: boolean;
};

export type CatalogItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  defaultPrice: number;
  zohoProductId: string;
};

type ZohoDealRecord = {
  id?: string;
  Deal_Name?: string;
  Proposal_ID?: string;
  Property_Address?: string;
  Modified_Time?: string;
  Owner?: {
    name?: string;
  };
  Account_Name?: { name: string; id: string };
  Contact_Name?: { name: string; id: string };
  Contact_Email?: string;
  Email?: string;
};

type ZohoProductRecord = {
  id?: string;
  Name?: string;
  Product_Type?: string;
  Product_Description?: string;
  Selling_Price?: number | string;
  Item_Type?: string;
};

function normalizePrice(value: number | string | undefined): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function mapZohoProductToCatalogItem(product: ZohoProductRecord, index: number): CatalogItem | null {
  const name = product.Name?.trim();
  if (!name) return null;

  return {
    id: product.id ?? `our-product-${index}`,
    name,
    category: product.Product_Type?.trim() || product.Item_Type?.trim() || "Uncategorized",
    description: product.Product_Description?.trim() || "No description provided",
    defaultPrice: normalizePrice(product.Selling_Price),
    zohoProductId: product.id ?? "",
  };
}

// ── Mock Catalog ──────────────────────────────────────────────────────────────

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "cat-1",
    name: "Shingles",
    category: "Roofing",
    description:
      "Remove damaged shingles and install new architectural shingles over prepared decking",
    defaultPrice: 12500,
    zohoProductId: "MOCK_PROD_1",
  },
  {
    id: "cat-2",
    name: "Flat Roof Membrane",
    category: "Roofing",
    description:
      "Install new TPO flat roof membrane including all necessary flashing and termination bars",
    defaultPrice: 8500,
    zohoProductId: "MOCK_PROD_2",
  },
  {
    id: "cat-3",
    name: "Garage Tear-Off",
    category: "Roofing",
    description:
      "Complete tear-off of existing garage roof down to the decking. Dispose of all debris.",
    defaultPrice: 2100,
    zohoProductId: "MOCK_PROD_3",
  },
  {
    id: "cat-4",
    name: "Siding",
    category: "Siding & Exterior",
    description:
      "Install new premium vinyl siding including tyvek wrap and all necessary trim pieces",
    defaultPrice: 15000,
    zohoProductId: "MOCK_PROD_4",
  },
  {
    id: "cat-5",
    name: "Soffit & Fascia Repair",
    category: "Siding & Exterior",
    description: "Repair and repaint soffit and fascia where needed",
    defaultPrice: 1200,
    zohoProductId: "MOCK_PROD_5",
  },
  {
    id: "cat-6",
    name: "6\" Gutter Replacement",
    category: "Gutters",
    description:
      "Replace existing 6-inch gutters and downspouts on affected elevations",
    defaultPrice: 2400,
    zohoProductId: "MOCK_PROD_6",
  },
  {
    id: "cat-7",
    name: "Skylights",
    category: "Windows & Skylights",
    description: "Install new Velux deck-mounted skylight with flashing kit",
    defaultPrice: 1800,
    zohoProductId: "MOCK_PROD_7",
  },
  {
    id: "cat-8",
    name: "Skylight Flashing",
    category: "Windows & Skylights",
    description: "Replace and reseal flashing around existing skylight to prevent leaks",
    defaultPrice: 450,
    zohoProductId: "MOCK_PROD_8",
  },
  {
    id: "cat-9",
    name: "Maintenance Contract",
    category: "Services",
    description:
      "Annual roof and gutter maintenance contract (Spring/Fall visits)",
    defaultPrice: 800,
    zohoProductId: "MOCK_PROD_9",
  },
  {
    id: "cat-10",
    name: "Insurance Elevations",
    category: "Services",
    description: "Provide detailed elevation drawings and measurements for insurance claim",
    defaultPrice: 350,
    zohoProductId: "MOCK_PROD_10",
  },
];

// ── Mock Job Meta ─────────────────────────────────────────────────────────────

export const MOCK_JOB_META: JobMeta = {
  jobTicket: "Grass Residence – 146 N. Broadview Ave",
  proposalNumber: "261075",
  accountName: "Grass Residence",
  contactName: "Eugene Data",
  contactEmail: "eugene.data@example.com",
  propertyAddress: "146 N. Broadview Ave",
  propertyClass: "Residential",
  salesperson: "Sarah Jenkins",
  recipientModule: "Deals",
  recipientId: "5865240000000000000"
};

// ── Mock Proposal ─────────────────────────────────────────────────────────────

export const MOCK_PROPOSAL: Proposal = {
  id: "prop-261075",
  title: "Complete Roof & Exterior Replacement",
  introText:
    "Thank you for considering RoofWorx Exteriors for your upcoming project. Based on our site visit, we have prepared the following detailed estimate for your review.",
  status: "draft",
  lastEditedAt: new Date().toISOString(),
  sections: [],
  discount: 0,
};

import { zohoClient } from "./zoho/ZohoCRMClient";
import { sortCatalogByScopeOrder } from "@/lib/catalog-order";

export async function getProposalData(jobId: string, quoteId?: string, isNew?: boolean): Promise<{
  jobMeta: JobMeta;
  proposal: Proposal;
  catalog: CatalogItem[];
  existingProposals: ExistingProposalSummary[];
} | null> {
  try {
    // 1. Fetch real Deal from Zoho CRM
    const deal = (await zohoClient.getRecord("Deals", jobId)) as ZohoDealRecord | null;
    const products = (await zohoClient.getRecords("Our_Products", {
      fields: "Name,Product_Type,Product_Description,Selling_Price,Item_Type",
      per_page: 200,
    })) as ZohoProductRecord[];

    if (!deal) {
      console.warn(`⚠️ Deal ${jobId} not found in Zoho CRM`);
      return null;
    }

    // 2. Map Zoho Deal to JobMeta
    const liveJobMeta: JobMeta = {
      ...MOCK_JOB_META, // Use mock as base for fields not in Deal yet
      jobTicket: deal.Deal_Name || MOCK_JOB_META.jobTicket,
      proposalNumber: deal.Proposal_ID || jobId,
      accountName: (deal.Account_Name as any)?.name || MOCK_JOB_META.accountName,
      contactName: (deal.Contact_Name as any)?.name || MOCK_JOB_META.contactName,
      contactEmail: (deal.Contact_Email as string) || (deal.Email as string) || MOCK_JOB_META.contactEmail,
      propertyAddress: deal.Property_Address || MOCK_JOB_META.propertyAddress,
      // Zoho Owner field is an object { name, id }
      salesperson: (deal.Owner as any)?.name || MOCK_JOB_META.salesperson,
      recipientModule: "Deals",
      recipientId: deal.id || jobId,
    };

    // 3. Fetch all existing quotes for this job
    const searchResult = await zohoClient.searchRecords("New_Quotes", `(Job_Ticket:equals:${jobId})`);
    
    const existingProposals: ExistingProposalSummary[] = searchResult.map((q: any) => ({
      id: q.id,
      name: q.Name || "Untitled Proposal",
      status: q.Quote_Status || "Unknown",
      modifiedTime: q.Modified_Time,
      createdTime: q.Created_Time,
      isActive: q.id === quoteId
    }));

    // 4. Default baseline proposal (empty)
    let activeProposal: Proposal = {
      ...MOCK_PROPOSAL,
      id: `new-${Date.now()}`,
      title: "New Project Proposal",
      lastEditedAt: new Date().toISOString(),
      sections: [],
      discount: 0,
    };

    // 5. If specific quoteId requested or we want to default to latest. 
    // IF we are in explicit "new" mode, we skip loading any existing details.
    const quoteToLoadId = isNew ? null : (quoteId || (existingProposals.length > 0 ? existingProposals[0].id : null));
    
    if (quoteToLoadId) {
       const fullQuote = searchResult.find((q: any) => q.id === quoteToLoadId) as any;
       if (fullQuote) {
         // Fetch related product items
         const relatedItems = await zohoClient.searchRecords("Product_X_Quotes", `(Quotes:equals:${quoteToLoadId})`);
         
         const lineItems: LineItem[] = relatedItems.map((ri: any) => ({
           id: ri.id,
           name: (ri.Products as any)?.name || "Product", // Zoho lookup often returns {name, id}
           description: (ri.Product_Description as string) || "",
           price: normalizePrice(ri.Pricing),
           optional: ri.Purchase_Option === "Optional" || ri.Purchase_Option === "Accepted",
           purchaseOption: (ri.Purchase_Option as any) || "Mandatory",
           zohoProductId: (ri.Products as any)?.id || ""
         }));

         activeProposal = {
           ...activeProposal,
           id: fullQuote.id,
           title: (fullQuote.Name as string) || activeProposal.title,
           lastEditedAt: (fullQuote.Modified_Time as string) || activeProposal.lastEditedAt,
           status: normalizeProposalStatusFromZoho(fullQuote.Quote_Status),
           sections: lineItems.length > 0 ? [{
             id: `section-${quoteToLoadId}`,
             title: "Proposal Items",
             lineItems
           }] : []
         };
       }
    }

    const liveCatalog = sortCatalogByScopeOrder(
      products
        .map(mapZohoProductToCatalogItem)
        .filter((item): item is CatalogItem => item !== null)
    );

    return {
      jobMeta: liveJobMeta,
      proposal: activeProposal,
      catalog: liveCatalog.length > 0 ? liveCatalog : sortCatalogByScopeOrder(CATALOG_ITEMS),
      existingProposals
    };
  } catch (error) {
    console.error("❌ Error in getProposalData:", error);
    return null;
  }
}
