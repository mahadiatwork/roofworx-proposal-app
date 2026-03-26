"use client";

import { X } from "lucide-react";
import { ProposalPreviewClient } from "./ProposalPreviewClient";
import type { Proposal, JobMeta } from "./types";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposal: Proposal;
  jobMeta: JobMeta;
}

export function PreviewModal({ isOpen, onClose, proposal, jobMeta }: PreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close Preview">
          <X size={20} />
        </button>
        
        <div className="modal-scroll-area">
          <ProposalPreviewClient proposal={proposal} jobMeta={jobMeta} />
        </div>
      </div>
    </div>
  );
}
