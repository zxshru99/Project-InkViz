import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export function InvoiceQRCode({ upiId, amount, name }: { upiId: string, amount: number, name: string }) {
  if (!upiId) return null;
  
  // Basic UPI intent URI
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR`;
  
  return (
    <div className="flex flex-col items-center p-2 border rounded-md bg-white">
      <QRCodeSVG value={upiUrl} size={100} />
      <span className="text-[10px] mt-1 text-muted-foreground text-center">Scan to Pay</span>
    </div>
  );
}
