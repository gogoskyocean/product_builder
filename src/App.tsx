import { useState } from 'react'
import Layout from './components/Layout'
import type { Mood } from './types'
import './App.css'

function App() {
  const [mood, setMood] = useState<Mood>('neutral')

  return (
    <Layout mood={mood}>
      <h2>How are you feeling today?</h2>

      <div className="mood-selector">
        <button onClick={() => setMood('happy')}>Happy 😊</button>
        <button onClick={() => setMood('sad')}>Sad 😢</button>
        <button onClick={() => setMood('anxious')}>Anxious 😰</button>
        <button onClick={() => setMood('energetic')}>Energetic 🤩</button>
        <button onClick={() => setMood('neutral')}>Neutral 😐</button>
      </div>

      <div className="content-area">
        <h3>Current Mood: {mood.charAt(0).toUpperCase() + mood.slice(1)}</h3>
        <p>Select a mood to see how the theme changes!</p>
      </div>
    </Layout>
  )
}

export default App
