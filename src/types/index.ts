export type Mood = 'happy' | 'sad' | 'anxious' | 'energetic' | 'neutral';

export type Language = 'en' | 'kr' | 'es' | 'cn' | 'jp' | 'fr';

export interface MoodAnalysisResult {
    moodSummary: string;
    music: {
        title: string;
        artist: string;
        youtubeUrl?: string;
    };
    articles: Array<{
        title: string;
        url: string;
    }>;
    items: Array<{
        name: string;
        link: string;
        image?: string;
    }>;
    olympics: {
        sport: string;
        reason: string;
        highlightUrl: string;
    };
}
