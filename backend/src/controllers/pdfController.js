import Case from "../models/Case.js";
import Draft from "../models/Draft.js";
import { generatePdfAndSave } from "../utils/pdf.js";

export const createPdf = async (req, res) => {
  try {
    const { caseId } = req.params;

    const caseData = await Case.findById(caseId);
    if (!caseData) return res.status(404).json({ error: "Case not found" });

    const draft = await Draft.findOne({ caseId }).sort({ createdAt: -1 });
    if (!draft)
      return res.status(404).json({ error: "AI draft not found. Generate draft first." });

    // HTML TEMPLATE
const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      /* --- PRINT SETTINGS --- */
      @page {
        size: A4;
        margin: 1.5in 1in 1in 1.25in; /* Top, Right, Bottom, Left (Left is larger for binding) */
      }

      body {
        font-family: "Times New Roman", Times, serif;
        font-size: 12pt; /* Standard Court Font Size */
        line-height: 1.6; /* Double or 1.5 spacing is standard for readability */
        color: #000;
        background: #fff;
        margin: 0;
        padding: 0;
      }

      /* --- LAYOUT CONTAINERS --- */
      .page-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px; /* Padding for web view */
        background: #fff;
      }

      /* --- HEADER / COURT NAME --- */
      .court-header {
        text-align: center;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 14pt;
        margin-bottom: 5px;
        text-decoration: underline;
      }

      .jurisdiction {
        text-align: center;
        font-weight: bold;
        font-size: 12pt;
        margin-bottom: 20px;
      }

      .case-number {
        text-align: center;
        font-weight: bold;
        margin-bottom: 30px;
      }

      /* --- CAUSE TITLE (Parties) --- */
      .cause-title {
        width: 100%;
        margin-bottom: 30px;
      }

      .party-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }

      .party-name {
        font-weight: bold;
        text-transform: uppercase;
        width: 70%;
      }

      .party-role {
        font-weight: bold;
        font-style: italic;
        text-align: right;
        width: 25%;
      }

      .versus {
        text-align: center;
        font-weight: bold;
        margin: 15px 0;
        letter-spacing: 2px;
      }

      /* --- SUBJECT / TITLE --- */
      .draft-subject {
        text-align: center;
        font-weight: bold;
        text-transform: uppercase;
        text-decoration: underline;
        margin: 30px 0 20px 0;
        font-size: 13pt;
      }

      /* --- MAIN CONTENT --- */
      .content-body {
        text-align: justify;
        text-justify: inter-word;
        white-space: pre-wrap; /* Preserves tabs and newlines */
      }

      /* --- FOOTER / SIGNATURE --- */
      .signature-section {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
      }

      .place-date {
        text-align: left;
      }

      .advocate-sign {
        text-align: right;
        font-weight: bold;
      }

      .footer-note {
        margin-top: 50px;
        font-size: 10pt;
        text-align: center;
        color: #444;
        border-top: 1px solid #ddd;
        padding-top: 5px;
      }
      
      /* Hide elements during print if needed */
      @media print {
        body { background: none; }
        .page-container { padding: 0; margin: 0; }
      }
    </style>
  </head>

  <body>
    <div class="page-container">

      <div class="court-header">
        IN THE COURT OF ${caseData.courtName?.toUpperCase() || "THE HON'BLE COURT"}
      </div>
      <div class="jurisdiction">
        AT JAMMU & KASHMIR
      </div>

      <div class="case-number">
        CASE NO. ${caseData.caseNumber} OF ${new Date().getFullYear()}
      </div>

      <div class="cause-title">
        <div class="party-row">
          <div class="party-name">
            ${caseData.clientName}<br>
            <span style="font-size: 10pt; font-weight: normal; text-transform: none;">
              R/o: ${caseData.address}
            </span>
          </div>
          <div class="party-role">... PETITIONER / PLAINTIFF</div>
        </div>

        <div class="versus">VERSUS</div>

        <div class="party-row">
          <div class="party-name">
            ${caseData.opponentName}<br>
            <span style="font-size: 10pt; font-weight: normal; text-transform: none;">
              R/o: ${caseData.opponentAddress}
            </span>
          </div>
          <div class="party-role">... RESPONDENT / DEFENDANT</div>
        </div>
      </div>

      <div class="draft-subject">
        IN THE MATTER OF: <br>
        ${caseData.caseType || "LEGAL DRAFT"}
      </div>

      <div class="content-body">
        <p><strong>MAY IT PLEASE THE HON'BLE COURT,</strong></p>
        
        ${draft.content.replace(/\n/g, "<br/>")}
      </div>

      <div class="signature-section">
        <div class="place-date">
          <strong>Place:</strong> Jammu/Srinagar<br>
          <strong>Date:</strong> ${caseData.filingDate || new Date().toLocaleDateString()}
        </div>

        <div class="advocate-sign">
          _______________________<br>
          <strong>ADVOCATE FOR PETITIONER</strong><br>
          (Through Counsel)
        </div>
      </div>

      <div class="footer-note">
        <em>Generated via LegalJK Case Management System</em>
      </div>

    </div>
  </body>
</html>
`;


    const filepath = await generatePdfAndSave(caseId, html);

   return res.download(filepath, "case-draft.pdf");
  } catch (err) {
    console.error("PDF Generation Error:", err);
    return res.status(500).json({ error: "Failed to generate PDF" });
  }
};
