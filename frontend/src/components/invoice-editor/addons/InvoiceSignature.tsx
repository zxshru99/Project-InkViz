import React from 'react';

export function InvoiceSignature({ font, data, title }: { font: string, data: string, title: string }) {
  const fontClass = {
    'dancing': 'font-dancing-script',
    'greatvibes': 'font-great-vibes',
    'sacramento': 'font-sacramento',
    'pacifico': 'font-pacifico'
  }[font] || 'font-sans italic';

  return (
    <div className="flex flex-col items-end text-right z-10">
      {data ? (
        <img src={data} alt="Signature" className="h-16 object-contain mb-2" />
      ) : (
        <div className={`text-4xl text-blue-900 mb-2 ${fontClass}`}>
          Authorized Signatory
        </div>
      )}
      <div className="border-t border-gray-400 w-48 pt-1 text-sm text-gray-600">
        {title || 'Authorized Signatory'}
      </div>
    </div>
  );
}
