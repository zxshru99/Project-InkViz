import React from 'react';
import { InvoiceData } from '../InvoiceContext';
import { Separator } from '@/components/ui/separator';

export function ItemsTable({ data, modern }: { data: InvoiceData, modern?: boolean }) {
  return (
    <div className="mt-4 flex-grow z-10 relative">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className={`border-gray-200 ${modern ? 'border-b-2 border-black' : 'border-y-2'}`}>
            <th className={`py-3 w-full ${modern ? 'font-bold uppercase text-xs tracking-wider' : 'font-semibold'}`}>Description</th>
            <th className={`py-3 text-center px-2 ${modern ? 'font-bold uppercase text-xs tracking-wider' : 'font-semibold'}`}>HSN/SAC</th>
            <th className={`py-3 text-center px-2 ${modern ? 'font-bold uppercase text-xs tracking-wider' : 'font-semibold'}`}>Qty</th>
            <th className={`py-3 text-right px-4 ${modern ? 'font-bold uppercase text-xs tracking-wider' : 'font-semibold'}`}>Rate</th>
            <th className={`py-3 text-right ${modern ? 'font-bold uppercase text-xs tracking-wider' : 'font-semibold'}`}>Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.items.map(item => (
            <tr key={item.id}>
              <td className="py-4">
                <div className="font-medium text-gray-900">{item.description || 'Item description'}</div>
              </td>
              <td className="py-4 text-center px-2 text-gray-600">{item.hsnCode || '-'}</td>
              <td className="py-4 text-center px-2 text-gray-600">{item.quantity} {item.unit}</td>
              <td className="py-4 text-right px-4 text-gray-600">{data.currency} {item.rate.toFixed(2)}</td>
              <td className="py-4 font-medium text-right text-gray-900">{data.currency} {item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TotalsSection({ data }: { data: InvoiceData }) {
  const taxable = data.subtotal - data.discountAmount;
  return (
    <div className="flex justify-end mt-8 mb-12 z-10 relative">
      <div className="w-72 text-sm">
        <div className="flex justify-between py-1 text-gray-600">
          <span>Subtotal</span>
          <span>{data.currency} {data.subtotal.toFixed(2)}</span>
        </div>
        {data.discountAmount > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>Discount</span>
            <span className="text-red-600">-{data.currency} {data.discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        {/* Taxes */}
        {data.taxAmount > 0 && data.taxRate > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>Tax ({data.taxRate}%)</span>
            <span>{data.currency} {(taxable * (data.taxRate/100)).toFixed(2)}</span>
          </div>
        )}
        {data.cgstRate > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>CGST ({data.cgstRate}%)</span>
            <span>{data.currency} {(taxable * (data.cgstRate/100)).toFixed(2)}</span>
          </div>
        )}
        {data.sgstRate > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>SGST ({data.sgstRate}%)</span>
            <span>{data.currency} {(taxable * (data.sgstRate/100)).toFixed(2)}</span>
          </div>
        )}
        {data.igstRate > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>IGST ({data.igstRate}%)</span>
            <span>{data.currency} {(taxable * (data.igstRate/100)).toFixed(2)}</span>
          </div>
        )}
        
        {/* Fees */}
        {Number(data.shippingFee) > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>Shipping</span>
            <span>{data.currency} {Number(data.shippingFee).toFixed(2)}</span>
          </div>
        )}
        {Number(data.packagingFee) > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>Packaging</span>
            <span>{data.currency} {Number(data.packagingFee).toFixed(2)}</span>
          </div>
        )}
        {Number(data.handlingFee) > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>Handling</span>
            <span>{data.currency} {Number(data.handlingFee).toFixed(2)}</span>
          </div>
        )}
        
        <Separator className="my-2 bg-gray-200" />
        <div className="flex justify-between py-2 text-base font-bold text-gray-900">
          <span>Total</span>
          <span>{data.currency} {data.total.toFixed(2)}</span>
        </div>
        {Number(data.amountPaid) > 0 && (
          <div className="flex justify-between py-1 text-gray-600">
            <span>Amount Paid</span>
            <span>-{data.currency} {Number(data.amountPaid).toFixed(2)}</span>
          </div>
        )}
        {Number(data.amountPaid) > 0 && (
          <div className="flex justify-between py-2 text-base font-bold text-gray-900" style={{ color: data.themeColor }}>
            <span>Balance Due</span>
            <span>{data.currency} {data.balanceDue.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function BankDetails({ data }: { data: InvoiceData }) {
  if (!data.showBankDetails) return null;
  return (
    <div className="text-sm text-gray-600 z-10 mt-6 bg-gray-50 p-4 rounded-md relative">
      <p className="font-bold text-gray-900 mb-2 uppercase text-xs tracking-wider">Bank Details</p>
      <div className="grid grid-cols-2 gap-2">
        {data.bankName && <div><span className="font-semibold">Bank:</span> {data.bankName}</div>}
        {data.accountHolderName && <div><span className="font-semibold">Account Name:</span> {data.accountHolderName}</div>}
        {data.accountNumber && <div><span className="font-semibold">Account No:</span> {data.accountNumber}</div>}
        {data.ifscCode && <div><span className="font-semibold">IFSC:</span> {data.ifscCode}</div>}
        {data.swiftCode && <div><span className="font-semibold">SWIFT:</span> {data.swiftCode}</div>}
        {data.branch && <div><span className="font-semibold">Branch:</span> {data.branch}</div>}
      </div>
    </div>
  );
}
