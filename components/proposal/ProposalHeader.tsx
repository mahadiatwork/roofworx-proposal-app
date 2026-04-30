"use client";

/**
 * Header actions for the in-app proposal editor.
 *
 * Zoho CRM (Deal / Job page — configure in Zoho, not in this repo): The primary entry to this
 * web app may be labeled e.g. "Proposal App" in CRM; in-app, the main action is "Send Proposal".
 * Remove
 * the "Create Estimate" and "Create Change Order" buttons from that page if they are present,
 * along with any associated workflow actions.
 */

import { FileText, Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import type { JobMeta, Proposal } from "@/components/proposal/types";

function proposalStatusLabel(status: Proposal["status"]): string {
  switch (status) {
    case "sent":
      return "Proposal Sent";
    case "approved":
      return "Approved";
    case "declined":
      return "Declined";
    default:
      return "Draft";
  }
}

interface HeaderProps {
  jobMeta: JobMeta;
  proposalStatus: Proposal["status"];
  onSaveDraft: () => void;
  onPreview: () => void;
  onSend: () => void;
  onBack: () => void;
  isSaving?: boolean;
  isEditMode?: boolean;
  hasSelection: boolean;
}

export function ProposalHeader({
  jobMeta,
  proposalStatus,
  onSaveDraft,
  onPreview,
  onSend,
  onBack,
  isSaving,
  isEditMode,
  hasSelection,
}: HeaderProps) {
  return (
    <header className="proposal-header">
      {/* ── Left: brand + context ──────────────────────────────── */}
      <div className="header-brand">
        {!hasSelection ? (
          <>
            <div className="brand-logo-wrap" style={{ background: '#FFFFFF', padding: '6px' }}>
              <Image src="/Roofworx-logo.png" alt="RoofWorx" width={50} height={50} priority />
            </div>
            <div className="header-divider" />
            <span className="header-context-label">Job Proposals</span>
          </>
        ) : (
          <div className="header-edit-context">
            <button className="btn-header-back" onClick={onBack}>
              <ChevronLeft size={18} />
              Back to Proposals
            </button>
            <div className="header-job-summary">
                 <div className="job-title-row">
                 <span className="job-name">{jobMeta.accountName}</span>
                 <div
                   className={`header-status-pill ${
                     proposalStatus === "sent"
                       ? "header-status-pill--sent"
                       : "header-status-pill--draft"
                   }`}
                 >
                    <span
                      className={`status-dot ${
                        proposalStatus === "sent" ? "is-sent" : "active"
                      }`}
                    />
                    {proposalStatusLabel(proposalStatus)}
                 </div>
               </div>
               <div className="job-address-sub">{jobMeta.propertyAddress}</div>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: actions ────────────────────────────────────── */}
      <div className="header-actions">
        {hasSelection && (
          <>
            <button
              className="btn-header-ghost"
              onClick={onSaveDraft}
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSaving && <Loader2 className="animate-spin" size={15} />}
              {isSaving ? "Saving..." : "Save Draft"}
            </button>
            <button
              className="btn-header-outline"
              onClick={onPreview}
            >
              <FileText size={15} />
              Preview as Client
            </button>
            <button
              className="btn-header-primary"
              onClick={onSend}
            >
              Send Proposal
            </button>
          </>
        )}
      </div>
    </header>
  );
}

interface MetaBarProps {
  jobMeta: JobMeta;
}

export function MetaBar({ jobMeta }: MetaBarProps) {
  return (
    <div className="meta-bar">
      <MetaItem label="Job Ticket" value={jobMeta.jobTicket} />
      <MetaItem label="Proposal #" value={jobMeta.proposalNumber} />
      <MetaItem
        label="Account / Contact"
        value={`${jobMeta.contactName} / ${jobMeta.accountName}`}
      />
      <MetaItem label="Property Address" value={jobMeta.propertyAddress} />
      <MetaItem label="Property Class" value={jobMeta.propertyClass} />
      <MetaItem label="Salesperson" value={jobMeta.salesperson} />
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="meta-item">
      <span className="meta-label">{label.toUpperCase()}</span>
      <span className="meta-value">{value}</span>
    </div>
  );
}
