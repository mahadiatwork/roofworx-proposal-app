"use client";

import React from "react";
import type { Proposal, JobMeta } from "./types";

interface LegacyProposalPDFProps {
  proposal: Proposal;
  jobMeta: JobMeta;
  signatureData?: string;
}

export function LegacyProposalPDF({
  proposal,
  jobMeta,
  signatureData,
}: LegacyProposalPDFProps) {
  const today = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const totalRequired = proposal.sections
    .flatMap((s) => s.lineItems)
    .filter((li) => !li.optional)
    .reduce((sum, li) => sum + li.price, 0);

  const totalOptional = proposal.sections
    .flatMap((s) => s.lineItems)
    .filter((li) => li.optional)
    .reduce((sum, li) => sum + li.price, 0);

  const grandTotal = Math.max(0, totalRequired + totalOptional - proposal.discount);

  return (
    <div
      id="legacy-proposal-pdf"
      style={{
        width: "800px",
        padding: "50px",
        background: "white",
        color: "black",
        fontFamily: "'Times New Roman', serif",
        position: "absolute",
        left: "-9999px", // Hide from view but keep in DOM for canvas capture
        lineHeight: "1.2",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "30px" }}>
        <div style={{ textAlign: "left" }}>
          <h1 style={{ fontSize: "28px", margin: "0", fontWeight: "900" }}>Roof Worx Exteriors, Inc.</h1>
          <div style={{ fontSize: "14px", fontWeight: "700" }}>
            <p style={{ margin: "2px 0" }}>630 Bonnie Lane</p>
            <p style={{ margin: "2px 0" }}>Elk Grove Village, Illinois 60007</p>
            <p style={{ margin: "2px 0" }}>(630) 634-7600</p>
            <p style={{ margin: "2px 0" }}>office@roofworxext.com</p>
          </div>
        </div>
        <div style={{ textAlign: "right", fontSize: "16px", fontWeight: "bold" }}>
          <p style={{ margin: "4px 0" }}>Date: {today}</p>
          <p style={{ margin: "4px 0" }}>Proposal Number: {jobMeta.proposalNumber}</p>
        </div>
      </div>

      {/* ── Client / Job Site Boxes ───────────────────────────────── */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1, border: "1px solid black", padding: "10px" }}>
          <div style={{ fontWeight: "bold", borderBottom: "1px solid black", marginBottom: "8px", paddingBottom: "4px" }}>
            Proposal Submitted To: ("Customer")
          </div>
          <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
            <p style={{ margin: "2px 0" }}><strong>Name:</strong> {jobMeta.contactName}</p>
            <p style={{ margin: "2px 0" }}><strong>Street:</strong> {jobMeta.propertyAddress.split(",")[0]}</p>
            <p style={{ margin: "2px 0" }}><strong>City:</strong> {jobMeta.propertyAddress.split(",")[1]?.trim() || ""}</p>
            <p style={{ margin: "2px 0" }}><strong>Phone:</strong> (555) 123-4567</p>
            <p style={{ margin: "2px 0" }}><strong>Email:</strong> {jobMeta.contactEmail}</p>
          </div>
        </div>
        <div style={{ flex: 1, border: "1px solid black", padding: "10px" }}>
          <div style={{ fontWeight: "bold", borderBottom: "1px solid black", marginBottom: "8px", paddingBottom: "4px" }}>
            Job Site:
          </div>
          <div style={{ fontSize: "13px", lineHeight: "1.4" }}>
            <p style={{ margin: "2px 0" }}><strong>Name:</strong> {jobMeta.accountName}</p>
            <p style={{ margin: "2px 0" }}><strong>Street:</strong> {jobMeta.propertyAddress}</p>
            <p style={{ margin: "2px 0" }}><strong>Property Class:</strong> {jobMeta.propertyClass}</p>
          </div>
        </div>
      </div>

      {/* ── Intro Text ────────────────────────────────────────────── */}
      <div style={{ fontSize: "12px", textAlign: "justify", marginBottom: "20px", borderTop: "2px solid black", paddingTop: "10px" }}>
        <p style={{ margin: "0", fontWeight: "bold", textDecoration: "underline" }}>
          ROOF WORX EXTERIORS, INC., an Illinois corporation,
        </p>
        <p style={{ margin: "4px 0" }}>
          hereinafter ("CONTRACTOR") hereby proposes to furnish the materials and perform the labor necessary for the
          completion of the following work (the "WORK"):
        </p>
      </div>

      {/* ── Scope of Work ─────────────────────────────────────────── */}
      <div style={{ fontSize: "12px", marginBottom: "30px" }}>
        {proposal.sections.map((section) => (
          <div key={section.id} style={{ marginBottom: "15px" }}>
            <h3 style={{ fontSize: "13px", margin: "0 0 8px 0", textTransform: "uppercase", borderBottom: "1px solid #EEE" }}>
              {section.title}
            </h3>
            <ol style={{ paddingLeft: "20px", margin: "0" }}>
              {section.lineItems.map((item) => (
                <li key={item.id} style={{ marginBottom: "6px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>
                      <strong>{item.name}</strong> - {item.description}
                    </span>
                    <span style={{ fontWeight: "bold" }}>${item.price.toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* ── Fine Print (Red/Bold sections) ────────────────────────── */}
      <div style={{ fontSize: "11px", color: "#333", borderTop: "1px solid black", paddingTop: "15px" }}>
        <p style={{ margin: "8px 0", color: "#d32f2f" }}>
          <strong>Proposal Expiration:</strong> Due to fluctuating material pricing in the construction industry we cannot hold to contract pricing for more than seven (7) days.
        </p>
        <p style={{ margin: "8px 0" }}>
          <strong>NOTE:</strong> Charges includes removal of up to one (1) layers of roofing; if additional layers are found, additional cost to the Customer will be added to contract.
        </p>
        <p style={{ margin: "8px 0" }}>
           The Work provided hereunder is subject to the Roof Worx Exteriors, Inc. Standard Terms and Conditions attached.
        </p>
        
        <div style={{ marginTop: "20px", borderTop: "2px solid black", paddingTop: "10px" }}>
          <p style={{ fontSize: "16px", fontWeight: "900", margin: "10px 0" }}>
            PRICE: <span style={{ textDecoration: "underline", padding: "0 20px" }}>${grandTotal.toLocaleString()}</span> AND __/100 Dollars
          </p>
          <p style={{ fontWeight: "bold", margin: "10px 0" }}>
            PAYMENT TO BE MADE AS FOLLOWS: 1/2 DOWN UPON EXECUTION OF THIS CONTRACT WITH PAYMENT IN FULL DUE UPON COMPLETION OF WORK.
          </p>
        </div>
      </div>

      {/* ── Acceptance Footer ─────────────────────────────────────── */}
      <div style={{ marginTop: "40px", border: "1px solid black", padding: "20px" }}>
        <h2 style={{ fontSize: "16px", textAlign: "center", textDecoration: "underline", margin: "0 0 20px 0" }}>
          ACCEPTANCE OF PROPOSAL
        </h2>
        <p style={{ fontSize: "12px", marginBottom: "30px" }}>
          The above Contract Price and other prices, specifications, and conditions are satisfactory and are hereby accepted.
          You are authorized to perform the Work as specified. Payment will be made as outlined above.
        </p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "40px" }}>CUSTOMER:</p>
            <div style={{ position: "relative", width: "250px", borderBottom: "1px solid black" }}>
              {signatureData && (
                <img 
                  src={signatureData} 
                  alt="Customer Signature" 
                  style={{ 
                    position: "absolute", 
                    bottom: "2px", 
                    left: "20px", 
                    height: "60px",
                    mixBlendMode: "multiply"
                  }} 
                />
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "11px" }}>
              <span>Signature (Name: {jobMeta.contactName})</span>
              <span>Date: {today}</span>
            </div>
          </div>

          <div style={{ flex: 1, paddingLeft: "40px" }}>
            <p style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>ROOF WORX EXTERIORS, INC.</p>
            <div style={{ fontSize: "13px" }}>
              <p style={{ margin: "4px 0" }}>By: _________________________</p>
              <p style={{ margin: "4px 0" }}>Name: Ashley Biggs</p>
              <p style={{ margin: "4px 0" }}>Title: President</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
