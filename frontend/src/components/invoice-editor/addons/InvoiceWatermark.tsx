import React from 'react';

export function InvoiceWatermark({ text }: { text: string | null }) {
  if (!text) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-[0.03] z-0">
      <div className="transform -rotate-45 text-[150px] font-black uppercase whitespace-nowrap">
        {text}
      </div>
    </div>
  );
}
