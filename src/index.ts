import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFileSync } from "fs";
import fetch = require("node-fetch");

async function addHeaderToPdf(pdfUrl: string, headerText: string, outputFileName: string) {
    const res = await fetch(pdfUrl);
    if (!res.ok) {
        throw new Error(`Failed to fetch PDF. Status: ${res.status}`);
    }
    const pdfBytes = await res.buffer();

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    for (const page of pages) {
        page.drawText(headerText, {
            x: 50,
            y: page.getHeight() - 50,
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });
    }

    const modifiedBytes = await pdfDoc.save();
    writeFileSync(outputFileName, Buffer.from(modifiedBytes));
    console.log(`✅ PDF with header created: ${outputFileName}`);
}

// Use a working PDF URL
const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const headerText = "Confidential - My Company";
const outputFileName = "output.pdf";

addHeaderToPdf(pdfUrl, headerText, outputFileName);
