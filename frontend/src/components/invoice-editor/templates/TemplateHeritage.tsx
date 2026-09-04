import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { ItemsTable, TotalsSection, BankDetails } from './TemplateShared';
import { InvoiceWatermark } from '../addons/InvoiceWatermark';
import { InvoiceStamp } from '../addons/InvoiceStamp';
import { InvoiceQRCode } from '../addons/InvoiceQRCode';
import { InvoiceSignature } from '../addons/InvoiceSignature';

export function TemplateHeritage({ data }: { data: InvoiceData }) {
  return (
    <div className="relative p-12 bg-[#FDFBF7] text-[#2C3E50] shadow-xl border min-h-[1056px] flex flex-col" style={{ fontFamily: data.font }}>
      <InvoiceWatermark text={data.showWatermark ? data.watermarkStatus : null} />
      
      <div className="relative z-10 flex flex-col items-center border-b-2 border-[#2C3E50] pb-6 mb-8 text-center">
        <h1 className="text-4xl font-serif tracking-[0.3em] uppercase mb-2" style={{ color: data.themeColor }}>
          {data.billFrom.name || 'Your Company'}
        </h1>
        <p className="text-sm italic font-serif">{data.billFrom.address} | {data.billFrom.email}</p>
      </div>

      <div className="relative z-10 flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ color: data.themeColor }}>
            {data.documentType}
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm font-serif">
            <span className="font-bold">Number:</span>
            <span>{data.invoiceNumber}</span>
            <span className="font-bold">Date:</span>
            <span>{data.issueDate}</span>
            <span className="font-bold">{data.documentType === 'quotation' ? 'Valid Until:' : 'Due Date:'}</span>
            <span>{data.documentType === 'quotation' ? data.quoteExpiry : data.dueDate}</span>
            {data.poNumber && (
              <>
                <span className="font-bold">PO Num:</span>
                <span>{data.poNumber}</span>
              </>
            )}
          </div>
        </div>
        
        <div className="text-right max-w-xs">
          <p className="font-bold font-serif uppercase tracking-wider mb-2">Billed To</p>
          <p className="font-bold text-lg">{data.client.name || 'Client Name'}</p>
          <p className="text-sm whitespace-pre-line mt-1">{data.client.address}</p>
          <p className="text-sm mt-1">{data.client.email}</p>
        </div>
      </div>

      <div className="relative z-10 flex-grow font-serif">
        <ItemsTable data={data} modern={false} />
        
        <div className="flex flex-col md:flex-row justify-between items-start mt-8">
          <div className="w-full md:w-1/2 pr-4 space-y-6">
            <BankDetails data={data} />
            {data.showQRCode && (
               <div className="inline-block mt-4 p-1 border-2 border-double border-gray-400">
                 <InvoiceQRCode upiId={data.upiId} amount={data.balanceDue} name={data.billFrom.name} />
               </div>
            )}
          </div>
          <TotalsSection data={data} />
        </div>
      </div>

      <div className="relative z-10 mt-12 pt-8 border-t-2 border-[#2C3E50] flex justify-between items-end font-serif">
        <div className="w-1/2 text-sm">
          {data.notes && <div className="mb-4"><p className="font-bold italic">Notes:</p><p>{data.notes}</p></div>}
          {data.paymentDetails && <div><p className="font-bold italic">Payment Details:</p><p>{data.paymentDetails}</p></div>}
        </div>
        <div className="flex gap-6 items-end">
           {data.showStamp && <InvoiceStamp />}
           {data.showSignature && (
             <InvoiceSignature font={data.signatureFont} data={data.signatureData} title={data.signatureTitle} />
           )}
        </div>
      </div>
    </div>
  );
}
