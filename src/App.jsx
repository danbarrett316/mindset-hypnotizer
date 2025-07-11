import { useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState('isochronic-tone-1.mp3')
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef(null)

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

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
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
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
