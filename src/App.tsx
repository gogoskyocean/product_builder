import { useState } from 'react';
import HeroSection from './components/HeroSection';
import LanguageSwitch from './components/LanguageSwitch';
import ResultsView from './components/ResultsView';
import { analyzeMood } from './services/gemini';
import type { MoodAnalysisResult, Language } from './types';
import './App.css';
import { Loader2 } from 'lucide-react';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MoodAnalysisResult | null>(null);

  const handleMoodSubmit = async (input: string) => {
    setLoading(true);
    try {
      const analysis = await analyzeMood(input, language);
      setResult(analysis);
    } catch (error) {
      console.error("Failed to analyze mood", error);
      alert("Sorry, I couldn't understand your mood right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
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
        {loading ? (
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

      <footer style={{ textAlign: 'center', padding: '1rem', color: 'var(--winter-text-light)', fontSize: '0.8rem' }}>
        © 2026 Mood-Path AI. Global Emotional Curation Service.
      </footer>
    </div>
  );
}

export default App;
