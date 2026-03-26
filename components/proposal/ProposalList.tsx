"use client";

import { Plus, History, Clock, FileEdit, CheckCircle2 } from "lucide-react";
import type { ExistingProposalSummary } from "./types";

interface ProposalListProps {
  proposals: ExistingProposalSummary[];
  onSelectProposal: (id: string) => void;
  onAddNew: () => void;
  activeId?: string;
}

export function ProposalList({
  proposals,
  onSelectProposal,
  onAddNew,
  activeId,
}: ProposalListProps) {
  return (
    <aside className="proposal-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <History size={16} className="text-muted-foreground" />
          <h3 className="sidebar-title">Proposals</h3>
        </div>
        <button className="btn-add-new-proposal" onClick={onAddNew}>
          <Plus size={16} />
          New Draft
        </button>
      </div>

      <div className="proposal-items-list">
        {proposals.length === 0 ? (
          <div className="empty-proposals">
            <p>No saved proposals found for this job.</p>
          </div>
        ) : (
          proposals.map((item) => (
            <div
              key={item.id}
              className={`proposal-list-item ${
                item.id === activeId || item.isActive ? "active" : ""
              }`}
              onClick={() => onSelectProposal(item.id)}
            >
              <div className="proposal-item-status">
                {item.status.toLowerCase() === "draft" ? (
                  <Clock size={14} className="status-icon draft" />
                ) : (
                  <CheckCircle2 size={14} className="status-icon approved" />
                )}
              </div>
              <div className="proposal-item-details">
                <div className="proposal-item-name">{item.name}</div>
                <div className="proposal-item-meta">
                  {item.status} • {item.modifiedTime ? new Date(item.modifiedTime).toLocaleDateString() : 'Just now'}
                </div>
              </div>
              <div className="active-indicator">
                 <FileEdit size={12} />
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
