import { assertOwnership } from '../../utils/ownershipCheck';
import { Invoice } from '../invoices/invoice.model';
import { Template } from '../templates/template.model';

export const generateInvoicePdf = async (userId: string, invoiceId: string): Promise<Buffer> => {
  const puppeteer = (await import('puppeteer')).default;
  // 1. Fetch invoice and verify ownership
  const invoice = await assertOwnership(Invoice, invoiceId, userId);
  
  // 2. Fetch template
  const template = await Template.findById(invoice.templateId);
  if (!template) {
    throw new Error('Template not found');
  }

  // 3. Compile HTML with global replacement
  let html = template.htmlContent
    .split('{{invoiceNumber}}').join(invoice.invoiceNumber)
    .split('{{clientName}}').join(invoice.clientName)
    .split('{{totalAmount}}').join(invoice.totalAmount.toFixed(2))
    .split('{{subtotal}}').join(invoice.subtotal.toFixed(2))
    .split('{{taxAmount}}').join(invoice.taxAmount.toFixed(2))
    .split('{{discountAmount}}').join(invoice.discountAmount.toFixed(2))
    .split('{{currency}}').join(invoice.currency)
    .split('{{issueDate}}').join(new Date(invoice.issueDate).toLocaleDateString())
    .split('{{dueDate}}').join(new Date(invoice.dueDate).toLocaleDateString())
    .split('{{notes}}').join(invoice.notes || '');
    
  // Inject custom styles if provided
  if (invoice.colorScheme || invoice.font) {
    const customStyles = `
      <style>
        :root {
          ${invoice.colorScheme ? `--primary-color: ${invoice.colorScheme};` : ''}
          ${invoice.font ? `--font-family: ${invoice.font};` : ''}
        }
        body {
          font-family: var(--font-family, sans-serif);
        }
      </style>
    `;
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${customStyles}</head>`);
    } else {
      html = `${customStyles}${html}`;
    }
  }

  return generatePdfFromHtml(html, puppeteer);
};

export const generatePublicInvoicePdf = async (shareToken: string): Promise<Buffer> => {
  const puppeteer = (await import('puppeteer')).default;
  const invoice = await Invoice.findOne({ shareToken, isDeleted: false });
  if (!invoice) throw new Error('Invoice not found or expired');
  
  const template = await Template.findById(invoice.templateId);
  if (!template) throw new Error('Template not found');

  let html = template.htmlContent
    .split('{{invoiceNumber}}').join(invoice.invoiceNumber)
    .split('{{clientName}}').join(invoice.clientName)
    .split('{{totalAmount}}').join(invoice.totalAmount.toFixed(2))
    .split('{{subtotal}}').join(invoice.subtotal.toFixed(2))
    .split('{{taxAmount}}').join(invoice.taxAmount.toFixed(2))
    .split('{{discountAmount}}').join(invoice.discountAmount.toFixed(2))
    .split('{{currency}}').join(invoice.currency)
    .split('{{issueDate}}').join(new Date(invoice.issueDate).toLocaleDateString())
    .split('{{dueDate}}').join(new Date(invoice.dueDate).toLocaleDateString())
    .split('{{notes}}').join(invoice.notes || '');

  if (invoice.colorScheme || invoice.font) {
    const customStyles = `
      <style>
        :root {
          ${invoice.colorScheme ? `--primary-color: ${invoice.colorScheme};` : ''}
          ${invoice.font ? `--font-family: ${invoice.font};` : ''}
        }
        body {
          font-family: var(--font-family, sans-serif);
        }
      </style>
    `;
    if (html.includes('</head>')) {
      html = html.replace('</head>', `${customStyles}</head>`);
    } else {
      html = `${customStyles}${html}`;
    }
  }

  return generatePdfFromHtml(html, puppeteer);
};

const generatePdfFromHtml = async (html: string, puppeteer: any): Promise<Buffer> => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' as any });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
    });
    
    return Buffer.from(pdfBuffer);
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
};
