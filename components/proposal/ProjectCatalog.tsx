"use client";

import { useState, useMemo } from "react";
import { Search, Plus, Archive } from "lucide-react";
import type { CatalogItem } from "@/components/proposal/types";
import { sortCatalogByScopeOrder } from "@/lib/catalog-order";

type CatalogTab = "templates" | "options";

interface ProjectCatalogProps {
  catalog: CatalogItem[];
  options: CatalogItem[];
  onAddItem: (item: CatalogItem) => void;
  onAddOption: (item: CatalogItem) => void;
}

export function ProjectCatalog({
  catalog,
  options,
  onAddItem,
  onAddOption,
}: ProjectCatalogProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<CatalogTab>("templates");

  const sortedCatalog = useMemo(() => sortCatalogByScopeOrder(catalog), [catalog]);

  const q = query.toLowerCase().trim();

  const filteredTemplates = useMemo(() => {
    if (!q) return sortedCatalog;
    return sortedCatalog.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [sortedCatalog, q]);

  const filteredOptions = useMemo(() => {
    if (!q) return options;
    return options.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [options, q]);

  return (
    <aside className="catalog-panel">
      {/* Header */}
      <div className="catalog-header">
        <Archive size={16} className="catalog-icon" />
        <span className="catalog-title">Catalog</span>
      </div>

      {/* Templates / Options tabs (replaces scope-of-work category filter) */}
      <div className="catalog-categories">
        <button
          type="button"
          onClick={() => setTab("templates")}
          className={`cat-pill ${tab === "templates" ? "active" : ""}`}
        >
          Templates
        </button>
        <button
          type="button"
          onClick={() => setTab("options")}
          className={`cat-pill ${tab === "options" ? "active" : ""}`}
        >
          Options
        </button>
      </div>

      {/* Search */}
      <div className="catalog-search-wrap">
        <Search className="catalog-search-icon" size={15} />
        <input
          type="text"
          placeholder={tab === "templates" ? "Search templates..." : "Search options..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="catalog-search-input"
        />
      </div>

      {tab === "templates" ? (
        <div className="catalog-list">
          {filteredTemplates.map((item) => (
            <CatalogCard key={item.id} item={item} onAdd={() => onAddItem(item)} />
          ))}
        </div>
      ) : (
        <div className="catalog-list">
          {filteredOptions.map((item) => (
            <CatalogCard key={item.id} item={item} onAdd={() => onAddOption(item)} />
          ))}
        </div>
      )}
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