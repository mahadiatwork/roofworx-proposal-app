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
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
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
  Proposal_Number?: string;
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

type ZohoAccountRecord = {
  id?: string;
  Account_Name?: string;
  Billing_Street?: string;
  Billing_City?: string;
  Billing_State?: string;
  Billing_Code?: string;
  Billing_Country?: string;
  Shipping_Street?: string;
  Shipping_City?: string;
  Shipping_State?: string;
  Shipping_Code?: string;
  Shipping_Country?: string;
  Phone?: string;
};

type ZohoContactRecord = {
  id?: string;
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

import {
  getProductTemplateDescription,
  ROOFWORX_CONTRACTOR_INTRO,
  stripLegacyTemplateOptions,
} from "@/lib/terms-and-conditions";

function getCatalogDescription(name: string, fallback: string): string {
  return getProductTemplateDescription(name) ?? fallback;
}

function mapZohoProductToCatalogItem(product: ZohoProductRecord, index: number): CatalogItem | null {
  const name = product.Name?.trim();
  if (!name) return null;
  const fallbackDescription = product.Product_Description?.trim() || "No description provided";

  return {
    id: product.id ?? `our-product-${index}`,
    name,
    category: product.Product_Type?.trim() || product.Item_Type?.trim() || "Uncategorized",
    description: getCatalogDescription(name, fallbackDescription),
    defaultPrice: normalizePrice(product.Selling_Price),
    zohoProductId: product.id ?? "",
  };
}

// ── Mock Catalog ──────────────────────────────────────────────────────────────

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "cat-1-ct-t-off",
    name: "1 - CT T-Off",
    category: "Roofing",
    description: getProductTemplateDescription("1 - CT T-Off")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_1_CT_T_OFF",
  },
  {
    id: "cat-1-1-ct-t-off-insurance",
    name: "1.1 - CT T-Off - Insurance",
    category: "Roofing",
    description: getProductTemplateDescription("1.1 - CT T-Off - Insurance")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_1_1_CT_T_OFF_INSURANCE",
  },
  {
    id: "cat-1-2-ct-garage-t-off",
    name: "1.2 - CT Garage T-Off",
    category: "Roofing",
    description: getProductTemplateDescription("1.2 - CT Garage T-Off")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_1_2_CT_GARAGE_T_OFF",
  },
  {
    id: "cat-1-25-ct-garage-t-off-insurance",
    name: "1.25 - CT Garage T-Off - Insurance",
    category: "Roofing",
    description: getProductTemplateDescription("1.25 - CT Garage T-Off - Insurance")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_1_25_CT_GARAGE_T_OFF_INSURANCE",
  },
  {
    id: "cat-2-gaf-t-off",
    name: "2 - GAF T-Off",
    category: "Roofing",
    description: getProductTemplateDescription("2 - GAF T-Off")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_2_GAF_T_OFF",
  },
  {
    id: "cat-2-1-gaf-t-off-insurance",
    name: "2.1 - GAF T-Off - Insurance",
    category: "Roofing",
    description: getProductTemplateDescription("2.1 - GAF T-Off - Insurance")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_2_1_GAF_T_OFF_INSURANCE",
  },
  {
    id: "cat-2-2-gaf-garage-t-off",
    name: "2.2 - GAF Garage T-Off",
    category: "Roofing",
    description: getProductTemplateDescription("2.2 - GAF Garage T-Off")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_2_2_GAF_GARAGE_T_OFF",
  },
  {
    id: "cat-2-25-gaf-garage-t-off-insurance",
    name: "2.25 - GAF Garage T-Off - Insurance",
    category: "Roofing",
    description: getProductTemplateDescription("2.25 - GAF Garage T-Off - Insurance")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_2_25_GAF_GARAGE_T_OFF_INSURANCE",
  },
  {
    id: "cat-3-flat-roof-membrane",
    name: "3 - Flat Roof Membrane",
    category: "Roofing",
    description: getProductTemplateDescription("3 - Flat Roof Membrane")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_3_FLAT_ROOF_MEMBRANE",
  },
  {
    id: "cat-3-5-flat-roof-epdm",
    name: "3.5 - Flat Roof EPDM",
    category: "Roofing",
    description: getProductTemplateDescription("3.5 - Flat Roof EPDM")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_3_5_FLAT_ROOF_EPDM",
  },
  {
    id: "cat-4-skylights",
    name: "4 - Skylights",
    category: "Windows & Skylights",
    description: getProductTemplateDescription("4 - Skylights")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_4_SKYLIGHTS",
  },
  {
    id: "cat-10-siding",
    name: "10 - Siding",
    category: "Siding & Exterior",
    description: getProductTemplateDescription("10 - Siding")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_10_SIDING",
  },
  {
    id: "cat-11-ct-new-construction",
    name: "11 - CT New Construction",
    category: "Roofing",
    description: getProductTemplateDescription("11 - CT New Construction")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_11_CT_NEW_CONSTRUCTION",
  },
  {
    id: "cat-12-gaf-new-construction",
    name: "12 - GAF New Construction",
    category: "Roofing",
    description: getProductTemplateDescription("12 - GAF New Construction")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_12_GAF_NEW_CONSTRUCTION",
  },
  {
    id: "cat-13-60mil-tpo",
    name: "13 - 60Mil TPO",
    category: "Roofing",
    description: getProductTemplateDescription("13 - 60Mil TPO")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_13_60MIL_TPO",
  },
  {
    id: "cat-14-insurance-elevations",
    name: "14 - Insurance Elevations",
    category: "Services",
    description: getProductTemplateDescription("14 - Insurance Elevations")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_14_INSURANCE_ELEVATIONS",
  },
  {
    id: "cat-15-lp-smartside-siding",
    name: "15 - LP Smartside Siding",
    category: "Siding & Exterior",
    description: getProductTemplateDescription("15 - LP Smartside Siding")!,
    defaultPrice: 0,
    zohoProductId: "MOCK_PROD_15_LP_SMARTSIDE_SIDING",
  },
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
];

