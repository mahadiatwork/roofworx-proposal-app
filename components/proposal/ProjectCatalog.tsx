"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Archive } from "lucide-react";
import type { CatalogItem } from "@/components/proposal/types";

const CATEGORIES = [
  "All",
  "Roofing",
  "Siding & Exterior",
  "Gutters",
  "Windows & Skylights",
] as const;

type CategoryFilter = (typeof CATEGORIES)[number];

interface ProjectCatalogProps {
  catalog: CatalogItem[];
  onAddItem: (item: CatalogItem) => void;
}

export function ProjectCatalog({ catalog, onAddItem }: ProjectCatalogProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return catalog.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [catalog, query, activeCategory]);

  return (
    <aside className="catalog-panel">
      {/* Header */}
      <div className="catalog-header">
        <Archive size={16} className="catalog-icon" />
        <span className="catalog-title">Project Catalog</span>
      </div>

      {/* Search */}
      <div className="catalog-search-wrap">
        <Search className="catalog-search-icon" size={15} />
        <input
          type="text"
          placeholder="Search projects or items..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="catalog-search-input"
        />
      </div>

      {/* Category Filters */}
      <div className="catalog-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`cat-pill ${activeCategory === cat ? "active" : ""}`}
          >
            {cat === "Siding & Exterior" ? "Siding & Exterior" : cat}
          </button>
        ))}
      </div>

      {/* Item List */}
      <div className="catalog-list">
        {filtered.map((item) => (
          <CatalogCard key={item.id} item={item} onAdd={() => onAddItem(item)} />
        ))}
      </div>
    </aside>
  );
}

function CatalogCard({
  item,
  onAdd,
}: {
  item: CatalogItem;
  onAdd: () => void;
}) {
  return (
    <div className="catalog-card">
      <span className="catalog-card-category">{item.category}</span>
      <h4 className="catalog-card-name">{item.name}</h4>
      <div className="catalog-card-price">${item.defaultPrice.toLocaleString()}</div>

      <button
        onClick={onAdd}
        className="catalog-card-add-btn"
        aria-label={`Add ${item.name}`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
