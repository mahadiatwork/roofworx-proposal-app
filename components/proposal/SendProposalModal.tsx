"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { X, Send, Mail, Link as LinkIcon, Loader2 } from "lucide-react";

interface SendProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSend: (draft: ProposalEmailDraft) => Promise<void>;
  defaultDraft: ProposalEmailDraft;
  isSending: boolean;
}

export type ProposalEmailDraft = {
  quoteId: string;
  jobId: string;
  toEmail: string;
  subject: string;
  body: string;
  proposalUrl: string;
  recipientModule: string;
  recipientId: string;
};

export function SendProposalModal({
  isOpen,
  onClose,
  onConfirmSend,
  defaultDraft,
  isSending,
}: SendProposalModalProps) {
  const [draft, setDraft] = useState<ProposalEmailDraft>(defaultDraft);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAgreedToTerms(false);
      setDraft(defaultDraft);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset form when modal opens; avoid re-running on every defaultDraft identity change from parent
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast.warning("Agree to the Terms & Conditions before sending.");
      return;
    }
    await onConfirmSend(draft);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '640px', height: 'auto', padding: '0' }}>
        <button className="modal-close-btn" onClick={onClose} style={{ top: '24px', right: '24px', width: '40px', height: '40px' }}>
          <X size={20} />
        </button>

        <div className="send-modal-header">
          <div className="send-icon-wrap">
            <Mail size={24} color="var(--rw-green)" />
          </div>
          <div className="send-title-group">
            <h1>Send Proposal</h1>
            <p>Review and draft the email for your client.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="send-modal-form">
          <div className="form-group">
            <label>Recipient Email</label>
            <input
              type="email"
              value={draft.toEmail}
              onChange={(e) => setDraft({ ...draft, toEmail: e.target.value })}
              required
              placeholder="client@example.com"
            />
          </div>

          <div className="form-group">
            <label>Email Subject</label>
            <input
              type="text"
              value={draft.subject}
              onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
              required
              placeholder="Proposal for your project"
            />
          </div>

          <div className="form-group">
            <label>Email Message</label>
            <textarea
              value={draft.body}
              onChange={(e) => setDraft({ ...draft, body: e.target.value })}
              required
              rows={6}
              placeholder="Hi, here is your proposal..."
            />
          </div>

          <div className="link-preview-card">
            <div className="link-icon">
              <LinkIcon size={16} />
            </div>
            <div className="link-details">
              <span className="link-label">Proposal Secure Link</span>
              <span className="link-url">{draft.proposalUrl}</span>
            </div>
          </div>

          <label className="send-modal-terms-agree">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
            />
            <span>I have read and agree to the Terms & Conditions</span>
          </label>

          <div className="send-modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSending}>
              Cancel
            </button>
            <button type="submit" className="btn-send-confirm" disabled={isSending || !agreedToTerms}>
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Confirm and Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .send-modal-header {
          padding: 40px 40px 24px;
          display: flex;
          gap: 20px;
          align-items: center;
          border-bottom: 1px solid #F3F4F6;
        }
        .send-icon-wrap {
          width: 56px;
          height: 56px;
          background: #F0F9F4;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .send-title-group h1 {
          font-size: 20px;
          font-weight: 800;
          color: #111;
          margin-bottom: 4px;
        }
        .send-title-group p {
          font-size: 14px;
          color: #6B7280;
        }
        .send-modal-form {
          padding: 32px 40px 40px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .form-group label {
          font-size: 12px;
          font-weight: 800;
          color: #9CA3AF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .form-group input, .form-group textarea {
          padding: 12px 16px;
          border: 1px solid #E5E7EB;
          border-radius: 10px;
          font-size: 14px;
          outline: none;
          transition: 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--rw-green);
          box-shadow: 0 0 0 3px rgba(94, 137, 114, 0.1);
        }
        .link-preview-card {
          background: #F9FAFB;
          border: 1px dashed #E5E7EB;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .link-icon {
          color: #9CA3AF;
        }
        .link-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .link-label {
          font-size: 11px;
          font-weight: 700;
          color: #9CA3AF;
        }
        .link-url {
          font-size: 12px;
          font-weight: 600;
          color: var(--rw-green);
          word-break: break-all;
        }
        .send-modal-terms-agree {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
        }
        .send-modal-terms-agree input {
          margin-top: 3px;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
          accent-color: var(--rw-green);
        }
        .send-modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 20px;
        }
        .btn-cancel {
          padding: 12px 24px;
          border-radius: 10px;
          border: 1px solid #E5E7EB;
          background: white;
          color: #4B5563;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-cancel:hover {
          background: #F9FAFB;
        }
        .btn-send-confirm {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 32px;
          border-radius: 10px;
          border: none;
          background: var(--rw-green);
          color: white;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
        }
        .btn-send-confirm:hover {
          background: var(--rw-green-hover);
          transform: translateY(-1px);
        }
        .btn-send-confirm:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
