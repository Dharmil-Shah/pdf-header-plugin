"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdf_lib_1 = require("pdf-lib");
const fs_1 = require("fs");
const fetch = require("node-fetch");
async function addHeaderToPdf(pdfUrl, headerText, outputFileName) {
    const res = await fetch(pdfUrl);
    if (!res.ok) {
        throw new Error(`Failed to fetch PDF. Status: ${res.status}`);
    }
    const pdfBytes = await res.buffer();
    const pdfDoc = await pdf_lib_1.PDFDocument.load(pdfBytes);
    const font = await pdfDoc.embedFont(pdf_lib_1.StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
        page.drawText(headerText, {
            x: 50,
            y: page.getHeight() - 50,
            size: 14,
            font,
            color: (0, pdf_lib_1.rgb)(0, 0, 0),
        });
    }
    const modifiedBytes = await pdfDoc.save();
    (0, fs_1.writeFileSync)(outputFileName, Buffer.from(modifiedBytes));
    console.log(`✅ PDF with header created: ${outputFileName}`);
}
// Use a working PDF URL
const pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
const headerText = "Confidential - My Company";
const outputFileName = "output.pdf";
addHeaderToPdf(pdfUrl, headerText, outputFileName);
