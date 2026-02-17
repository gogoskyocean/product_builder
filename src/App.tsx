import { useState } from 'react';
import HeroSection from './components/HeroSection';
import LanguageSwitch from './components/LanguageSwitch';
import ResultsView from './components/ResultsView';
import StaticPages from './components/StaticPages';
import { analyzeMood } from './services/gemini';
import type { MoodAnalysisResult, Language } from './types';
import './App.css';
import { Loader2 } from 'lucide-react';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoodAnalysisResult | null>(null);
  const [activePage, setActivePage] = useState<'main' | 'about' | 'privacy' | 'contact'>('main');

  const handleMoodSubmit = async (input: string) => {
    setLoading(true);
    try {
      const analysis = await analyzeMood(input, language);
      setResult(analysis);
    } catch (error) {
      console.error("Failed to analyze mood", error);
      // Even if everything else fails, ensure the user sees something.
      setResult({
        moodSummary: language === 'kr' ? "지금은 감정을 분석하기 어려운 상태입니다. 잠시 휴식을 취해보시는 건 어떨까요?" : "I'm having a bit of trouble analyzing this right now. How about taking a small break?",
        music: { title: "Spiritual Journey", artist: "Meditation", youtubeUrl: "https://www.youtube.com/embed/S2pETo0zY-U" },
        articles: [{ title: "Mental Health Resources", url: "https://www.who.int" }],
        items: [{ name: "Herbal Tea", link: "https://www.amazon.com" }],
        olympics: { sport: "Curling", reason: "Cooling down and focusing.", highlightUrl: "https://www.youtube.com/user/olympic" }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setActivePage('main');
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo" onClick={handleReset} style={{ cursor: 'pointer' }}>
          Mood-Path AI
        </div>
        <LanguageSwitch language={language} setLanguage={setLanguage} />
      </header>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {activePage !== 'main' ? (
          <StaticPages page={activePage as any} language={language} onBack={handleReset} />
        ) : loading ? (
          <div className="loading-container" style={{ textAlign: 'center', color: 'var(--winter-deep-blue)' }}>
            <Loader2 className="animate-spin" size={48} style={{ margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1.2rem', fontWeight: 600 }}>
              {(() => {
                const msgs = {
                  en: "Analyzing your path...",
                  kr: "당신의 감정을 분석하고 길을 찾는 중...",
                  es: "Analizando tu camino...",
                  cn: "正在分析您的路径...",
                  jp: "あなたの道を分析中...",
                  fr: "Analyse de votre chemin..."
                };
                return msgs[language] || msgs.en;
              })()}
            </p>
          </div>
        ) : result ? (
          <ResultsView data={result} onReset={handleReset} language={language} />
        ) : (
          <HeroSection language={language} onSubmit={handleMoodSubmit} />
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <p>© 2026 Mood-Path AI. Global Emotional Curation Service.</p>
          <div className="footer-links">
            <span onClick={() => setActivePage('about')}>About</span>
            <span onClick={() => setActivePage('privacy')}>Privacy Policy</span>
            <span onClick={() => setActivePage('contact')}>Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
