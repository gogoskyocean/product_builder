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

    // Robust YouTube URL extraction
    const getYouTubeEmbedUrl = (musicData: any) => {
        if (!musicData) return null;
        if (musicData.youtubeUrl && musicData.youtubeUrl.includes('embed')) return musicData.youtubeUrl;

        // Try to extract ID from provided URL or title
        const source = musicData.youtubeUrl || musicData.title || '';
        const idMatch = source.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^"&?\/\s]{11})/);
        const id = idMatch ? idMatch[1] : null;

        return id ? `https://www.youtube.com/embed/${id}` : null;
    };

    const embedUrl = getYouTubeEmbedUrl(data.music);
    const rawYouTubeLink = data.music?.youtubeUrl || (data.music?.title?.includes('http') ? data.music.title : `https://www.youtube.com/results?search_query=${encodeURIComponent(data.music?.title + ' ' + data.music?.artist)}`);

    const medalTable = [
        { rank: 1, country: "Norway", flag: "🇳🇴", gold: 16, silver: 8, bronze: 13 },
        { rank: 2, country: "Germany", flag: "🇩🇪", gold: 12, silver: 10, bronze: 5 },
        { rank: 3, country: "USA", flag: "🇺🇸", gold: 8, silver: 10, bronze: 7 },
        { rank: 4, country: "Italy", flag: "🇮🇹", gold: 2, silver: 7, bronze: 8 },
        { rank: 5, country: "Canada", flag: "🇨🇦", gold: 4, silver: 8, bronze: 14 }
    ];

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
                    {embedUrl ? (
                        <div className="video-wrapper">
                            <iframe
                                src={embedUrl}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    ) : (
                        <div className="video-wrapper" style={{ background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '1rem' }}>
                            <p style={{ color: 'var(--winter-text-light)', fontSize: '0.9rem' }}>Music player loading or unavailable</p>
                        </div>
                    )}
                    <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{data.music.title}</p>
                    <p className="card-caption" style={{ marginBottom: '1rem' }}>{data.music.artist}</p>
                    <a
                        href={rawYouTubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="highlight-link"
                        style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                        Play on YouTube <ExternalLink size={12} />
                    </a>
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
                <div className="card full-width">
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

                        <div className="medal-mini-table" style={{ marginTop: '1.5rem', background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '15px', border: '1px solid rgba(0,0,0,0.05)' }}>
                            <h4 style={{ fontSize: '0.85rem', color: 'var(--winter-deep-blue)', marginBottom: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Trophy size={14} /> 2026 Winter Games Rankings
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px' }}>
                                {medalTable.map((item) => (
                                    <div key={item.rank} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.03)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{item.flag}</span>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{item.country}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            <span title="Gold" style={{ color: '#d4af37' }}>🥇{item.gold}</span>
                                            <span title="Silver" style={{ color: '#aaa9ad' }}>🥈{item.silver}</span>
                                            <span title="Bronze" style={{ color: '#cd7f32' }}>🥉{item.bronze}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AdSense Placeholder */}
            <div className="adsense-container">
                <div className="adsense-card">
                    <span className="adsense-label">Advertisement</span>
                    <div className="adsense-content">
                        Google AdSense Space
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
