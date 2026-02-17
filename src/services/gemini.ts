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
      "music": { "title": "Song Title", "artist": "Artist Name", "youtubeUrl": "YouTube embed URL (format: https://www.youtube.com/embed/...)" },
      "articles": [{ "title": "Title", "url": "URL" }],
      "items": [{ "name": "Item", "link": "URL" }],
      "olympics": { "sport": "Winter Olympic Sport ONLY", "reason": "Reason related to 2026 Winter Olympics", "highlightUrl": "A YouTube link to Olympic highlights" }
    }
  `;

  const requestBody = {
    contents: [{
      parts: [{ text: promptText }]
    }],
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 2048,
    },
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ]
  };

  const getFallbackResult = (lang: Language): any => {
    const fallbacks: Record<string, any> = {
      en: {
        moodSummary: "Your heart is expressing a complex and intense energy right now.",
        music: { title: "Spiritual Journey", artist: "Meditation Music", youtubeUrl: "https://www.youtube.com/embed/S2pETo0zY-U" },
        articles: [{ title: "Finding Balance in Intense Emotions", url: "https://www.psychologytoday.com" }],
        items: [{ name: "Calming Incense", link: "https://www.amazon.com" }],
        olympics: { sport: "Curling", reason: "Focus and precision to calm the storm.", highlightUrl: "https://www.youtube.com/user/olympic" }
      },
      kr: {
        moodSummary: "지금 당신의 마음은 매우 강렬하고 복잡한 에너지를 표현하고 있군요.",
        music: { title: "영적 여행", artist: "명상 음악", youtubeUrl: "https://www.youtube.com/embed/S2pETo0zY-U" },
        articles: [{ title: "강렬한 감정 속에서 균형 찾기", url: "https://www.mentalhealth.or.kr" }],
        items: [{ name: "심신 안정 향초", link: "https://www.coupang.com" }],
        olympics: { sport: "컬링", reason: "폭풍을 잠재우는 집중력과 정교함이 필요한 때입니다.", highlightUrl: "https://www.youtube.com/user/olympic" }
      }
    };
    return fallbacks[lang] || fallbacks.en;
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
      return getFallbackResult(language);
    }

    const data = await response.json();
    let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      console.warn("No content generated or blocked by safety filters. Using fallback.");
      return getFallbackResult(language);
    }

    console.log("Gemini Raw Output:", generatedText);

    // Clean up markdown code blocks if present
    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();

    // Find the first '{' and last '}' to extract the JSON object
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = generatedText.substring(jsonStart, jsonEnd + 1);
      try {
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error("JSON Parse Error, using fallback:", parseError);
        return getFallbackResult(language);
      }
    }

    return getFallbackResult(language);

  } catch (error) {
    console.error("Global Error, using fallback:", error);
    return getFallbackResult(language);
  }
};
