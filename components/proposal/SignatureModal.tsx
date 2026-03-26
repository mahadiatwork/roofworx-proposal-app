"use client";

import React, { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { X, Check, RotateCcw } from "lucide-react";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signatureData: string) => void;
  isSaving: boolean;
  clientName: string;
}

export function SignatureModal({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  clientName,
}: SignatureModalProps) {
  const sigRef = useRef<SignatureCanvas>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  if (!isOpen) return null;

  const handleClear = () => {
    sigRef.current?.clear();
    setIsEmpty(true);
  };

  const handleConfirm = () => {
    if (sigRef.current && !isEmpty) {
      const canvas = sigRef.current.getTrimmedCanvas();
      
      // Create a temporary canvas to add a white background
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = canvas.width;
      finalCanvas.height = canvas.height;
      const ctx = finalCanvas.getContext("2d");
      
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
        ctx.drawImage(canvas, 0, 0);
        
        // Export as high-quality JPEG
        const data = finalCanvas.toDataURL("image/jpeg", 0.9);
        onConfirm(data);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose} disabled={isSaving}>
          <X size={20} />
        </button>

        <div className="sig-modal-header">
          <h2>Acceptance of Proposal</h2>
          <p>Please sign your name below to approve the project specifications and terms.</p>
        </div>

        <div className="sig-pad-wrap">
          <SignatureCanvas
            ref={sigRef}
            penColor="#111"
            onBegin={() => setIsEmpty(false)}
            canvasProps={{
              className: "sigCanvas",
              style: {
                width: "100%",
                height: "240px",
                background: "#fdfdfd",
                borderRadius: "12px",
                cursor: "crosshair",
              },
            }}
          />
          <div className="sig-pad-hint">Digitally sign above as: <strong>{clientName}</strong></div>
        </div>

        <div className="sig-modal-footer">
          <button className="btn-sig-clear" onClick={handleClear} disabled={isSaving}>
            <RotateCcw size={16} />
            Clear
          </button>
          <button 
            className="btn-sig-approve" 
            onClick={handleConfirm} 
            disabled={isEmpty || isSaving}
          >
            {isSaving ? "Processing..." : "Sign & Approve Proposal"}
            {!isSaving && <Check size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
