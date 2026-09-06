"use client"

import React from 'react';
import { useInvoice } from './InvoiceContext';
import { TemplateApex } from './templates/TemplateApex';
import { TemplateLumina } from './templates/TemplateLumina';
import { TemplateNexus } from './templates/TemplateNexus';
import { TemplateHeritage } from './templates/TemplateHeritage';
import { TemplatePrism } from './templates/TemplatePrism';
import { TemplateVelocity } from './templates/TemplateVelocity';

export function InvoicePreviewPanel() {
  const { data } = useInvoice();

  // Template Dispatcher
  const renderTemplate = () => {
    switch (data.template) {
      case 'lumina': return <TemplateLumina data={data} />;
      case 'nexus': return <TemplateNexus data={data} />;
      case 'heritage': return <TemplateHeritage data={data} />;
      case 'prism': return <TemplatePrism data={data} />;
      case 'velocity': return <TemplateVelocity data={data} />;
      case 'apex':
      case 'classic':
      case 'modern':
      case 'minimal':
      default:
        return <TemplateApex data={data} />;
    }
  };

  return (
    <div className="sticky top-2 sm:top-4 space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold font-heading">Live Preview</h2>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">
            A4 Print Ready
          </span>
        </div>
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span>Template:</span>
          <span className="capitalize font-semibold text-primary">{data.template}</span>
        </div>
      </div>
      
      {/* Responsive "Paper" wrapper */}
      <div className="w-full overflow-x-auto touch-scroll scrollbar-none pb-4 rounded-2xl">
        <div id="invoice-preview-container" className="shadow-lg min-h-[900px] sm:min-h-[1056px] bg-white rounded-2xl overflow-hidden border border-border/40 min-w-[340px]">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
}
