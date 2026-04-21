
import dotenv from "dotenv";
dotenv.config();

class LlmProvider {
  async processTranscript(transcript, patientName) {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // As per user request: Keeping strictly in the 2.5 family.
    // We use the full model identifiers discovered in the user's environment.
    const models = [
      "gemini-2.5-flash-native-audio-latest",
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash"
    ];

    const maxRetriesPerModel = 2;
    let lastErrorMessage = "No models responded successfully";

    for (const modelId of models) {
      for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
        try {
          console.log(`[LLM] Attempting ${modelId} (Attempt ${attempt + 1})...`);
          let response = await this._fetchWithRetry(modelId, GEMINI_API_KEY, transcript, patientName, "v1beta");
          
          if (!response.ok && response.status === 404) {
            console.warn(`[LLM] 404 on v1beta for ${modelId}. Trying v1...`);
            response = await this._fetchWithRetry(modelId, GEMINI_API_KEY, transcript, patientName, "v1");
          }

          if (!response.ok) {
            let errorMsg = response.statusText;
            try {
              const errorData = await response.json();
              errorMsg = errorData.error?.message || errorMsg;
            } catch (e) {
              // Not a JSON error
            }

            const status = response.status;
            console.warn(`[LLM] ${modelId} failed with ${status}: ${errorMsg}`);
            lastErrorMessage = `${modelId} returned ${status}: ${errorMsg}`;

            if (status === 429 || status === 503) {
              await new Promise(resolve => setTimeout(resolve, 1500 * (attempt + 1)));
              continue;
            }
            // For other errors, move to next model immediately
            break;
          }

          const data = await response.json();
          if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Empty response from AI model candidates");
          }

          const responseText = data.candidates[0].content.parts[0].text;

          let jsonString = responseText.trim();
          const firstBrace = jsonString.indexOf('{');
          const lastBrace = jsonString.lastIndexOf('}');
          if (firstBrace !== -1 && lastBrace !== -1) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
          }

          const structuredData = JSON.parse(jsonString);
          console.log(`[LLM] Success using ${modelId}`);
          return {
            ...structuredData,
            _rawResponse: responseText
          };

        } catch (err) {
          console.warn(`[LLM] ${modelId} Exception:`, err.message);
          lastErrorMessage = err.message;
          break;
        }
      }
    }

    throw new Error(`Critical LLM Failure: ${lastErrorMessage}`);
  }

  async _fetchWithRetry(modelId, apiKey, transcript, patientName, apiVersion) {
    return fetch(
      `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `
                Role: Expert Medical Scribe
                Context: Extract clinical data for patient "${patientName || 'Unknown'}".
                
                STRICT EXTRACTION RULES:
                1. FULL NARRATIVE: Provide a comprehensive, verbatim-style summary of the "whole matter" discussed. Include specific doctor's words and instructions as a story-like narrative.
                2. MEDICINES: 
                   - Only include medications explicitly mentioned. 
                   - If a medicine is mentioned without a dose, set strength to "Dose not specified".
                   - If NO medicines are mentioned, leave the "medicines" array EMPTY: []. Never return an object with empty fields.
                3. COMPLETENESS: If a section is truly missing, use "Not explicitly mentioned in consultation".
                4. FORMAT: JSON ONLY.

                 JSON SCHEMA:
                 {
                   "full_narrative": "Detailed narrative summary of the entire session and the doctor's words.",
                   "summary": "High-level summary for the dashboard",
                   "problem": "Patient's primary complaints",
                   "diagnosis": "Diagnostic assessment or clinical findings",
                   "prescription": "Brief textual description of the treatment plan",
                   "medicines": [
                     {
                       "name": "Full medicine name",
                       "strength": "e.g., 500mg or 5ml",
                       "timing": { "morning": true/false, "afternoon": true/false, "night": true/false },
                       "instructions": "e.g., After food, empty stomach"
                     }
                   ],
                   "advice": "Specific lifestyle or clinical advice given by doctor",
                   "follow_up": "Next appointment timing"
                 }

                TRANSCRIPT:
                ${transcript}
              `
            }]
          }],
          generation_config: {
            response_mime_type: "application/json",
            temperature: 0.1
          }
        })
      }
    );
  }
}

export default new LlmProvider();
