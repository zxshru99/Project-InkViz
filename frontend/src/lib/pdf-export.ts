"use client"

import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export interface ExportPdfOptions {
  filename?: string
  scale?: number
}

/**
 * Captures an HTML element by ID and exports it as an A4 PDF document.
 * Eliminates blank pages and ignores modals/dialogs by rendering only the targeted DOM node.
 */
export async function exportElementToPdf(
  elementId: string,
  options?: ExportPdfOptions
): Promise<boolean> {
  if (typeof window === "undefined") return false

  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`[pdf-export] Element with ID "${elementId}" not found.`)
    return false
  }

  const filename = options?.filename || "invoice.pdf"
  const scale = options?.scale || 2

  try {
    // Clone element temporarily or capture directly
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200,
    })

    const imgData = canvas.toDataURL("image/png")
    
    // A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const pageWidth = 210
    const pageHeight = 297
    const imgWidth = pageWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
    heightLeft -= pageHeight

    // Add subsequent pages if content overflows A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, "FAST")
      heightLeft -= pageHeight
    }

    pdf.save(filename)
    return true
  } catch (err) {
    console.error("[pdf-export] Failed to generate PDF via html2canvas/jsPDF:", err)
    return false
  }
}
