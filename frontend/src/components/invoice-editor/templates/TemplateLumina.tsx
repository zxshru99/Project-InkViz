import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { ItemsTable, TotalsSection, BankDetails } from './TemplateShared';
import { InvoiceWatermark } from '../addons/InvoiceWatermark';
import { InvoiceStamp } from '../addons/InvoiceStamp';
import { InvoiceQRCode } from '../addons/InvoiceQRCode';
import { InvoiceSignature } from '../addons/InvoiceSignature';

export function TemplateLumina({ data }: { data: InvoiceData }) {
  return (
    <div className="relative p-12 bg-white text-gray-800 shadow-xl rounded-lg min-h-[1056px] flex flex-col" style={{ fontFamily: data.font }}>
      <InvoiceWatermark text={data.showWatermark ? data.watermarkStatus : null} />
      
      <div className="absolute top-0 left-0 right-0 h-32 opacity-10" style={{ backgroundColor: data.themeColor }}></div>
      
      <div className="relative z-10 flex justify-between items-end mb-12">
        <div className="w-1/2">
           <h2 className="text-3xl font-bold mb-2">{data.billFrom.name || 'Your Company'}</h2>
           <div className="text-sm opacity-80 whitespace-pre-line">{data.billFrom.address}</div>
           <div className="text-sm opacity-80">{data.billFrom.email}</div>
        </div>
        <div className="text-right">
          <h1 className="text-4xl font-light tracking-widest uppercase mb-2" style={{ color: data.themeColor }}>
            {data.documentType}
          </h1>
          <p className="text-xl">#{data.invoiceNumber}</p>
        </div>
      </div>

      <div className="relative z-10 flex justify-between bg-gray-50 p-6 rounded-2xl mb-8">
        <div>
          <p className="text-xs uppercase text-gray-500 mb-1">To</p>
          <p className="font-bold text-lg">{data.client.name || 'Client Name'}</p>
          <p className="text-sm whitespace-pre-line">{data.client.address}</p>
          <p className="text-sm">{data.client.email}</p>
        </div>
        <div className="text-right space-y-2">
          <div>
            <span className="text-gray-500 text-sm mr-4">Date</span>
            <span className="font-semibold">{data.issueDate}</span>
          </div>
          <div>
            <span className="text-gray-500 text-sm mr-4">{data.documentType === 'quotation' ? 'Expiry' : 'Due'}</span>
            <span className="font-semibold">{data.documentType === 'quotation' ? data.quoteExpiry : data.dueDate}</span>
          </div>
          {data.poNumber && (
            <div>
              <span className="text-gray-500 text-sm mr-4">PO No.</span>
              <span className="font-semibold">{data.poNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-grow">
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

      <div className="relative z-10 mt-12 pt-8 border-t border-gray-200 flex justify-between items-end">
        <div className="w-1/2 text-sm text-gray-600">
           {data.notes && <div className="mb-4"><p className="font-bold">Notes</p><p>{data.notes}</p></div>}
           {data.paymentDetails && <div><p className="font-bold">Payment Details</p><p>{data.paymentDetails}</p></div>}
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
