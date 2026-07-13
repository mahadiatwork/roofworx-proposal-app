"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, FileEdit, ChevronRight } from "lucide-react";
import { ProposalHeader, MetaBar } from "@/components/proposal/ProposalHeader";
import { ProjectCatalog } from "@/components/proposal/ProjectCatalog";
import { ProposalEditor } from "@/components/proposal/ProposalEditor";
import { ProposalSummary } from "@/components/proposal/ProposalSummary";
import { PreviewModal } from "@/components/proposal/PreviewModal";
import { SendProposalModal, type ProposalEmailDraft } from "@/components/proposal/SendProposalModal";
import { OPTION_ITEMS } from "@/lib/mock-data";
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
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Track the last successfully saved proposal so auto-save only fires on real changes.
  const lastSavedProposalRef = useRef<Proposal>(initialProposal);
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleRemoveLineItem = useCallback(
    (sectionId: string, itemId: string) => {
      setProposal((p) => ({
        ...p,
        sections: p.sections
          .map((s) =>
            s.id === sectionId
              ? { ...s, lineItems: s.lineItems.filter((li) => li.id !== itemId) }
              : s
          )
          .filter((s) => s.lineItems.length > 0),
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
      // Templates may be selected multiple times — each gets its own section
      // keyed off the template name so the editor's per-product narrative is
      // preserved rather than merged into a single section.
      if (p.sections.some((s) =>
        s.lineItems.some((li) => li.zohoProductId === catalogItem.zohoProductId && catalogItem.zohoProductId)
      )) {
        return p;
      }
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

  // Add an "Options" catalog item as an optional line item. Options are never
  // tied to a Zoho product (empty zohoProductId) so the quote's one-product limit
  // still applies only to the main scope-of-work template. They are always
  // addable, even after a main product has been selected.
  const handleAddOptionItem = useCallback((catalogItem: CatalogItem) => {
    const newLineItem: LineItem = {
      id: uid(),
      name: catalogItem.name,
      description: catalogItem.description,
      price: catalogItem.defaultPrice,
      optional: true,
      purchaseOption: "Optional",
      zohoProductId: catalogItem.zohoProductId,
    };

    setProposal((p) => {
      // Reuse an existing "Options" section if present, otherwise create one.
      const existingIdx = p.sections.findIndex(
        (s) => s.title.trim().toLowerCase() === "options"
      );
      if (existingIdx >= 0) {
        const section = p.sections[existingIdx];
        if (
          section.lineItems.some(
            (li) =>
              (catalogItem.zohoProductId && li.zohoProductId === catalogItem.zohoProductId) ||
              li.name === catalogItem.name
          )
        ) {
          return p;
        }
        const sections = [...p.sections];
        sections[existingIdx] = {
          ...section,
          lineItems: [...section.lineItems, newLineItem],
        };
        return { ...p, sections };
      }
      const optionsSection: ProposalSection = {
        id: uid(),
        title: "Options",
        lineItems: [newLineItem],
      };
      return { ...p, sections: [...p.sections, optionsSection] };
    });
  }, []);

  // ── Global actions ────────────────────────────────────────────────────────

  // Core save routine used by both manual Save Draft and auto-save.
  const saveDraft = useCallback(
    async ({
      silent,
      updateUrl,
    }: {
      silent: boolean;
      updateUrl: boolean;
    }): Promise<string | null> => {
      if (isSaving) return null;
      setIsSaving(true);
      setSaveStatus("saving");
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

        const savedProposal: Proposal = {
          ...proposal,
          id: data.quoteId,
          status: "draft",
          lastEditedAt: data.savedAt || new Date().toISOString(),
        };
        lastSavedProposalRef.current = savedProposal;
        setProposal(savedProposal);
        setSaveStatus("saved");

        if (updateUrl) {
          router.replace(`/proposal/${jobId}?quoteId=${encodeURIComponent(data.quoteId)}`);
        }

        return data.quoteId as string;
      } catch (error: any) {
        console.error("❌ Error saving draft:", error);
        setSaveStatus("error");
        if (!silent) {
          toast.error(`Failed to save draft: ${error.message}`);
        }
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [jobId, proposal, jobMeta, router, isSaving]
  );

  const handleSaveDraft = useCallback(() => {
    return saveDraft({ silent: false, updateUrl: true });
  }, [saveDraft]);

  // Google Docs–style auto-save: watch for changes and debounce a save.
  useEffect(() => {
    if (!hasSelection) return;
    if (JSON.stringify(proposal) === JSON.stringify(lastSavedProposalRef.current)) {
      setSaveStatus("saved");
      return;
    }

    setSaveStatus("unsaved");

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      saveDraft({ silent: true, updateUrl: false });
    }, 5000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [proposal, hasSelection, saveDraft]);

  // Warn the user if they try to close the tab with unsaved changes.
  useEffect(() => {
    if (saveStatus !== "unsaved" && saveStatus !== "error") return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  const handlePreview = useCallback(() => {
    setIsPreviewOpen(true);
  }, []);

  const handleSend = useCallback(async () => {
    // 1. Ensure we have a saved quote id. If the proposal is still brand-new,
    // run an immediate auto-save first so the rep isn't blocked.
    let quoteId = proposal.id;
    if (quoteId.startsWith("new-")) {
      quoteId = (await saveDraft({ silent: true, updateUrl: true })) ?? quoteId;
    }

    if (quoteId.startsWith("new-")) {
      toast.warning("Save your proposal as a draft before sending it to the client.");
      return;
    }
    setIsSendModalOpen(true);
  }, [proposal.id, saveDraft]);

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

      toast.success(`Proposal sent to ${draft.toEmail}`);
      setIsSendModalOpen(false);
      
      // Update local state to reflect the sent status
      setProposal(p => ({ ...p, status: 'sent' }));
      
    } catch (error: any) {
      console.error("❌ Send Error:", error);
      toast.error(`Failed to send proposal: ${error.message}`);
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
        proposalStatus={proposal.status}
        onSaveDraft={handleSaveDraft}
        onPreview={handlePreview}
        onSend={handleSend}
        onBack={handleBack}
        isSaving={isSaving}
        saveStatus={saveStatus}
        isEditMode={!proposal.id.startsWith("new-")}
        hasSelection={hasSelection}
      />
      <MetaBar jobMeta={jobMeta} />

      <div className="page-body">
        <div className="workspace-left-tray">
          {hasSelection && (
<ProjectCatalog
              catalog={catalog}
              options={OPTION_ITEMS}
              onAddItem={handleAddCatalogItem}
              onAddOption={handleAddOptionItem}
            />
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
              onRemoveSection={handleRemoveSection}
              onRenameSectionTitle={handleRenameSectionTitle}
              onRemoveLineItem={handleRemoveLineItem}
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
                New Proposal
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
      {isSendModalOpen && (
        <SendProposalModal
          isOpen={isSendModalOpen}
          onClose={() => setIsSendModalOpen(false)}
          onConfirmSend={handleConfirmSend}
          isSending={isSending}
          defaultDraft={{
            quoteId: activeQuoteId || proposal.id,
            jobId: jobId,
            toEmail: jobMeta.contactEmail,
            subject: `Roofing Proposal for ${jobMeta.accountName} - ${proposal.title}`,
            body: `Hi ${jobMeta.contactName},\n\nIt was a pleasure meeting you to discuss your project. We have prepared a detailed digital proposal for the exterior work we discussed.\n\nYou can review the specifications and approve or request changes by clicking the secure link below.\n\nThank you for considering RoofWorx Exteriors!`,
            proposalUrl: `https://roofworx-proposal-app.vercel.app/p/${jobId}?quoteId=${activeQuoteId || proposal.id}`,
            recipientModule: jobMeta.recipientModule,
            recipientId: jobMeta.recipientId
          }}
        />
      )}
    </div>
  );
}