// ── Options Catalog ───────────────────────────────────────────────────────────
// Add-on upgrades and warranties offered alongside the selected scope-of-work
// template. These are NOT linked to Zoho products — they have empty
// `zohoProductId` so the save-draft flow treats them as manual line items.
// They are added to the proposal as optional line items and render under an
// "OPTION:" block in the client-facing preview/PDF.

export const OPTION_ITEMS: CatalogItem[] = [
  {
    id: "opt-gaf-silver-pledge",
    name: "GAF Silver Pledge Limited Warranty",
    category: "Options",
    description: "GAF Silver Pledge Limited Warranty",
    defaultPrice: 264,
    zohoProductId: "",
  },
  {
    id: "opt-gaf-golden-pledge",
    name: "GAF Golden Pledge Limited Warranty",
    category: "Options",
    description: "GAF Golden Pledge Limited Warranty",
    defaultPrice: 316,
    zohoProductId: "",
  },
  {
    id: "opt-certainteed-4star",
    name: "CertainTeed 4-Star Limited Warranty",
    category: "Options",
    description: "CertainTeed 4-Star Limited Warranty",
    defaultPrice: 145,
    zohoProductId: "",
  },
  {
    id: "opt-upgrade-landmark-pro",
    name: "Upgrade shingles to CertainTeed Landmark Pro",
    category: "Options",
    description: "Upgrade shingles to CertainTeed Landmark Pro",
    defaultPrice: 750,
    zohoProductId: "",
  },
  {
    id: "opt-upgrade-northgate",
    name: "Upgrade shingles to CertainTeed NorthGate Climate Flex",
    category: "Options",
    description: "Upgrade shingles to CertainTeed NorthGate Climate Flex",
    defaultPrice: 3545,
    zohoProductId: "",
  },
  {
    id: "opt-velux-skylight",
    name: "Install new VELUX skylight with preinstalled white, room-darkening, solar-powered, battery-operated shade in existing location",
    category: "Options",
    description:
      "Install new VELUX skylight with preinstalled white, room-darkening, solar-powered, battery-operated shade in existing location",
    defaultPrice: 1960,
    zohoProductId: "",
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
  propertyCity: "Elk Grove Village",
  propertyState: "IL",
  propertyZip: "60007",
  propertyClass: "Residential",
  salesperson: "Sarah Jenkins",
  recipientModule: "Deals",
  recipientId: "5865240000000000000"
};

// ── Mock Proposal ─────────────────────────────────────────────────────────────

export const MOCK_PROPOSAL: Proposal = {
  id: "prop-261075",
  title: "Complete Roof & Exterior Replacement",
  introText: ROOFWORX_CONTRACTOR_INTRO,
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

    const dealContact = deal.Contact_Name;
    const contact = dealContact?.id
      ? ((await zohoClient.getRecord("Contacts", dealContact.id)) as ZohoContactRecord | null)
      : null;

    // Pull the related Account so we get the full billing address (city/state/zip).
    const accountId = (deal.Account_Name as any)?.id;
    const account = accountId
      ? ((await zohoClient.getRecord("Accounts", accountId)) as ZohoAccountRecord | null)
      : null;

    const billingStreet = account?.Billing_Street?.trim() || "";
    const billingCity = account?.Billing_City?.trim() || "";
    const billingState = account?.Billing_State?.trim() || "";
    const billingZip = account?.Billing_Code?.trim() || "";

    // 2. Map Zoho Deal to JobMeta
    const liveJobMeta: JobMeta = {
      ...MOCK_JOB_META, // Use mock as base for fields not in Deal yet
      jobTicket: deal.Deal_Name || MOCK_JOB_META.jobTicket,
      // Use the dedicated all-numeric Proposal_Number field; fall back to Proposal_ID or jobId.
      proposalNumber: deal.Proposal_Number || deal.Proposal_ID || jobId,
      accountName: (deal.Account_Name as any)?.name || account?.Account_Name || MOCK_JOB_META.accountName,
      contactName: dealContact?.name || MOCK_JOB_META.contactName,
      contactEmail: contact?.Email || deal.Contact_Email || deal.Email || MOCK_JOB_META.contactEmail,
      propertyAddress: billingStreet || deal.Property_Address || MOCK_JOB_META.propertyAddress,
      propertyCity: billingCity || MOCK_JOB_META.propertyCity,
      propertyState: billingState || MOCK_JOB_META.propertyState,
      propertyZip: billingZip || MOCK_JOB_META.propertyZip,
      // Zoho Owner field is an object { name, id }
      salesperson: (deal.Owner as any)?.name || MOCK_JOB_META.salesperson,
      recipientModule: dealContact?.id ? "Contacts" : "Deals",
      recipientId: dealContact?.id || deal.id || jobId,
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
           description: stripLegacyTemplateOptions((ri.Product_Description as string) || ""),
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
