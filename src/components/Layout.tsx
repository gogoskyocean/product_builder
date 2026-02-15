import React, { useEffect } from 'react';
import type { Mood } from '../types';
import '../index.css';

interface LayoutProps {
    children: React.ReactNode;
    mood: Mood;
}

const Layout: React.FC<LayoutProps> = ({ children, mood }) => {
    useEffect(() => {
        // Optional: Update body class if we wanted to style body directly
        // document.body.className = `mood-${mood}`;
    }, [mood]);

    return (
        <div className={`app-container mood-${mood}`} style={{ minHeight: '100vh', transition: 'background-color 0.5s' }}>
            <header style={{ padding: '1rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                <h1>Mood-Path AI</h1>
            </header>
            <main style={{ padding: '2rem' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
