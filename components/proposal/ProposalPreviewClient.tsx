"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Mail, MapPin, Phone, Globe, Loader2 } from "lucide-react";
import { getProductProposalTerms } from "@/lib/terms-and-conditions";
import { useSearchParams } from "next/navigation";
import type { Proposal, JobMeta } from "./types";
import { SignatureModal } from "./SignatureModal";

interface ProposalPreviewProps {
    proposal: Proposal;
    jobMeta: JobMeta;
}

export function ProposalPreviewClient({ proposal, jobMeta }: ProposalPreviewProps) {
    const searchParams = useSearchParams();
    const [selectedOptionals, setSelectedOptionals] = useState<Set<string>>(() => {
        const initial = new Set<string>();
        proposal.sections.forEach(s => {
            s.lineItems.forEach(li => {
                if (li.purchaseOption === "Accepted") {
                    initial.add(li.id);
                }
            });
        });
        return initial;
    });
    const [isApproving, setIsApproving] = useState(false);
    const [isApproved, setIsApproved] = useState(proposal.status === 'approved' || (proposal as any).status === 'Accepted');
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const toggleOptional = (id: string) => {
        // Locked if already Accepted/Approved in CRM
        const item = proposal.sections.flatMap(s => s.lineItems).find(li => li.id === id);
        if (item?.purchaseOption === "Accepted") return;

        const next = new Set(selectedOptionals);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedOptionals(next);
    };

    const handleApprove = () => {
        if (!agreedToTerms) {
            alert("Please accept the Terms & Conditions and acknowledge the 50% deposit before signing.");
            return;
        }
        const quoteId = searchParams?.get('quoteId') || proposal.id;
        if (!quoteId || quoteId.startsWith('new-')) {
            alert("Error: Missing valid proposal identifier.");
            return;
        }
        setIsSigModalOpen(true);
    };

    const handleConfirmSignature = async (base64: string) => {
        setIsSigModalOpen(false);
        setIsApproving(true);

        try {
            const quoteId = searchParams?.get('quoteId') || proposal.id;
            const formData = new FormData();
            formData.append('quoteId', quoteId!);
            formData.append('jobId', jobMeta.recipientId);
            formData.append('signature', base64);
            formData.append('selectedOptionals', JSON.stringify(Array.from(selectedOptionals)));
            formData.append('agreementAccepted', String(agreedToTerms));

            const res = await fetch("/api/proposals/approve", {
                method: "POST",
                body: formData,
            });
            
            const data = await res.json();
            
            if (res.ok && data.success) {
                setIsApproved(true);
            } else {
                alert(data.error || "Failed to finalize approval. Please try again.");
            }
        } catch (error) {
            console.error("Fulfillment error:", error);
            alert("An error occurred during finalization. Please contact your representative.");
        } finally {
            setIsApproving(false);
        }
    };

    const allItems = proposal.sections.flatMap(s => s.lineItems);
    const requiredItems = allItems.filter(li => !li.optional);
    const optionalItems = allItems.filter(li => li.optional);
    const productName = allItems.find(item => item.zohoProductId && !item.optional)?.name
        ?? allItems.find(item => item.zohoProductId)?.name
        ?? allItems[0]?.name;
    const termsAndConditions = getProductProposalTerms(productName).termsAndConditions;
    const requiredTotal = requiredItems.reduce((sum, li) => sum + li.price, 0);
    const selectedOptionalTotal = optionalItems.filter(li => selectedOptionals.has(li.id)).reduce((sum, li) => sum + li.price, 0);
    const grandTotal = Math.max(0, requiredTotal + selectedOptionalTotal - proposal.discount);

    return (
        <div className="preview-layout">
            {/* ── Top Branding ────────────────────────────────────────────── */}
            <header className="preview-header">
                <div className="brand-group">
                    <div className="brand-logo-black">
                        <Image 
                            src="/Roofworx-logo.png" 
                            alt="RoofWorx Logo" 
                            width={64} 
                            height={64} 
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                    <div className="brand-info">
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px', opacity: 0.5, fontSize: '11px', fontWeight: 600 }}>
                            <span>roofworx.com</span>
                            <span>•</span>
                            <span>Expert Roofing</span>
                        </div>
                    </div>
                </div>
                <div className="preview-meta-group">
                    <span className="preview-number">Proposal # {jobMeta.proposalNumber}</span>
                    <span className="preview-date">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </header>

            <main className="preview-container" style={{ animation: 'fadeIn 0.6s ease-out' }}>
                {/* ── Client / Rep Card ────────────────────────────────────────── */}
                <section className="client-info-card">
                    <div className="client-info-section">
                        <span className="info-label">PREPARED FOR</span>
                        <h1 className="client-name">{jobMeta.contactName}</h1>
                        <p className="client-meta"><MapPin size={14} /> {jobMeta.propertyAddress}</p>
                        <div className="meta-row" style={{ marginTop: '12px', display: 'flex', gap: '16px' }}>
                            <span className="client-meta"><Phone size={14} /> (555) 123-4567</span>
                        </div>
                    </div>
                    <div className="divider-v" />
                    <div className="client-info-section">
                        <span className="info-label">YOUR REPRESENTATIVE</span>
                        <h3 className="rep-name">{jobMeta.salesperson}</h3>
                        <p className="rep-meta"><Mail size={14} /> info@roofworx.com</p>
                        <p className="rep-meta" style={{ marginTop: '4px' }}><Globe size={14} /> roofworx.com/team</p>
                    </div>
                </section>

                {/* ── Proposal Intro ──────────────────────────────────────────── */}
                <section className="preview-intro-section">
                    <h2 className="proposal-main-title">{proposal.title}</h2>
                    <div className="proposal-intro-text">
                        {proposal.introText.split('\n').map((line, i) => (
                            <p key={i} style={{ marginBottom: '1.2em' }}>{line}</p>
                        ))}
                    </div>
                </section>

                {/* ── Scope of Work Sections ────────────────────────────────────── */}
                <div className="preview-sections">
                    {/* Required scope-of-work items */}
                    {requiredItems.length > 0 && (
                        <div className="preview-section" style={{ animation: `slideUp 0.6s ease-out both` }}>
                            <div className="preview-items">
                                {requiredItems.map((item) => (
                                    <div key={item.id} className="preview-item-row">
                                        <div className="item-main-content">
                                            <p className="item-description item-description--client">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Optional add-ons — separate entity, unselected by default */}
                    {optionalItems.length > 0 && (
                        <div className="preview-section" style={{ animation: `slideUp 0.6s ease-out 0.1s both` }}>
                            <div style={{ marginBottom: '16px' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        background: '#1A56DB',
                                        color: 'white',
                                        fontSize: '11px',
                                        fontWeight: 800,
                                        letterSpacing: '0.05em',
                                        padding: '4px 10px',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    OPTION:
                                </span>
                            </div>
                            <div className="preview-items">
                                {optionalItems.map((item) => (
                                    <div key={item.id} className="preview-item-row is-optional">
                                        <div className="item-main-content">
                                            <div className="item-header-row">
                                                <p className="item-description item-description--client">{item.description}</p>
                                                <div className="item-price-pill item-price-pill--client">
                                                    <button
                                                        className={`preview-select-btn ${selectedOptionals.has(item.id) ? 'selected' : ''}`}
                                                        onClick={() => toggleOptional(item.id)}
                                                        type="button"
                                                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                    >
                                                        {selectedOptionals.has(item.id) && <Check size={12} />}
                                                        {selectedOptionals.has(item.id) ? 'Selected' : 'Add to Project'}
                                                    </button>
                                                    <span className="item-price-value">
                                                        ${item.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Final Summary, Terms, Approval ───────────────────────────── */}
                <footer className="preview-footer-cta">
                    <div className="grand-total-section">
                        {proposal.discount > 0 && (
                            <div style={{ marginBottom: '24px', opacity: 0.8 }}>
                                <span className="total-label" style={{ color: '#5E8972' }}>- ${proposal.discount.toLocaleString()} Discount Applied</span>
                            </div>
                        )}
                        <span className="total-label">Project Total</span>
                        <div className="total-value-wrap" style={{ position: 'relative', display: 'inline-block' }}>
                            <span className="total-value">${grandTotal.toLocaleString()}</span>
                        </div>
                        {(requiredTotal > 0 || proposal.discount > 0) && (
                            <p className="total-breakdown">
                                ${requiredTotal.toLocaleString()} Base Project
                                {selectedOptionalTotal > 0 && (
                                    <span style={{ color: '#5E8972', fontWeight: 700 }}>
                                        {` + $${selectedOptionalTotal.toLocaleString()} Selected Options`}
                                    </span>
                                )}
                                {proposal.discount > 0 && (
                                    <span style={{ color: '#E11D48', fontWeight: 700 }}>
                                        {` - $${proposal.discount.toLocaleString()} Discount`}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <section className="preview-terms-section" aria-label="Terms and Conditions">
                        <h3 className="preview-terms-heading">Terms & Conditions</h3>
                        <div className="preview-terms-body" tabIndex={0} aria-label="Full Terms and Conditions">
                            <pre className="preview-terms-pre">{termsAndConditions}</pre>
                        </div>
                    </section>

                    <p id="deposit-acknowledgment" className="preview-deposit-language">
                        <strong>Deposit:</strong> A 50% deposit is due upon execution of this agreement. The remaining balance is due upon completion of the work.
                    </p>

                    <label className="preview-terms-agree-row">
                        <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            disabled={isApproved}
                            aria-describedby="deposit-acknowledgment"
                        />
                        <span>I have read and agree to the Terms & Conditions and acknowledge that a 50% deposit is due upon execution.</span>
                    </label>

                    <div className="action-buttons">
                        <button 
                            className={`btn-approve-primary ${isApproved ? 'is-approved' : ''}`}
                            onClick={handleApprove}
                            disabled={isApproving || isApproved || !agreedToTerms}
                        >
                            {isApproving ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                            {isApproved ? 'Proposal Approved' : 'Approve Proposal'}
                        </button>
                        <button className="btn-questions">
                            <Mail size={18} />
                            I have questions
                        </button>
                    </div>

                    <p className="footer-legal">
                        This document is a formal estimate for the scope of work described above.
                        By clicking "Approve Proposal", you authorize RoofWorx to proceed with the scheduling
                        and procurement for your project according to our standard terms.
                    </p>
                </footer>
            </main>

            <SignatureModal 
                isOpen={isSigModalOpen}
                onClose={() => setIsSigModalOpen(false)}
                onConfirm={handleConfirmSignature}
                isSaving={isApproving}
                clientName={jobMeta.contactName}
            />
        </div>
    );
}
