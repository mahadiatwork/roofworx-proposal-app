"use client";

import { useState, useRef } from "react";
import { GripVertical, Plus, Trash2, Copy } from "lucide-react";
import type { ProposalSection, LineItem } from "@/components/proposal/types";

interface ProposalEditorProps {
  title: string;
  introText: string;
  sections: ProposalSection[];
  onTitleChange: (v: string) => void;
  onIntroChange: (v: string) => void;
  onAddSection: () => void;
  onRemoveSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onRenameSectionTitle: (id: string, t: string) => void;
  onAddLineItem: (id: string) => void;
  onRemoveLineItem: (sid: string, iid: string) => void;
  onDuplicateLineItem: (sid: string, iid: string) => void;
  onUpdateLineItem: (sid: string, item: LineItem) => void;
}

export function ProposalEditor(props: ProposalEditorProps) {
  return (
    <main className="editor-main">
      <input
        className="editor-title-input"
        value={props.title}
        onChange={(e) => props.onTitleChange(e.target.value)}
        placeholder="Proposal Title"
      />
      <div className="editor-intro-card">
        <textarea
          className="editor-intro-textarea"
          value={props.introText}
          onChange={(e) => props.onIntroChange(e.target.value)}
          placeholder="Personalize your intro text..."
          rows={3}
        />
      </div>
      <div className="editor-sections">
        {props.sections.map((sec, idx) => (
          <SectionCard
            key={sec.id}
            section={sec}
            index={idx}
            onRename={(t: string) => props.onRenameSectionTitle(sec.id, t)}
            onAdd={() => props.onAddLineItem(sec.id)}
            onRemove={() => props.onRemoveSection(sec.id)}
            onDuplicate={() => props.onDuplicateSection(sec.id)}
            onRemoveItem={(iid: string) => props.onRemoveLineItem(sec.id, iid)}
            onUpdateItem={(item: LineItem) => props.onUpdateLineItem(sec.id, item)}
          />
        ))}
      </div>
      <button className="editor-add-section-btn" onClick={props.onAddSection}>
        <Plus size={16} /> Add Section
      </button>
    </main>
  );
}

function SectionCard({ section, index, onRename, onAdd, onRemove, onDuplicate, onRemoveItem, onUpdateItem }: any) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(section.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const commitTitle = () => {
    setIsEditingTitle(false);
    onRename(localTitle.trim() || section.title);
  };

  return (
    <div className="section-card">
      <div className="section-header">
        <div className="section-number-pill">{index + 1}</div>
        {isEditingTitle ? (
          <input
            ref={inputRef} className="section-title" autoFocus value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)} onBlur={commitTitle}
            onKeyDown={(e) => e.key === "Enter" && commitTitle()}
          />
        ) : (
          <h2 className="section-title" onClick={() => { setIsEditingTitle(true); setTimeout(() => inputRef.current?.select(), 0); }}>
            {section.title}
          </h2>
        )}
        <div className="section-actions">
          <button className="btn-section-icon" onClick={onDuplicate}><Copy size={13} /></button>
          <button className="btn-section-icon" onClick={onRemove}><Trash2 size={13} /></button>
        </div>
      </div>
      <div className="section-line-items">
        {section.lineItems.map((item: LineItem) => (
          <LineItemRow key={item.id} item={item} onUpdate={onUpdateItem} onRemove={() => onRemoveItem(item.id)} />
        ))}
      </div>
      <div className="section-footer">
        <button className="section-add-item-dashed" onClick={onAdd}>
          <Plus size={14} /> Add Line Item
        </button>
      </div>
    </div>
  );
}

function LineItemRow({ item, onUpdate, onRemove }: { item: LineItem, onUpdate: (i: LineItem) => void, onRemove: () => void }) {
  return (
    <div className="line-item-row">
      <GripVertical size={14} style={{ color: '#DDD', marginTop: '4px' }} />
      <div className="line-item-main">
        <div className="line-item-top">
          <input className="line-item-name-input" value={item.name} onChange={(e) => onUpdate({ ...item, name: e.target.value })} />
          <div className="line-item-controls">
            <div className="item-optional-wrap">
              <span>Optional</span>
              <button className={`toggle-switch ${item.optional ? 'active' : ''}`} onClick={() => onUpdate({ ...item, optional: !item.optional })} />
            </div>
            <div className="price-pill-input">
              <span className="currency-icon">$</span>
              <input type="number" className="price-input" value={item.price} onChange={(e) => onUpdate({ ...item, price: parseFloat(e.target.value) || 0 })} />
              <button className="btn-section-icon" style={{ marginLeft: '12px' }} onClick={onRemove}><Trash2 size={13} /></button>
            </div>
          </div>
        </div>
        <textarea
          className="line-item-description-textarea"
          value={item.description}
          onChange={(e) => onUpdate({ ...item, description: e.target.value })}
          placeholder="Description..."
        />
      </div>
    </div>
  );
}
