interface PDFOptions {
  imageData: string; // Transparent PNG Data URL
  backgroundColor: string;
  count: number;
}

import { jsPDF } from 'jspdf';

/**
 * Generates a 4x6 inch PDF with the specified number of passport photos.
 * Standard 4x6 is 101.6mm x 152.4mm
 */
// v2: Standard Import Fix
export async function generatePDF({ imageData, backgroundColor, count }: { imageData: string, backgroundColor: string, count: number }): Promise<void> {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [152.4, 101.6] });
  doc.addImage(imageData, 'JPEG', 0, 0, 152.4, 101.6);
  doc.save('passport-photo-sheet.pdf');
}
