import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { ItemsTable, TotalsSection, BankDetails } from './TemplateShared';
import { InvoiceWatermark } from '../addons/InvoiceWatermark';
import { InvoiceStamp } from '../addons/InvoiceStamp';
import { InvoiceQRCode } from '../addons/InvoiceQRCode';
import { InvoiceSignature } from '../addons/InvoiceSignature';

export function TemplateNexus({ data }: { data: InvoiceData }) {
  return (
    <div className="relative p-10 bg-white text-gray-900 shadow-xl border-l-8 min-h-[1056px] flex flex-col" style={{ fontFamily: data.font, borderLeftColor: data.themeColor }}>
      <InvoiceWatermark text={data.showWatermark ? data.watermarkStatus : null} />
      
      <div className="relative z-10 flex justify-between items-center pb-8 border-b-2" style={{ borderColor: data.themeColor }}>
        <h1 className="text-4xl font-extrabold uppercase tracking-tight" style={{ color: data.themeColor }}>
          {data.documentType}
        </h1>
        <div className="text-right">
          <h2 className="text-xl font-bold">{data.billFrom.name || 'Your Company'}</h2>
          <div className="text-gray-500 text-sm whitespace-pre-line">{data.billFrom.address}</div>
        </div>
      </div>

      <div className="relative z-10 mt-8 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs uppercase font-bold text-gray-500 mb-2">Invoice To</p>
          <p className="font-bold text-lg">{data.client.name || 'Client Name'}</p>
          <div className="text-sm text-gray-600 whitespace-pre-line">{data.client.address}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
             <p className="text-xs uppercase font-bold text-gray-500">Invoice No</p>
             <p className="font-bold text-lg">{data.invoiceNumber}</p>
          </div>
          <div>
             <p className="text-xs uppercase font-bold text-gray-500">Date</p>
             <p className="font-semibold">{data.issueDate}</p>
          </div>
          <div>
             <p className="text-xs uppercase font-bold text-gray-500">{data.documentType === 'quotation' ? 'Expiry' : 'Due Date'}</p>
             <p className="font-semibold">{data.documentType === 'quotation' ? data.quoteExpiry : data.dueDate}</p>
          </div>
          {data.poNumber && (
            <div>
               <p className="text-xs uppercase font-bold text-gray-500">PO Number</p>
               <p className="font-semibold">{data.poNumber}</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-8 flex-grow">
        <ItemsTable data={data} />
        
        <div className="flex flex-col md:flex-row justify-between items-start mt-8">
          <div className="w-full md:w-1/2 pr-4 space-y-6">
            <BankDetails data={data} />
            {data.showQRCode && (
               <div className="inline-block mt-4">
                 <InvoiceQRCode upiId={data.upiId} amount={data.balanceDue} name={data.billFrom.name} />
               </div>
            )}
          </div>
          <TotalsSection data={data} />
        </div>
      </div>

      <div className="relative z-10 mt-12 flex justify-between items-end border-t pt-8">
        <div className="text-sm text-gray-600 w-1/2 pr-8">
          {data.notes && <div className="mb-4"><p className="font-bold uppercase text-xs">Notes</p><p>{data.notes}</p></div>}
          {data.paymentDetails && <div><p className="font-bold uppercase text-xs">Payment Terms</p><p>{data.paymentDetails}</p></div>}
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
