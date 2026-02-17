import React from 'react';
import { Music, BookOpen, ShoppingBag, Trophy, ArrowLeft, ExternalLink } from 'lucide-react';
import './ResultsView.css';
import type { MoodAnalysisResult, Language } from '../types';

interface ResultsViewProps {
    data: MoodAnalysisResult;
    onReset: () => void;
    language: Language;
}

const ResultsView: React.FC<ResultsViewProps> = ({ data, onReset, language }) => {
    const translations = {
        en: {
            summary: "Mood Summary",
            musicHeader: "Musical Resonance",
            readingHeader: "Reading Path",
            shoppingHeader: "Curation Path",
            olympicHeader: "Olympic Spirit",
            back: "Start Over",
            visit: "Visit"
        },
        kr: {
            summary: "당신의 감정 요약",
            musicHeader: "음악의 울림",
            readingHeader: "독서의 길",
            shoppingHeader: "큐레이션의 길",
            olympicHeader: "올림픽 정신",
            back: "다시 시작하기",
            visit: "방문하기"
        },
        es: {
            summary: "Resumen del humor",
            musicHeader: "Resonancia musical",
            readingHeader: "Camino de lectura",
            shoppingHeader: "Camino de curación",
            olympicHeader: "Espíritu olímpico",
            back: "Empezar de nuevo",
            visit: "Visitar"
        },
        cn: {
            summary: "情绪摘要",
            musicHeader: "音乐共鸣",
            readingHeader: "阅读之路",
            shoppingHeader: "策划之路",
            olympicHeader: "奥林匹克精神",
            back: "重新开始",
            visit: "访问"
        },
        jp: {
            summary: "気分の要約",
            musicHeader: "音楽の共鳴",
            readingHeader: "読書の道",
            shoppingHeader: "キュレーションの道",
            olympicHeader: "オリンピック精神",
            back: "最初から",
            visit: "訪問"
        },
        fr: {
            summary: "Résumé de l'humeur",
            musicHeader: "Résonance musicale",
            readingHeader: "Chemin de lecture",
            shoppingHeader: "Chemin de curation",
            olympicHeader: "Esprit olympique",
            back: "Recommencer",
            visit: "Visiter"
        }
    };

    const t = translations[language] || translations.en;

    // A helper to potentially format YouTube links if we wanted to embed, 
    // but for now we follow the structure from CSS which expects an iframe.
    // If the data doesn't provide an ID, we'll just show the title.
    const youtubeId = data.music?.title?.includes('youtube.com') || data.music?.title?.includes('youtu.be') 
        ? data.music.title.split('v=')[1]?.split('&')[0] || data.music.title.split('/').pop()
        : null;

    return (
        <div className="results-container">
            <header className="result-section summary-section">
                <h2>{t.summary}</h2>
                <p className="mood-summary-text">{data.moodSummary}</p>
            </header>

            <div className="grid-layout">
                {/* Music Section */}
                <div className="card">
                    <div className="card-header">
                        <Music className="icon" size={24} />
                        <h3>{t.musicHeader}</h3>
                    </div>
                    {youtubeId && (
                        <div className="video-wrapper">
                            <iframe
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{data.music.title}</p>
                    <p className="card-caption">{data.music.artist}</p>
                </div>

                {/* Articles/Reading Section */}
                <div className="card">
                    <div className="card-header">
                        <BookOpen className="icon" size={24} />
                        <h3>{t.readingHeader}</h3>
                    </div>
                    <ul className="link-list">
                        {data.articles.map((article, idx) => (
                            <li key={idx}>
                                <a href={article.url} target="_blank" rel="noopener noreferrer">
                                    {article.title} <ExternalLink size={14} style={{ display: 'inline', marginLeft: '4px' }} />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Items/Shopping Section */}
                <div className="card">
                    <div className="card-header">
                        <ShoppingBag className="icon" size={24} />
                        <h3>{t.shoppingHeader}</h3>
                    </div>
                    <ul className="link-list">
                        {data.items.map((item, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.image && <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />}
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Olympics Section */}
                <div className="card">
                    <div className="card-header">
                        <Trophy className="icon" size={24} />
                        <h3>{t.olympicHeader}</h3>
                    </div>
                    <div className="spirit-box">
                        <div className="spirit-sport">
                            <span>{data.olympics.sport}</span>
                        </div>
                        <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--winter-text)' }}>
                            {data.olympics.reason}
                        </p>
                        {data.olympics.highlightUrl && (
                            <a href={data.olympics.highlightUrl} target="_blank" rel="noopener noreferrer" className="highlight-link">
                                View Highlight <ExternalLink size={14} style={{ display: 'inline' }} />
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <button className="back-btn" onClick={onReset}>
                <ArrowLeft size={18} style={{ marginRight: '8px', display: 'inline' }} />
                {t.back}
            </button>
        </div>
    );
};

export default ResultsView;
