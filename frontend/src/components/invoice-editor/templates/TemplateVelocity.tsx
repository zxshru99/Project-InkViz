import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { ItemsTable, TotalsSection, BankDetails } from './TemplateShared';
import { InvoiceWatermark } from '../addons/InvoiceWatermark';
import { InvoiceStamp } from '../addons/InvoiceStamp';
import { InvoiceQRCode } from '../addons/InvoiceQRCode';
import { InvoiceSignature } from '../addons/InvoiceSignature';

export function TemplateVelocity({ data }: { data: InvoiceData }) {
  return (
    <div className="relative bg-white text-gray-900 shadow-xl min-h-[1056px] flex flex-col" style={{ fontFamily: data.font }}>
      <InvoiceWatermark text={data.showWatermark ? data.watermarkStatus : null} />
      
      {/* Sidebar Layout */}
      <div className="flex flex-grow relative z-10">
        {/* Left Sidebar */}
        <div className="w-1/3 p-8 text-white flex flex-col" style={{ backgroundColor: data.themeColor }}>
          <div className="mb-12">
            <h1 className="text-3xl font-black uppercase tracking-tight mb-2 break-words">
              {data.billFrom.name || 'Your Company'}
            </h1>
            <div className="text-sm opacity-80 whitespace-pre-line">{data.billFrom.address}</div>
            <div className="text-sm opacity-80 mt-2">{data.billFrom.email}</div>
          </div>
          
          <div className="mb-12">
            <p className="text-xs uppercase font-bold opacity-60 mb-2">Invoice To</p>
            <p className="font-bold text-lg leading-tight">{data.client.name || 'Client Name'}</p>
            <div className="text-sm opacity-80 whitespace-pre-line mt-2">{data.client.address}</div>
            <div className="text-sm opacity-80 mt-1">{data.client.email}</div>
          </div>
          
          <div className="mt-auto">
            {data.notes && (
              <div className="mb-6">
                <p className="text-xs uppercase font-bold opacity-60 mb-1">Notes</p>
                <p className="text-sm opacity-90 whitespace-pre-line">{data.notes}</p>
              </div>
            )}
            {data.paymentDetails && (
              <div>
                <p className="text-xs uppercase font-bold opacity-60 mb-1">Payment Info</p>
                <p className="text-sm opacity-90 whitespace-pre-line">{data.paymentDetails}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Content */}
        <div className="w-2/3 p-8 flex flex-col">
          <div className="flex justify-between items-end border-b pb-6 mb-8">
            <div>
              <h2 className="text-4xl font-light uppercase tracking-widest text-gray-800">
                {data.documentType}
              </h2>
              <p className="text-xl font-bold mt-1" style={{ color: data.themeColor }}>#{data.invoiceNumber}</p>
            </div>
            <div className="text-right text-sm space-y-1">
              <div><span className="text-gray-500 mr-2">Date:</span><span className="font-semibold">{data.issueDate}</span></div>
              <div><span className="text-gray-500 mr-2">{data.documentType === 'quotation' ? 'Expiry:' : 'Due:'}</span><span className="font-semibold">{data.documentType === 'quotation' ? data.quoteExpiry : data.dueDate}</span></div>
              {data.poNumber && <div><span className="text-gray-500 mr-2">PO:</span><span className="font-semibold">{data.poNumber}</span></div>}
            </div>
          </div>
          
          <div className="flex-grow">
            <ItemsTable data={data} modern={true} />
            
            <div className="flex flex-col justify-between items-start mt-8">
              <div className="w-full self-end">
                <TotalsSection data={data} />
              </div>
              <div className="w-full mt-4 space-y-6">
                <BankDetails data={data} />
                {data.showQRCode && (
                   <div className="inline-block mt-4">
                     <InvoiceQRCode upiId={data.upiId} amount={data.balanceDue} name={data.billFrom.name} />
                   </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-6 items-end mt-12 pt-8 border-t">
             {data.showStamp && <InvoiceStamp />}
             {data.showSignature && (
               <InvoiceSignature font={data.signatureFont} data={data.signatureData} title={data.signatureTitle} />
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
