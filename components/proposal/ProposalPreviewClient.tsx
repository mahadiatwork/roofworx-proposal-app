"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Mail, MapPin, Phone, Globe, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { Proposal, JobMeta } from "./types";
import { SignatureModal } from "./SignatureModal";
import { LegacyProposalPDF } from "./LegacyProposalPDF";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ProposalPreviewProps {
    proposal: Proposal;
    jobMeta: JobMeta;
}

export function ProposalPreviewClient({ proposal, jobMeta }: ProposalPreviewProps) {
    const searchParams = useSearchParams();
    const [selectedOptionals, setSelectedOptionals] = useState<Set<string>>(new Set());
    const [isApproving, setIsApproving] = useState(false);
    const [isApproved, setIsApproved] = useState(proposal.status === 'approved' || (proposal as any).status === 'Accepted');
    const [isSigModalOpen, setIsSigModalOpen] = useState(false);
    const [signatureData, setSignatureData] = useState<string | undefined>(undefined);

    const toggleOptional = (id: string) => {
        const next = new Set(selectedOptionals);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedOptionals(next);
    };

    const handleApprove = () => {
        const quoteId = searchParams?.get('quoteId') || proposal.id;
        if (!quoteId || quoteId.startsWith('new-')) {
            alert("Error: Missing valid proposal identifier.");
            return;
        }
        setIsSigModalOpen(true);
    };

    const handleConfirmSignature = async (base64: string) => {
        setSignatureData(base64);
        setIsSigModalOpen(false);
        setIsApproving(true);

        try {
            // Give time for state to update so signature is in the hidden PDF div
            await new Promise(r => setTimeout(r, 800));
            
            // 1. Generate the Legacy PDF
            const element = document.getElementById('legacy-proposal-pdf');
            if (!element) throw new Error("PDF component not found");

            // Reduced scale and JPEG compression to keep payload under Vercel limits (4.5MB)
            const canvas = await html2canvas(element, { 
                scale: 1.5, 
                logging: false,
                useCORS: true,
                allowTaint: true
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 0.75); // Use JPEG 75% for significantly smaller size than PNG
            
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4',
                compress: true
            });
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            // Add image as JPEG with compression
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
            
            const pdfBlob = pdf.output('blob');
            const quoteId = searchParams?.get('quoteId') || proposal.id;

            // 2. Upload to CRM
            const formData = new FormData();
            formData.append('quoteId', quoteId!);
            formData.append('jobId', jobMeta.recipientId);
            formData.append('signature', base64);
            formData.append('pdf', pdfBlob, `Proposal-${jobMeta.proposalNumber}.pdf`);

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
    const requiredTotal = allItems.filter(li => !li.optional).reduce((sum, li) => sum + li.price, 0);
    const selectedOptionalTotal = allItems.filter(li => li.optional && selectedOptionals.has(li.id)).reduce((sum, li) => sum + li.price, 0);
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
                    {proposal.sections.map((section, sIdx) => (
                        <div key={section.id} className="preview-section" style={{ animation: `slideUp 0.6s ease-out ${sIdx * 0.1}s both` }}>
                            <h3 className="preview-section-title">{section.title}</h3>
                            <div className="preview-items">
                                {section.lineItems.map((item) => (
                                    <div key={item.id} className={`preview-item-row ${item.optional ? 'is-optional' : ''}`}>
                                        <div className="item-main-content">
                                            <div className="item-header-row">
                                                <h4 className="item-name">{item.name}</h4>
                                                <div className="item-price-pill">
                                                    {item.optional && (
                                                        <button
                                                            className={`preview-select-btn ${selectedOptionals.has(item.id) ? 'selected' : ''}`}
                                                            onClick={() => toggleOptional(item.id)}
                                                            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                                                        >
                                                            {selectedOptionals.has(item.id) && <Check size={12} />}
                                                            {selectedOptionals.has(item.id) ? 'Selected' : 'Add to Project'}
                                                        </button>
                                                    )}
                                                    <span className="item-price-value">
                                                        ${item.price.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="item-description">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Final Summary & Approval CTA ─────────────────────────────── */}
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

                    <div className="action-buttons">
                        <button 
                            className={`btn-approve-primary ${isApproved ? 'is-approved' : ''}`}
                            onClick={handleApprove}
                            disabled={isApproving || isApproved}
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

            <LegacyProposalPDF 
                proposal={proposal}
                jobMeta={jobMeta}
                signatureData={signatureData}
            />
        </div>
    );
}
