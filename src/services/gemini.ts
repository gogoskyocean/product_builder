const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import type { Language } from '../types';

export const analyzeMood = async (text: string, language: Language) => {
  if (!API_KEY) {
    console.error("API Key is missing!");
    throw new Error("API Key is missing");
  }

  // 1. Auto-discover a working model
  let modelName = 'gemini-1.5-flash'; // Default fallback

  try {
    console.log("Auto-discovering available models...");
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    const listResponse = await fetch(listUrl);
    const listData = await listResponse.json();

    console.log("Raw Model List:", listData);

    if (listData.models) {
      // Find the best fit model: must support generateContent
      // Priority: gemini-1.5-flash -> gemini-pro -> any gemini
      const viableModels = listData.models.filter((m: any) =>
        m.supportedGenerationMethods?.includes('generateContent')
      );

      const bestModel = viableModels.find((m: any) => m.name.includes('gemini-1.5-flash')) ||
        viableModels.find((m: any) => m.name.includes('gemini-pro') && !m.name.includes('latest')) ||
        viableModels[0];

      if (bestModel) {
        // name format is usually "models/model-name"
        modelName = bestModel.name.replace('models/', '');
        console.log(`✅ Auto-selected valid model: ${modelName}`);
      } else {
        console.warn("⚠️ No suitable model found in list, using default.");
      }
    } else if (listData.error) {
      console.error("❌ Error listing models:", listData.error);
      throw new Error(`ListModels Failed: ${listData.error.message}`);
    }
  } catch (e) {
    console.error("⚠️ Model discovery failed, trying default:", e);
  }

  // 2. Send Request using the discovered model
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

  const langMap: Record<string, string> = {
    'en': 'English',
    'kr': 'Korean',
    'es': 'Spanish',
    'cn': 'Chinese (Simplified)',
    'jp': 'Japanese',
    'fr': 'French'
  };

  const targetLang = langMap[language] || 'English';

  const promptText = `
    Analyze this mood: "${text}"
    Target Language: ${targetLang}

    Return ONLY a raw JSON object (no markdown) with this structure:
    {
      "moodSummary": "One sentence summary of their mood in ${targetLang}.",
      "music": { "title": "Song Title", "artist": "Artist Name" },
      "articles": [{ "title": "Title", "url": "URL" }],
      "items": [{ "name": "Item", "link": "URL" }],
      "olympics": { "sport": "Winter Olympic Sport ONLY", "reason": "Reason", "highlightUrl": "URL" }
    }
  `;

  const requestBody = {
    contents: [{
      parts: [{ text: promptText }]
    }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    }
  };

  try {
    console.log(`Sending request to ${modelName}...`);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("REST API Error Response:", errorData);
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("No content generated");
    }

    console.log("Gemini Raw Output:", generatedText); // Debugging

    // Clean up markdown code blocks if present
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Find the first '{' and last '}' to extract the JSON object
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = generatedText.substring(jsonStart, jsonEnd + 1);
      return JSON.parse(jsonString);
    }

    throw new Error("Invalid format: No JSON object found");

  } catch (error) {
    console.error("Global Error:", error);
    throw error;
  }
};
