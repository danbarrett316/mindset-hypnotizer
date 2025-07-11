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
  const audioRef = useRef(null)

  // Fetch and shuffle past successes on mount
  React.useEffect(() => {
    fetch('/past-successes.json')
      .then((res) => res.json())
      .then((data) => setSuccesses(shuffleArray(data)))
      .catch((err) => setSuccesses([{ id: 0, text: 'Could not load past successes.' }]))
  }, [])

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
        {/* Isochronic Tone Player */}
        <div style={{ marginTop: '2em' }}>
          <h2>Isochronic Tone Player</h2>
          <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', marginBottom: '1em' }}>
            {tracks.map((track) => (
              <button
                key={track.file}
                onClick={() => handleTrackSelect(track.file)}
                style={{
                  fontSize: '1em',
                  padding: '0.4em 1em',
                  borderRadius: '6px',
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1em', margin: '1em 0' }}>
            <button onClick={handlePlayPause} style={{ fontSize: '1.2em', padding: '0.5em 1em' }}>
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: '100px' }}
              aria-label="Volume"
            />
            <button onClick={handleMute} style={{ fontSize: '1em', padding: '0.4em 1em' }}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </div>
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
