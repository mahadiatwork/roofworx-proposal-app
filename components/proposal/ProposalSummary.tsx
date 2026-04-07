"use client";

import { Clock, Send } from "lucide-react";
import type { Proposal } from "@/components/proposal/types";

interface ProposalSummaryProps {
  sections: Proposal["sections"];
  discount: number;
  onDiscountChange: (val: number) => void;
  lastEditedAt: string;
  onSend: () => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  isSaving?: boolean;
}

export function ProposalSummary({
  sections,
  discount,
  onDiscountChange,
  lastEditedAt,
  onSend,
  onPreview,
  onSaveDraft,
  isSaving,
}: ProposalSummaryProps) {
  const allItems = sections.flatMap((s) => s.lineItems);

  const requiredTotal = allItems
    .filter((li) => !li.optional)
    .reduce((sum, li) => sum + li.price, 0);

  const optionalItems = allItems.filter((li) => li.optional);
  const optionalTotal = optionalItems.reduce((sum, li) => sum + li.price, 0);
  const grandTotal = Math.max(0, requiredTotal + optionalTotal - discount);

  return (
    <aside className="summary-panel">
      {/* ── Totals Card ────────────────────────────────────────── */}
      <div className="summary-card">
        <h3 className="summary-heading">PROPOSAL SUMMARY</h3>

        <div className="summary-row">
          <span className="summary-label">Required Items</span>
          <span className="summary-value">
            ${requiredTotal.toLocaleString()}
          </span>
        </div>

        <div className="summary-row">
          <span className="summary-label">
            Optional Add-ons
            {optionalItems.length > 0 && (
              <span className="summary-opt-count">{optionalItems.length}</span>
            )}
          </span>
          <span className="summary-value">
            ${optionalTotal.toLocaleString()}
          </span>
        </div>

        <div className="summary-row discount-row" style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px dashed #EEE' }}>
          <span className="summary-label">Applied Discount</span>
          <div className="summary-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#9CA3AF' }}>-$</span>
            <input
              type="number"
              className="price-input"
              style={{ width: '80px', background: '#F9FAFB', border: '1px solid #EEE', borderRadius: '6px', padding: '4px 8px', textAlign: 'right', fontSize: '13px' }}
              value={discount}
              onChange={(e) => onDiscountChange(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="summary-total-section">
          <div className="summary-total-row">
            <span className="summary-total-label">Est. Total</span>
            <span className="summary-total-value">
              ${grandTotal.toLocaleString()}
            </span>
          </div>
          <p className="summary-total-footnote">if all options selected</p>
        </div>
      </div>

      {/* ── Action Card ────────────────────────────────────────── */}
      <div className="summary-action-card">
        <div className="last-edited-wrap">
            <div className="edited-clock"><Clock size={16} /></div>
            <div className="edited-info">
                <span className="edited-label">Last edited</span>
                <span className="edited-time">Just now</span>
            </div>
        </div>
        
        <button className="btn-send-main" onClick={onSend}>
           <Send size={18} />
           Proposal App
        </button>

        <div className="summary-footer-btns">
            <button className="btn-summary-outline" onClick={onPreview}>Preview as Client</button>
            <button className="btn-summary-outline" type="button" onClick={onSaveDraft} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
        </div>

        <p className="summary-send-note">
          Client will receive a secure email link to review and approve the proposal.
        </p>
      </div>

      {/* ── Internal Stats ────────────────────────────────────── */}
      <div className="internal-stats-card">
        <h3 className="summary-heading">INTERNAL STATS</h3>
        <div className="stat-row">
          <span className="stat-label">Total Sections</span>
          <span className="stat-value">{sections.length}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Proposal Margin</span>
          <span className="stat-value margin-high">~32%</span>
        </div>
      </div>
    </aside>
  );
}
