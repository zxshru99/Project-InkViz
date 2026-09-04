import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { ItemsTable, TotalsSection, BankDetails } from './TemplateShared';
import { InvoiceWatermark } from '../addons/InvoiceWatermark';
import { InvoiceStamp } from '../addons/InvoiceStamp';
import { InvoiceQRCode } from '../addons/InvoiceQRCode';
import { InvoiceSignature } from '../addons/InvoiceSignature';

export function TemplatePrism({ data }: { data: InvoiceData }) {
  return (
    <div className="relative p-0 bg-white text-gray-800 shadow-xl overflow-hidden min-h-[1056px] flex flex-col" style={{ fontFamily: data.font }}>
      <InvoiceWatermark text={data.showWatermark ? data.watermarkStatus : null} />
      
      {/* Decorative colored header */}
      <div className="h-32 px-10 pt-10 flex justify-between items-start" style={{ backgroundColor: data.themeColor, color: '#fff' }}>
        <h1 className="text-4xl font-bold uppercase tracking-wider">{data.documentType}</h1>
        <div className="text-right">
          <h2 className="text-xl font-bold">{data.billFrom.name || 'Your Company'}</h2>
        </div>
      </div>
      
      <div className="px-10 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 flex justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Invoice To</p>
            <p className="font-bold text-lg">{data.client.name || 'Client Name'}</p>
            <p className="text-sm text-gray-600 whitespace-pre-line mt-1">{data.client.address}</p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold text-gray-400 mb-1">Details</p>
            <p className="font-bold text-lg">#{data.invoiceNumber}</p>
            <p className="text-sm mt-1"><span className="text-gray-500 mr-2">Date:</span>{data.issueDate}</p>
            <p className="text-sm"><span className="text-gray-500 mr-2">{data.documentType === 'quotation' ? 'Expiry:' : 'Due:'}</span>{data.documentType === 'quotation' ? data.quoteExpiry : data.dueDate}</p>
          </div>
        </div>
      </div>

      <div className="px-10 mt-8 flex-grow relative z-10">
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

      <div className="px-10 mb-10 mt-auto relative z-10">
        <div className="bg-gray-50 rounded-lg p-6 flex justify-between items-end border-l-4" style={{ borderColor: data.themeColor }}>
          <div className="w-1/2 text-sm text-gray-600">
             {data.notes && <div className="mb-4"><p className="font-bold text-gray-800">Notes</p><p>{data.notes}</p></div>}
             {data.paymentDetails && <div><p className="font-bold text-gray-800">Payment Instructions</p><p>{data.paymentDetails}</p></div>}
          </div>
          <div className="flex gap-6 items-end">
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
