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
    <div className="sticky top-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>Template:</span>
          <span className="capitalize font-medium text-foreground">{data.template}</span>
        </div>
      </div>
      
      {/* The "Paper" wrapper */}
      <div id="invoice-preview-container" className="shadow-lg min-h-[1056px] bg-white rounded-lg overflow-hidden">
        {renderTemplate()}
      </div>
    </div>
  );
}
