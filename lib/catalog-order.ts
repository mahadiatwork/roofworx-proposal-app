import type { CatalogItem } from "@/lib/mock-data";

/**
 * Parses a leading numeric scope prefix from catalog/scope titles, e.g.:
 * "1 CT T-Off" → [1], "1.1 - CT T-Off - In" → [1, 1], "2.3.1 Demo" → [2, 3, 1].
 * Items without a numeric prefix sort last.
 */
function parseScopeOrderKey(name: string): number[] {
  const m = name.trim().match(/^([\d.]+)/);
  if (!m) return [Number.MAX_SAFE_INTEGER];
  return m[1].split(".").map((s) => {
    const n = Number.parseInt(s, 10);
    return Number.isFinite(n) ? n : 0;
  });
}

/** Ascending sort: 1, 1.1, 2, 2.1, … then alphabetical tie-breaker. */
export function compareCatalogItemsByScopeOrder(a: CatalogItem, b: CatalogItem): number {
  const ka = parseScopeOrderKey(a.name);
  const kb = parseScopeOrderKey(b.name);
  const len = Math.max(ka.length, kb.length);
  for (let i = 0; i < len; i++) {
    const va = ka[i] ?? 0;
    const vb = kb[i] ?? 0;
    if (va !== vb) return va - vb;
  }
  return a.name.localeCompare(b.name, undefined, { numeric: true });
}

export function sortCatalogByScopeOrder(items: CatalogItem[]): CatalogItem[] {
  return [...items].sort(compareCatalogItemsByScopeOrder);
}
