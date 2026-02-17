import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import '../App.css';

import type { Language } from '../types';

interface HeroSectionProps {
    language: Language;
    onSubmit: (input: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ language, onSubmit }) => {
    const [input, setInput] = useState('');

    const translations = {
        en: {
            title: "Where is your heart flowing?",
            subtitle: "Tell me how you feel, and I'll guide you to the perfect path.",
            placeholder: "I feel...",
            button: "Explore My Path"
        },
        kr: {
            title: "당신의 마음은 어디로 흐르고 있나요?",
            subtitle: "지금 기분을 말씀해 주시면, 당신에게 맞는 길을 안내해 드릴게요.",
            placeholder: "오늘 제 기분은...",
            button: "나의 길 찾기"
        },
        es: {
            title: "¿Hacia dónde fluye tu corazón?",
            subtitle: "Dime cómo te sientes y te guiaré por el camino perfecto.",
            placeholder: "Me siento...",
            button: "Explorar mi camino"
        },
        cn: {
            title: "你的心流向何方？",
            subtitle: "告诉我你的感受，我将指引你找到完美的道路。",
            placeholder: "我觉得...",
            button: "探索我的道路"
        },
        jp: {
            title: "心はどこへ流れていますか？",
            subtitle: "今の気分を教えてください。あなたにぴったりの道へ案内します。",
            placeholder: "今の気分は...",
            button: "自分の道を探す"
        },
        fr: {
            title: "Où va votre cœur ?",
            subtitle: "Dites-moi ce que vous ressentez, et je vous guiderai vers le chemin parfait.",
            placeholder: "Je me sens...",
            button: "Explorer mon chemin"
        }
    };

    const t = translations[language];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSubmit(input);
        }
    };

    return (
        <section className="hero-section">
            <h1 className="hero-title">{t.title}</h1>
            <p className="hero-subtitle">{t.subtitle}</p>

            <form className="input-wrapper" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="mood-input"
                    placeholder={t.placeholder}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    autoFocus
                />
            </form>

            <button className="explore-btn" onClick={handleSubmit}>
                <Compass size={20} />
                {t.button}
            </button>
        </section>
    );
};

export default HeroSection;
