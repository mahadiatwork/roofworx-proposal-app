export type ProposalItemPayload = {
  id?: unknown;
  zohoProductId?: unknown;
  price?: unknown;
  description?: unknown;
  optional?: unknown;
  purchaseOption?: unknown;
};

export type CatalogProductPayload = ProposalItemPayload & {
  zohoProductId: string;
  price: number;
  description: string;
  optional: boolean;
};

export function parseProposalItems(proposal: unknown): {
  lineItems: ProposalItemPayload[];
  productItems: CatalogProductPayload[];
} | null {
  if (!proposal || typeof proposal !== "object" || Array.isArray(proposal)) return null;

  const sections = (proposal as { sections?: unknown }).sections;
  if (!Array.isArray(sections)) return null;

  const lineItems: ProposalItemPayload[] = [];
  for (const section of sections) {
    if (!section || typeof section !== "object" || Array.isArray(section)) return null;
    const items = (section as { lineItems?: unknown }).lineItems;
    if (!Array.isArray(items)) return null;
    if (items.some((item) => !item || typeof item !== "object" || Array.isArray(item))) return null;
    lineItems.push(...(items as ProposalItemPayload[]));
  }

  if (lineItems.some((item) => item.zohoProductId !== undefined && typeof item.zohoProductId !== "string")) {
    return null;
  }

  const productItems = lineItems.filter(
    (item): item is CatalogProductPayload =>
      typeof item.zohoProductId === "string" &&
      item.zohoProductId.trim().length > 0 &&
      typeof item.price === "number" &&
      Number.isFinite(item.price) &&
      typeof item.description === "string" &&
      typeof item.optional === "boolean"
  );

  const productCount = lineItems.filter(
    (item) => typeof item.zohoProductId === "string" && item.zohoProductId.trim().length > 0
  ).length;

  return productItems.length === productCount ? { lineItems, productItems } : null;
}
