import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'

function shuffleArray(array) {
  // Fisher-Yates shuffle
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function App() {
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState('isochronic-tone-1.mp3')
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [successes, setSuccesses] = useState([])
  const [currentSuccessIdx, setCurrentSuccessIdx] = useState(0)
  const [goals, setGoals] = useState([])
  const [currentGoalIdx, setCurrentGoalIdx] = useState(0)
  const audioRef = useRef(null)

  // Fetch and shuffle past successes on mount
  React.useEffect(() => {
    fetch('/past-successes.json')
      .then((res) => res.json())
      .then((data) => setSuccesses(shuffleArray(data)))
      .catch((err) => setSuccesses([{ id: 0, text: 'Could not load past successes.' }]))
  }, [])

  // Fetch goals on mount
  React.useEffect(() => {
    fetch('/goals.json')
      .then((res) => res.json())
      .then((data) => setGoals(shuffleArray(data)))
      .catch((err) => setGoals([]))
  }, [])

  // Auto-advance goal image every 30 seconds
  React.useEffect(() => {
    if (goals.length === 0) return;
    const interval = setInterval(() => {
      setCurrentGoalIdx((idx) => (idx + 1) % goals.length);
    }, 30000);
    return () => clearInterval(interval);
  }, [goals]);

  const tracks = [
    { label: 'Tone 1', file: 'isochronic-tone-1.mp3' },
    { label: 'Tone 2', file: 'isochronic-tone-2.mp3' },
    { label: 'Tone 3', file: 'isochronic-tone-3.mp3' },
  ];

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (file) => {
    setSelectedTrack(file);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      return newMuted;
    });
  };

  // Keep audio element in sync with volume/mute state
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handlePrev = () => {
    setCurrentSuccessIdx((idx) => (idx === 0 ? successes.length - 1 : idx - 1));
  };
  const handleNext = () => {
    setCurrentSuccessIdx((idx) => (idx === successes.length - 1 ? 0 : idx + 1));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#242424', color: '#fff', padding: '2em 0' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        {/* Isochronic Tone Player - now at the top, smaller */}
        <div style={{ marginTop: '0', marginBottom: '1.5em', padding: '0.5em 0', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.1em', marginBottom: '0.7em' }}>Isochronic Tone Player</h2>
          <div style={{ display: 'flex', gap: '0.5em', justifyContent: 'center', marginBottom: '0.7em' }}>
            {tracks.map((track) => (
              <button
                key={track.file}
                onClick={() => handleTrackSelect(track.file)}
                style={{
                  fontSize: '0.85em',
                  padding: '0.25em 0.7em',
                  borderRadius: '5px',
                  border: selectedTrack === track.file ? '2px solid #646cff' : '1px solid #444',
                  background: selectedTrack === track.file ? '#23234a' : '#1a1a1a',
                  color: '#fff',
                  opacity: selectedTrack === track.file ? 1 : 0.8,
                  transition: 'all 0.2s',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                {track.label}
              </button>
            ))}
          </div>
          <audio ref={audioRef} src={`/${selectedTrack}`} onEnded={() => setIsPlaying(false)} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', margin: '0.7em 0' }}>
            <button onClick={handlePlayPause} style={{ fontSize: '0.95em', padding: '0.3em 0.7em' }}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: '70px' }}
              aria-label="Volume"
            />
            <button onClick={handleMute} style={{ fontSize: '0.85em', padding: '0.25em 0.7em' }}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </div>
        {/* Goal Visualization - auto-advancing slideshow */}
        <div style={{ marginTop: '0', textAlign: 'center' }}>
          <h2>Goal Visualization</h2>
          {goals.length > 0 ? (
            <div style={{ minHeight: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={goals[currentGoalIdx]}
                alt="Goal"
                style={{
                  maxWidth: '90vw',
                  maxHeight: '480px',
                  width: '100%',
                  height: 'auto',
                  borderRadius: '18px',
                  boxShadow: '0 4px 24px #0006',
                  background: '#181830',
                  objectFit: 'contain',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
            </div>
          ) : (
            <div style={{ color: '#aaa', minHeight: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              No goal images found.
            </div>
          )}
          {goals.length > 0 && (
            <div style={{ marginTop: '1em', fontSize: '0.9em', color: '#aaa' }}>
              {currentGoalIdx + 1} / {goals.length}
            </div>
          )}
        </div>
        {/* Past Successes - single display with navigation */}
        <div style={{ marginTop: '3em', textAlign: 'center' }}>
          <h2>Past Successes</h2>
          {successes.length > 0 && (
            <>
              <div style={{ margin: '1.5em 0', background: '#23234a', color: '#fff', borderRadius: '6px', padding: '2em 1em', boxShadow: '0 2px 8px #0002', minHeight: '4em', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2em' }}>
                {successes[currentSuccessIdx]?.text}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1em' }}>
                <button onClick={handlePrev} style={{ fontSize: '1em', padding: '0.5em 1.5em', borderRadius: '6px', border: '1px solid #646cff', background: '#1a1a1a', color: '#fff', cursor: 'pointer' }}>Previous</button>
                <button onClick={handleNext} style={{ fontSize: '1em', padding: '0.5em 1.5em', borderRadius: '6px', border: '1px solid #646cff', background: '#1a1a1a', color: '#fff', cursor: 'pointer' }}>Next</button>
              </div>
              <div style={{ marginTop: '1em', fontSize: '0.9em', color: '#aaa' }}>
                {currentSuccessIdx + 1} / {successes.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
