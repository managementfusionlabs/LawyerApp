import OpenAI from "openai";



export const generateDraftFromCase = async (caseData) => {
    const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
 const prompt = `
You are a professional legal drafting assistant specializing in 
the Union Territory of Jammu & Kashmir (UT of J&K).

Draft the document strictly according to:
- Jammu & Kashmir Reorganization Act, 2019  
- J&K Civil Courts Act  
- J&K Criminal Procedure Code (where applicable)  
- Local J&K court hierarchy and conventions  
- Language, tone, and structure used by J&K lawyers  

The draft must be suitable for submission before the appropriate 
court within J&K.

=====================
CASE INFORMATION:
=====================

Client Name: ${caseData.clientName}
Phone: ${caseData.phone}
Email: ${caseData.email}
Address: ${caseData.address}

Case Type: ${caseData.caseType}
Case Number: ${caseData.caseNumber}
Court Name: ${caseData.courtName}
Filing Date: ${caseData.filingDate}

Opposing Party:
Name: ${caseData.opponentName}
Address: ${caseData.opponentAddress}

Description of Case:
${caseData.description}

=====================
INSTRUCTIONS:
=====================

1. Identify the correct court level based on caseType:
   - High Court of Jammu & Kashmir and Ladakh
   - District & Sessions Court
   - Sub Judge Court / CJM
   - Munsiff Court

2. Use correct terms commonly used in J&K:
   • "In the Hon’ble Court of…"  
   • "Union Territory of Jammu & Kashmir"  
   • "Most Respectfully Showeth:"  
   • "That the applicant/petitioner..."  
   • "That the respondent/defendant..."  

3. Follow the standard J&K petition structure:
   - Cause Title  
   - Index  
   - List of Dates and Events  
   - Synopsis (optional)  
   - Body of Petition (numbered paragraphs)  
   - Prayer Clause  
   - Verification  
   - Place & Date  

4. Maintain local legal formatting conventions:
   - Number arguments as: “1. That…” “2. That…”  
   - Use formal legal English commonly used in J&K courts.  
   - Maintain respectful tone.  

5. The final output must be a clean, ready-to-file legal draft 
   specific to the court mentioned in the case data.

Generate the complete draft now.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
};
