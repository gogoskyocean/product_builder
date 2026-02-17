import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface StaticPagesProps {
    page: 'about' | 'privacy' | 'contact';
    language: string;
    onBack: () => void;
}

const StaticPages: React.FC<StaticPagesProps> = ({ page, onBack }) => {
    const renderContent = () => {
        switch (page) {
            case 'about':
                return (
                    <div className="static-page-content">
                        <h1>About Mood-Path AI</h1>
                        <p>Welcome to Mood-Path AI, your personal companion for emotional well-being and discovery. We believe that every emotion is a starting point for a new journey.</p>

                        <h3>Our Mission</h3>
                        <p>Our mission is to bridge the gap between human emotions and digital discovery. By leveraging advanced artificial intelligence, we translate your current feelings into curated paths—including music that resonates with your soul, articles that expand your mind, and activities that match your energy.</p>

                        <h3>Innovative Core</h3>
                        <p>Powered by Google's Gemini AI, our system analyzes the nuances of your input to provide truly personalized recommendations. We transcend simple 'happy' or 'sad' categories to understand the complex tapestry of human experience.</p>

                        <h3>Olympic Spirit</h3>
                        <p>As we look forward to the 2026 Winter Games, we integrate the spirit of competitive sports into our guidance, finding parallels between the resilience of world-class athletes and your own emotional journey.</p>
                    </div>
                );
            case 'privacy':
                return (
                    <div className="static-page-content">
                        <h1>Privacy Policy</h1>
                        <p>Last Updated: February 17, 2026</p>

                        <h3>1. Introduction</h3>
                        <p>At Mood-Path AI, we respect your privacy. This policy explains how we handle your information when you use our service.</p>

                        <h3>2. Data Collection</h3>
                        <p>We do not store your personal identity. Your mood inputs are processed ephemeral by the AI to generate recommendations and are not permanently saved on our servers.</p>

                        <h3>3. Third-Party Services</h3>
                        <p>We use Google Gemini API for mood analysis and YouTube for music embeds. These services may collect standardized usage data according to their respective privacy policies.</p>

                        <h3>4. Advertising</h3>
                        <p>We use Google AdSense to serve advertisements. AdSense may use cookies to served tailored ads based on your visit to this and other websites.</p>

                        <h3>5. Contact Us</h3>
                        <p>If you have questions about this policy, please visit our Contact page.</p>
                    </div>
                );
            case 'contact':
                return (
                    <div className="static-page-content">
                        <h1>Contact Us</h1>
                        <p>We'd love to hear from you! Whether you have feedback, suggestions, or just want to share your journey, our team is here.</p>

                        <div className="contact-info">
                            <h3>Email Support</h3>
                            <p>For general inquiries: <strong>support@mood-path-ai.pages.dev</strong></p>

                            <h3>Technical Issues</h3>
                            <p>Found a bug? Help us improve by reporting it to: <strong>dev@mood-path-ai.pages.dev</strong></p>
                        </div>

                        <h3>Feedback Loop</h3>
                        <p>We are constantly evolving. Your input directly influences how we refine our AI models and recommendation engines. Thank you for being part of our community.</p>
                    </div>
                );
        }
    };

    return (
        <div className="static-page-container fade-in">
            <button className="back-link" onClick={onBack}>
                <ArrowLeft size={18} /> Back to Home
            </button>
            <div className="card static-card">
                {renderContent()}
            </div>
        </div>
    );
};

export default StaticPages;
