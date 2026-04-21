import fs from 'fs';
import path from 'path';

class SttProvider {
  /**
   * Direct REST Call to Sarvam STT Translate
   * Optimized for Mixed Languages (Telugu/Hindi + English)
   */
  async transcribe(audioPath, options = {}) {
    const { retries = 3 } = options;
    const SARVAM_API_KEY = process.env.SARVAM_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    // phase 1: Primary - Sarvam AI (REST)
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`[STT] Attempting Sarvam REST (Attempt ${i + 1})...`);
        
        // Use standard Multipart/FormData for reliability
        const formData = new FormData();
        const fileBuffer = fs.readFileSync(audioPath);
        const fileName = path.basename(audioPath);
        
        // Create Blob from buffer to use with FormData
        const audioBlob = new Blob([fileBuffer], { type: 'audio/webm' });
        formData.append('file', audioBlob, fileName);
        formData.append('model', 'saaras:v3');
        formData.append('mode', 'translate'); // Translate mixed output to Clinical English

        const response = await fetch('https://api.sarvam.ai/speech-to-text-translate', {
          method: 'POST',
          headers: {
            'api-subscription-key': SARVAM_API_KEY
          },
          body: formData
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.transcript && data.transcript.trim().length > 2) {
            console.log(`[STT] Sarvam REST Success: "${data.transcript.substring(0, 100)}..."`);
            return {
              transcript: data.transcript,
              confidence: data.confidence || 0.8,
              provider: 'sarvam'
            };
          }
        } else {
          const errText = await response.text();
          console.warn(`[STT] Sarvam REST Error: ${response.status} - ${errText}`);
        }
      } catch (err) {
        console.warn(`[STT] Sarvam REST Attempt ${i+1} failed:`, err.message);
      }
      
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, 1500 * (i + 1)));
      }
    }

    // Phase 2: Experimental - User Model
    console.log("[STT] Attempting experimental model: gemini-2.5-flash-native-audio-latest...");
    try {
      const audioData = fs.readFileSync(audioPath);
      const result = await this._callWithVersionFallback("gemini-2.5-flash-native-audio-latest", audioData, GEMINI_API_KEY);
      if (result) return result;
    } catch (err) {
      console.warn(`[STT] Experimental model failed: ${err.message}`);
    }

    // Phase 3: High-Reliability Fallback - Gemini REST (2.0/1.5)
    console.log("[STT] Falling back to standard Gemini models...");
    const fallbacks = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-flash-latest"];
    
    for (const modelId of fallbacks) {
      try {
        console.log(`[STT] Attempting fallback: ${modelId}...`);
        const audioData = fs.readFileSync(audioPath);
        const result = await this._callWithVersionFallback(modelId, audioData, GEMINI_API_KEY);
        if (result) return result;
      } catch (err) {
        console.warn(`[STT] Fallback ${modelId} failed: ${err.message}`);
      }
    }

    // Final Failure Message
    return {
      transcript: "Recording captured but transcription failed. Please check your microphone or speak clearly.",
      is_unclear: true,
      provider: 'none'
    };
  }

  async _callWithVersionFallback(modelId, audioData, apiKey) {
    // Try v1beta first
    let result = await this._callGeminiREST(modelId, audioData, apiKey, "v1beta");
    
    // If 404, try v1
    if (!result) {
      console.log(`[STT] 404 on v1beta for ${modelId}. Trying v1...`);
      result = await this._callGeminiREST(modelId, audioData, apiKey, "v1");
    }
    
    return result;
  }

  async _callGeminiREST(modelId, audioData, apiKey, apiVersion) {
    const payload = {
      contents: [{
        parts: [
          { text: "Task: Transcribe this clinical audio recording exactly into English. If it is in Telugu or Hindi mixed with English, translate the regional parts to English while keeping medical terminology. If silent, return '[EMPTY]'." },
          {
            inlineData: {
              data: audioData.toString('base64'),
              mimeType: "audio/webm"
            }
          }
        ]
      }],
      generation_config: { temperature: 0.1 }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/${apiVersion}/models/${modelId}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (response.ok) {
      const data = await response.json();
      const transcript = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

      if (transcript && !transcript.includes("[EMPTY]")) {
        console.log(`[STT] Gemini ${modelId} (${apiVersion}) Success: "${transcript.substring(0, 100)}..."`);
        return {
          transcript,
          confidence: 0.7,
          provider: 'gemini'
        };
      }
    }
    return null;
  }
}

export default new SttProvider();
