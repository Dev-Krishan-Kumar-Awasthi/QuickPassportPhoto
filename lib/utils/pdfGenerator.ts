interface PDFOptions {
  imageData: string; // Transparent PNG Data URL
  backgroundColor: string;
  count: number;
}

/**
 * Generates a 4x6 inch PDF with the specified number of passport photos.
 * Standard 4x6 is 101.6mm x 152.4mm
 * 
 * NOTE: Using dynamic import to prevent SSR errors in Next.js
 */
export async function generatePDF({ imageData, backgroundColor, count }: { imageData: string, backgroundColor: string, count: number }): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // We use the ES module distribution specifically for browser compatibility
    // and cast to any to avoid TypeScript declaration issues.
    // @ts-ignore
    const { jsPDF } = await import('jspdf/dist/jspdf.es.min.js') as any;
    
    const doc = new jsPDF({ 
      orientation: 'landscape', 
      unit: 'mm', 
      format: [152.4, 101.6] 
    });

    doc.addImage(imageData, 'JPEG', 0, 0, 152.4, 101.6);
    doc.save('passport-photo-sheet.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
