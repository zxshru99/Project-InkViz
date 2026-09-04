import React from 'react';

export function InvoiceStamp() {
  return (
    <div className="w-32 h-32 border-4 border-blue-600 rounded-full flex items-center justify-center transform -rotate-12 opacity-80 z-10 mx-auto lg:mx-0">
      <div className="text-center text-blue-600 font-bold uppercase tracking-widest leading-none">
        <span className="block text-2xl border-b-2 border-blue-600 pb-1 mb-1">APPROVED</span>
        <span className="block text-sm">COMPANY SEAL</span>
      </div>
    </div>
  );
}
