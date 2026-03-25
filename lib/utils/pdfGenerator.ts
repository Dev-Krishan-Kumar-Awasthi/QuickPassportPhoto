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
export async function generatePDF({ 
  imageData, 
  backgroundColor, 
  count,
  paperSize = [152.4, 101.6], // Default 4x6 landscape
  photoSize = [35, 45],       // Default Indian Passport
  dpi = 300
}: { 
  imageData: string, 
  backgroundColor: string, 
  count: number,
  paperSize?: [number, number],
  photoSize?: [number, number],
  dpi?: number
}): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    // @ts-ignore
    const { jsPDF } = await import('jspdf/dist/jspdf.es.min.js') as any;
    
    const doc = new jsPDF({ 
      orientation: paperSize[0] > paperSize[1] ? 'landscape' : 'portrait', 
      unit: 'mm', 
      format: paperSize 
    });

    // If it's a grid image (legacy), we just draw it to fill.
    // But if we want precision, we should ideally arrange photos here.
    // For now, to keep it simple and compatible with the current 'grid' approach:
    doc.addImage(imageData, 'JPEG', 0, 0, paperSize[0], paperSize[1]);
    doc.save(`passport-photo-${photoSize[0]}x${photoSize[1]}mm.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
