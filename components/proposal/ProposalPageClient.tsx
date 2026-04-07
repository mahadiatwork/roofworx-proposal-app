"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, FileEdit, ChevronRight } from "lucide-react";
import { ProposalHeader, MetaBar } from "@/components/proposal/ProposalHeader";
import { ProjectCatalog } from "@/components/proposal/ProjectCatalog";
import { ProposalEditor } from "@/components/proposal/ProposalEditor";
import { ProposalSummary } from "@/components/proposal/ProposalSummary";
import { ProposalList } from "@/components/proposal/ProposalList";
import { PreviewModal } from "@/components/proposal/PreviewModal";
import { SendProposalModal, type ProposalEmailDraft } from "@/components/proposal/SendProposalModal";
import type {
  Proposal,
  JobMeta,
  CatalogItem,
  LineItem,
  ProposalSection,
  ExistingProposalSummary,
} from "@/components/proposal/types";

interface ProposalPageClientProps {
  jobId: string;
  initialProposal: Proposal;
  jobMeta: JobMeta;
  catalog: CatalogItem[];
  existingProposals: ExistingProposalSummary[];
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function ProposalPageClient({
  jobId,
  initialProposal,
  jobMeta,
  catalog,
  existingProposals,
}: ProposalPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeQuoteId = searchParams?.get("quoteId");
  const isNewMode = searchParams?.get("mode") === "new";

  const [proposal, setProposal] = useState<Proposal>(initialProposal);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Determine if we should show the full editor or the selection dashboard
  const hasSelection = !!activeQuoteId || isNewMode;

  // ── Proposal title / intro ────────────────────────────────────────────────

  const handleTitleChange = useCallback((val: string) => {
    setProposal((p) => ({ ...p, title: val }));
  }, []);

  const handleIntroChange = useCallback((val: string) => {
    setProposal((p) => ({ ...p, introText: val }));
  }, []);

  const handleDiscountChange = useCallback((val: number) => {
    setProposal((p) => ({ ...p, discount: val }));
  }, []);

  // ── Section operations ────────────────────────────────────────────────────

  const handleAddSection = useCallback(() => {
    const newSection: ProposalSection = {
      id: uid(),
      title: "New Section",
      lineItems: [],
    };
    setProposal((p) => ({ ...p, sections: [...p.sections, newSection] }));
  }, []);

  const handleDuplicateSection = useCallback((sectionId: string) => {
    setProposal((p) => {
      const idx = p.sections.findIndex((s) => s.id === sectionId);
      if (idx === -1) return p;
      const original = p.sections[idx];
      const copy: ProposalSection = {
        ...original,
        id: uid(),
        title: `${original.title} (copy)`,
        lineItems: original.lineItems.map((li) => ({ ...li, id: uid() })),
      };
      const sections = [...p.sections];
      sections.splice(idx + 1, 0, copy);
      return { ...p, sections };
    });
  }, []);

  const handleRemoveSection = useCallback((sectionId: string) => {
    setProposal((p) => ({
      ...p,
      sections: p.sections.filter((s) => s.id !== sectionId),
    }));
  }, []);

  const handleRenameSectionTitle = useCallback(
    (sectionId: string, title: string) => {
      setProposal((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === sectionId ? { ...s, title } : s
        ),
      }));
    },
    []
  );

  // ── Line item operations ──────────────────────────────────────────────────

  const handleAddLineItem = useCallback((sectionId: string) => {
    const blank: LineItem = {
      id: uid(),
      name: "New Item",
      description: "",
      price: 0,
      optional: false,
    };
    setProposal((p) => ({
      ...p,
      sections: p.sections.map((s) =>
        s.id === sectionId
          ? { ...s, lineItems: [...s.lineItems, blank] }
          : s
      ),
    }));
  }, []);

  const handleDuplicateLineItem = useCallback(
    (sectionId: string, itemId: string) => {
      setProposal((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== sectionId) return s;
          const idx = s.lineItems.findIndex((li) => li.id === itemId);
          if (idx === -1) return s;
          const copy = { ...s.lineItems[idx], id: uid() };
          const lineItems = [...s.lineItems];
          lineItems.splice(idx + 1, 0, copy);
          return { ...s, lineItems };
        }),
      }));
    },
    []
  );

  const handleRemoveLineItem = useCallback(
    (sectionId: string, itemId: string) => {
      setProposal((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === sectionId
            ? { ...s, lineItems: s.lineItems.filter((li) => li.id !== itemId) }
            : s
        ),
      }));
    },
    []
  );

  const handleUpdateLineItem = useCallback(
    (sectionId: string, updated: LineItem) => {
      setProposal((p) => ({
        ...p,
        sections: p.sections.map((s) =>
          s.id === sectionId
            ? {
              ...s,
              lineItems: s.lineItems.map((li) =>
                li.id === updated.id ? updated : li
              ),
            }
            : s
        ),
      }));
    },
    []
  );

  // ── Catalog add ───────────────────────────────────────────────────────────

  const handleAddCatalogItem = useCallback((catalogItem: CatalogItem) => {
    const newLineItem: LineItem = {
      id: uid(),
      name: catalogItem.name,
      description: catalogItem.description,
      price: catalogItem.defaultPrice,
      optional: false,
      zohoProductId: catalogItem.zohoProductId,
    };

    setProposal((p) => {
      if (p.sections.length === 0) {
        const newSection: ProposalSection = {
          id: uid(),
          title: catalogItem.category,
          lineItems: [newLineItem],
        };
        return { ...p, sections: [newSection] };
      }
      // Add to the last section
      const sections = [...p.sections];
      const last = { ...sections[sections.length - 1] };
      last.lineItems = [...last.lineItems, newLineItem];
      sections[sections.length - 1] = last;
      return { ...p, sections };
    });
  }, []);

  // ── Global actions ────────────────────────────────────────────────────────

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/proposals/save-draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          proposal,
          jobMeta,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to save draft");
      }

      console.log(`✅ Draft saved successfully to Zoho CRM. Quote ID: ${data.quoteId}`);
      
      setProposal((p) => ({ 
        ...p, 
        lastEditedAt: data.savedAt || new Date().toISOString() 
      }));
      
    } catch (error: any) {
      console.error("❌ Error saving draft:", error);
      alert(`⚠️ Failed to save draft: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [jobId, proposal, jobMeta]);

  const handlePreview = useCallback(() => {
    setIsPreviewOpen(true);
  }, []);

  const handleSend = useCallback(() => {
    // 1. Ensure we have a saved quote id
    if (isNewMode || !activeQuoteId) {
      alert("⚠️ Please save your proposal as a draft before sending it to the client.");
      return;
    }
    setIsSendModalOpen(true);
  }, [isNewMode, activeQuoteId]);

  const handleConfirmSend = useCallback(async (draft: ProposalEmailDraft) => {
    setIsSending(true);
    try {
      const response = await fetch("/api/proposals/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send proposal");
      }

      alert(`✅ Proposal has been sent successfully to ${draft.toEmail}`);
      setIsSendModalOpen(false);
      
      // Update local state to reflect the sent status
      setProposal(p => ({ ...p, status: 'sent' }));
      
    } catch (error: any) {
      console.error("❌ Send Error:", error);
      alert(`⚠️ Failed to send proposal: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  }, []);

  const handleSelectProposal = useCallback((id: string) => {
    router.push(`/proposal/${jobId}?quoteId=${id}`);
  }, [router, jobId]);

  const handleAddNew = useCallback(() => {
    router.push(`/proposal/${jobId}?mode=new`);
  }, [router, jobId]);

  const handleBack = useCallback(() => {
    router.push(`/proposal/${jobId}`);
  }, [router, jobId]);

  return (
    <div className="page-shell">
      <ProposalHeader
        jobMeta={jobMeta}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        onSend={handleSend}
        onBack={handleBack}
        isSaving={isSaving}
        isEditMode={!proposal.id.startsWith("new-")}
        hasSelection={hasSelection}
      />
      <MetaBar jobMeta={jobMeta} />

      <div className="page-body">
        <div className="workspace-left-tray">
          {hasSelection && (
            <ProjectCatalog catalog={catalog} onAddItem={handleAddCatalogItem} />
          )}
        </div>

        {hasSelection ? (
          <>
            <ProposalEditor
              title={proposal.title}
              introText={proposal.introText}
              sections={proposal.sections}
              onTitleChange={handleTitleChange}
              onIntroChange={handleIntroChange}
              onAddSection={handleAddSection}
              onRemoveSection={handleRemoveSection}
              onDuplicateSection={handleDuplicateSection}
              onRenameSectionTitle={handleRenameSectionTitle}
              onAddLineItem={handleAddLineItem}
              onRemoveLineItem={handleRemoveLineItem}
              onDuplicateLineItem={handleDuplicateLineItem}
              onUpdateLineItem={handleUpdateLineItem}
            />

            <ProposalSummary
              sections={proposal.sections}
              discount={proposal.discount}
              onDiscountChange={handleDiscountChange}
              lastEditedAt={proposal.lastEditedAt}
              onSend={handleSend}
              onPreview={handlePreview}
              onSaveDraft={handleSaveDraft}
              isSaving={isSaving}
            />
          </>
        ) : (
          <div className="discovery-dashboard">
            <div className="dashboard-content">
              <h1>Select or Create a Proposal</h1>
              <p>Choose an existing draft from the list or start a fresh proposal for this job.</p>
              
              <div className="dashboard-section-label">PROPOSALS</div>
              
              <div className="dashboard-proposal-list">
                {existingProposals.length === 0 ? (
                  <div className="dashboard-empty-state">
                    No proposals found. Start a new one below.
                  </div>
                ) : (
                  existingProposals.map((item) => (
                    <div key={item.id} className="dashboard-proposal-card">
                      <div className="card-status-icon">
                        {/* Simple icon from screenshot */}
                        <div className="icon-box">
                          <div className="icon-inner" />
                        </div>
                      </div>
                      <div className="card-info">
                        <div className="card-name">{item.name}</div>
                        <div className="card-meta">
                          {item.status} • {item.modifiedTime ? new Date(item.modifiedTime).toLocaleDateString() : '3/10/2026'}
                        </div>
                      </div>
                      <button 
                        className="btn-card-edit"
                        onClick={() => handleSelectProposal(item.id)}
                      >
                        <FileEdit size={14} />
                        Edit Draft
                      </button>
                      <div className="card-arrow">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button className="btn-dashboard-new" type="button" onClick={handleAddNew}>
                <Plus size={18} />
                Proposal App
              </button>
            </div>
          </div>
        )}
      </div>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        proposal={proposal}
        jobMeta={jobMeta}
      />
      {isSendModalOpen && activeQuoteId && (
        <SendProposalModal
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
          onConfirmSend={handleConfirmSend}
          isSending={isSending}
          defaultDraft={{
            quoteId: activeQuoteId,
            jobId: jobId,
            toEmail: jobMeta.contactEmail,
            subject: `Roofing Proposal for ${jobMeta.accountName} - ${proposal.title}`,
            body: `Hi ${jobMeta.contactName},\n\nIt was a pleasure meeting you to discuss your project. We have prepared a detailed digital proposal for the exterior work we discussed.\n\nYou can review the specifications and approve or request changes by clicking the secure link below.\n\nThank you for considering RoofWorx Exteriors!`,
            proposalUrl: `https://roofworx-proposal-app.vercel.app/p/${jobId}?quoteId=${activeQuoteId}`,
            recipientModule: jobMeta.recipientModule,
            recipientId: jobMeta.recipientId
          }}
        />
      )}
    </div>
  );
}
