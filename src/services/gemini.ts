const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

import type { Language, MoodAnalysisResult } from '../types';

export const analyzeMood = async (text: string, language: Language) => {
  const getFallbackResult = (lang: Language): MoodAnalysisResult => {
    const fallbacks: Record<string, MoodAnalysisResult> = {
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
      },
      jp: {
        moodSummary: "今、あなたの心は非常に強烈で複雑なエネルギーを表現しています。",
        music: { title: "スピリチュアル・ジャーニー", artist: "瞑想音楽", youtubeUrl: "https://www.youtube.com/embed/S2pETo0zY-U" },
        articles: [{ title: "激しい感情の中でバランスを見つける", url: "https://www.psychologytoday.com" }],
        items: [{ name: "心を落ち着かせるお香", link: "https://www.amazon.co.jp" }],
        olympics: { sport: "カーリング", reason: "嵐を鎮めるための集中力と精度が必要です。", highlightUrl: "https://www.youtube.com/user/olympic" }
      },
      cn: {
        moodSummary: "您的内心现在正表达着一种复杂而强烈的能量。",
        music: { title: "心灵之旅", artist: "冥想音乐", youtubeUrl: "https://www.youtube.com/embed/S2pETo0zY-U" },
        articles: [{ title: "在强烈的情绪中寻找平衡", url: "https://www.psychologytoday.com" }],
        items: [{ name: "安神熏香", link: "https://www.amazon.cn" }],
        olympics: { sport: "冰壶", reason: "需要专注和精确来平息风暴。", highlightUrl: "https://www.youtube.com/user/olympic" }
      }
    };
    return fallbacks[lang] || fallbacks.en;
  };

  try {
    if (!API_KEY) {
      console.error("API Key is missing! Returning fallback.");
      return getFallbackResult(language);
    }

    // 1. Auto-discover a working model
    let modelName = 'gemini-1.5-flash';

    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
      const listResponse = await fetch(listUrl);
      const listData = await listResponse.json();

      if (listData.models) {
        const viableModels = listData.models.filter((m: any) =>
          m.supportedGenerationMethods?.includes('generateContent')
        );

        const bestModel = viableModels.find((m: any) => m.name.includes('gemini-1.5-flash')) ||
          viableModels.find((m: any) => m.name.includes('gemini-pro') && !m.name.includes('latest')) ||
          viableModels[0];

        if (bestModel) {
          modelName = bestModel.name.replace('models/', '');
        }
      }
    } catch (e) {
      console.warn("Model discovery failed, using default:", e);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    const langMap: Record<string, string> = {
      'en': 'English', 'kr': 'Korean', 'es': 'Spanish', 'cn': 'Chinese (Simplified)', 'jp': 'Japanese', 'fr': 'French'
    };
    const targetLang = langMap[language] || 'English';

    const promptText = `
      Analyze this mood: "${text}"
      Target Language: ${targetLang}
      Return ONLY a raw JSON object with this structure:
      {
        "moodSummary": "One sentence summary in ${targetLang}.",
        "music": { "title": "Song Title", "artist": "Artist Name", "youtubeUrl": "YouTube embed URL" },
        "articles": [{ "title": "Title", "url": "URL" }],
        "items": [{ "name": "Item", "link": "URL" }],
        "olympics": { "sport": "Winter Olympic Sport", "reason": "Reason", "highlightUrl": "URL" }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: { temperature: 0.9, maxOutputTokens: 1024 },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ]
      })
    });

    if (!response.ok) return getFallbackResult(language);

    const data = await response.json();
    let generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) return getFallbackResult(language);

    generatedText = generatedText.replace(/```json/g, '').replace(/```/g, '').trim();
    const jsonStart = generatedText.indexOf('{');
    const jsonEnd = generatedText.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1) {
      try {
        return JSON.parse(generatedText.substring(jsonStart, jsonEnd + 1));
      } catch (e) {
        return getFallbackResult(language);
      }
    }

    return getFallbackResult(language);

  } catch (error) {
    console.error("Global Error in analyzeMood:", error);
    return getFallbackResult(language);
  }
};
