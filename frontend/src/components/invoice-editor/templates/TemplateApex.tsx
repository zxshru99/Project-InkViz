import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { ItemsTable, TotalsSection, BankDetails } from './TemplateShared';
import { InvoiceWatermark } from '../addons/InvoiceWatermark';
import { InvoiceStamp } from '../addons/InvoiceStamp';
import { InvoiceQRCode } from '../addons/InvoiceQRCode';
import { InvoiceSignature } from '../addons/InvoiceSignature';

export function TemplateApex({ data }: { data: InvoiceData }) {
  return (
    <div className="relative p-10 bg-white text-gray-900 shadow-xl rounded-lg min-h-[1056px] flex flex-col" style={{ fontFamily: data.font }}>
      <InvoiceWatermark text={data.showWatermark ? data.watermarkStatus : null} />
      
      {/* Header */}
      <div className="flex justify-between items-start border-b-4 pb-6 relative z-10" style={{ borderColor: data.themeColor }}>
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: data.themeColor }}>
            {data.documentType}
          </h1>
          <p className="text-lg font-bold text-gray-500 mt-1">#{data.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">{data.billFrom.name || 'Your Company'}</h2>
          <div className="text-gray-500 whitespace-pre-line text-sm mt-1">{data.billFrom.address}</div>
          <div className="text-gray-500 text-sm">{data.billFrom.email}</div>
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-6 mt-8 relative z-10">
        <div className="bg-gray-50 p-4 rounded-md border-l-4" style={{ borderColor: data.themeColor }}>
          <p className="text-xs uppercase font-bold text-gray-400 mb-1">Billed To</p>
          <p className="font-bold text-lg">{data.client.name || 'Client Name'}</p>
          <div className="text-sm text-gray-600 whitespace-pre-line mt-1">{data.client.address}</div>
          <div className="text-sm text-gray-600">{data.client.email}</div>
        </div>
        
        <div className="col-span-2 flex justify-end gap-8">
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Issue Date</p>
            <p className="font-semibold">{data.issueDate}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">
              {data.documentType === 'quotation' ? 'Expiry Date' : 'Due Date'}
            </p>
            <p className="font-semibold">{data.documentType === 'quotation' ? data.quoteExpiry : data.dueDate}</p>
          </div>
          {data.poNumber && (
            <div className="text-right">
              <p className="text-xs uppercase font-bold text-gray-400 mb-1">PO Number</p>
              <p className="font-semibold">{data.poNumber}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items & Totals */}
      <div className="mt-8 flex-grow relative z-10">
        <ItemsTable data={data} modern={true} />
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

      {/* Footer */}
      <div className="mt-12 grid grid-cols-2 gap-8 relative z-10">
        <div className="text-sm text-gray-600">
          {data.notes && (
            <div className="mb-4">
              <p className="font-bold uppercase text-xs tracking-wider mb-1">Notes</p>
              <p className="whitespace-pre-line">{data.notes}</p>
            </div>
          )}
          {data.paymentDetails && (
            <div>
              <p className="font-bold uppercase text-xs tracking-wider mb-1">Payment Instructions</p>
              <p className="whitespace-pre-line">{data.paymentDetails}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end items-end gap-8">
           {data.showStamp && <InvoiceStamp />}
           {data.showSignature && (
             <InvoiceSignature font={data.signatureFont} data={data.signatureData} title={data.signatureTitle} />
           )}
        </div>
      </div>
      
      <div className="h-4 absolute bottom-0 left-0 right-0 rounded-b-lg" style={{ backgroundColor: data.themeColor }}></div>
    </div>
  );
}
