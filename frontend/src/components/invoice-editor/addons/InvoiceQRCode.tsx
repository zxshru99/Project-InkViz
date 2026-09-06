import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function InvoiceQRCode({ 
  upiId, 
  amount, 
  name,
  payUrl,
  invoiceNumber 
}: { 
  upiId?: string, 
  amount?: number, 
  name?: string,
  payUrl?: string,
  invoiceNumber?: string 
}) {
  // Global digital invoice verification / payment URL
  const targetUrl = payUrl || (upiId && upiId.startsWith('http') ? upiId : null) || 
    `https://inkviz.com/verify?ref=${encodeURIComponent(invoiceNumber || name || 'INV')}&amount=${amount || 0}`;
  
  return (
    <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg bg-white shadow-xs">
      <QRCodeSVG value={targetUrl} size={96} />
      <span className="text-[10px] mt-1.5 font-medium text-gray-600 text-center">Scan to Pay / Verify</span>
    </div>
  );
}
