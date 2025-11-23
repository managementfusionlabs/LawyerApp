import fs from "fs";
import path from "path";
import html_to_pdf from "html-pdf-node";

export const generatePdfAndSave = async (caseId, htmlContent) => {
  const pdfFilePath = path.join("pdfs", `${caseId}.pdf`);

  const file = { content: htmlContent };

  const options = {
    format: "A4",
    margin: {
      top: "20px",
      bottom: "20px",
      left: "20px",
      right: "20px",
    },
  };

  const pdfBuffer = await html_to_pdf.generatePdf(file, options);

  fs.writeFileSync(pdfFilePath, pdfBuffer);

  return pdfFilePath;
};
