import React from 'react';
import type { Language } from '../types';
import '../App.css';

interface LanguageSwitchProps {
    language: Language;
    setLanguage: (lang: Language) => void;
}

const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ language, setLanguage }) => {
    const languages: { code: Language; label: string; flag: string }[] = [
        { code: 'en', label: 'EN', flag: '🇺🇸' },
        { code: 'kr', label: 'KR', flag: '🇰🇷' },
        { code: 'es', label: 'ES', flag: '🇪🇸' },
        { code: 'cn', label: 'CN', flag: '🇨🇳' },
        { code: 'jp', label: 'JP', flag: '🇯🇵' },
        { code: 'fr', label: 'FR', flag: '🇫🇷' },
    ];

    // Scroll container for mobile if needed
    return (
        <div className="lang-switch" style={{ overflowX: 'auto', maxWidth: '100%' }}>
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    className={`lang-btn ${language === lang.code ? 'active' : ''}`}
                    onClick={() => setLanguage(lang.code)}
                    title={lang.label}
                >
                    <span className="lang-flag">{lang.flag}</span>
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitch;
