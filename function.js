import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default {
  async execute(inputs) {
    const url = inputs.pdf_url;
    const headerText = inputs.header_text;
    const fontSize = inputs.font_size || 12;
    const fontColor = inputs.font_color || '#000000';
    const headerPosition = inputs.header_position || 'top';

    try {
      const response = await fetch(url);
      const pdfBytes = await response.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const pages = pdfDoc.getPages();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const [r, g, b] = hexToRgb(fontColor);

      pages.forEach(page => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(headerText, fontSize);
        const x = (width - textWidth) / 2;
        const y = headerPosition === 'top' ? height - fontSize - 20 : 20;
        page.drawText(headerText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(r / 255, g / 255, b / 255),
        });
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBase64 = Buffer.from(modifiedPdfBytes).toString('base64');
      const dataUrl = `data:application/pdf;base64,${modifiedPdfBase64}`;

      return {
        pdf_with_header_url: dataUrl
      };

    } catch (error) {
      console.error(error);
      return { pdf_with_header_url: "" };
    }
  }
}

function hexToRgb(hex) {
  const match = hex.replace('#', '').match(/.{1,2}/g);
  if (!match || match.length !== 3) return [0, 0, 0];
  return match.map(x => parseInt(x, 16));
}
