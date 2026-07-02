'use client';
import { useRef } from 'react';
import { usePlayer, activeBeat } from '@/stores/usePlayer';
import { useUI } from '@/stores/useUI';
import { coverStyle } from '@/lib/assets';
import { formatTime } from '@/lib/format';

export default function PlayerBar() {
  const visible = usePlayer((s) => s.visible);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const activeBeatId = usePlayer((s) => s.activeBeatId);
  const currentTime = usePlayer((s) => s.currentTime);
  const duration = usePlayer((s) => s.duration);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeatOne = usePlayer((s) => s.repeatOne);
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);

  const toggle = usePlayer((s) => s.toggle);
  const navigate = usePlayer((s) => s.navigate);
  const toggleShuffle = usePlayer((s) => s.toggleShuffle);
  const toggleRepeat = usePlayer((s) => s.toggleRepeat);
  const close = usePlayer((s) => s.close);
  const seekPct = usePlayer((s) => s.seekPct);
  const setVolumePct = usePlayer((s) => s.setVolumePct);
  const toggleMute = usePlayer((s) => s.toggleMute);
  const openBeat = useUI((s) => s.openBeat);

  const seekRef = useRef<HTMLDivElement>(null);
  const volRef = useRef<HTMLDivElement>(null);
  const seekDrag = useRef(false);
  const volDrag = useRef(false);

  const beat = activeBeat();
  const pct = duration ? (currentTime / duration) * 100 : 0;
  const volLevel = (muted ? 0 : volume) * 100;

  const seekAt = (x: number) => { const r = seekRef.current?.getBoundingClientRect(); if (r) seekPct((x - r.left) / r.width); };
  const volAt = (x: number) => { const r = volRef.current?.getBoundingClientRect(); if (r) setVolumePct((x - r.left) / r.width); };

  return (
    <div className={`player-bar${visible ? ' visible' : ''}${isPlaying ? ' playing' : ''}`} id="playerBar" role="region" aria-label="Now playing">
      <div className="player-track" onClick={() => { if (activeBeatId) openBeat(activeBeatId); }}>
        <div className="player-art" style={beat ? coverStyle(beat.imgFile, beat.imgGradient) : undefined}></div>
        <div className="player-track-info">
          <span className="player-track-title">{beat?.title || 'Nothing playing'}</span>
          <span className="player-track-meta">{beat ? <>{beat.bpm} BPM &nbsp;·&nbsp; <span className="player-key">{beat.key}</span></> : 'Pick a beat to start'}</span>
        </div>
      </div>

      <div className="player-controls">
        <button className={`player-btn player-btn--mini${shuffle ? ' active' : ''}`} onClick={toggleShuffle} aria-label="Shuffle" title="Shuffle playback">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
        </button>
        <button className="player-btn" onClick={() => navigate(-1)} aria-label="Previous beat" title="Previous">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="19 20 9 12 19 4" /><rect x="4" y="4" width="2.4" height="16" rx="1" /></svg>
        </button>
        <button className="player-btn player-btn--play" onClick={toggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying
            ? <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><rect x="5" y="3" width="4.5" height="18" rx="1" /><rect x="14.5" y="3" width="4.5" height="18" rx="1" /></svg>
            : <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="6,4 20,12 6,20" /></svg>}
        </button>
        <button className="player-btn" onClick={() => navigate(1)} aria-label="Next beat" title="Next">
          <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><polygon points="5 4 15 12 5 20" /><rect x="17.6" y="4" width="2.4" height="16" rx="1" /></svg>
        </button>
        <button className={`player-btn player-btn--mini${repeatOne ? ' active' : ''}`} onClick={toggleRepeat} aria-label="Repeat" title="Repeat">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
          <span className="player-repeat-one" style={{ display: repeatOne ? 'flex' : 'none' }}>1</span>
        </button>
      </div>

      <div className="player-seek-row">
        <span className="player-time">{formatTime(currentTime)}</span>
        <div
          className="player-seek"
          ref={seekRef}
          onPointerDown={(e) => { seekDrag.current = true; e.currentTarget.setPointerCapture(e.pointerId); seekAt(e.clientX); e.preventDefault(); }}
          onPointerMove={(e) => { if (seekDrag.current) seekAt(e.clientX); }}
          onPointerUp={() => { seekDrag.current = false; }}
          onPointerCancel={() => { seekDrag.current = false; }}
        >
          <div className="player-seek-fill" style={{ width: pct + '%' }}></div>
          <div className="player-seek-thumb" style={{ left: pct + '%' }}></div>
        </div>
        <span className="player-time">{formatTime(duration)}</span>
      </div>

      <div className="player-right">
        <button className="player-btn player-btn--mini" onClick={toggleMute} aria-label="Mute">
          {volLevel === 0
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" /><line x1="22" y1="9" x2="16" y2="15" /><line x1="16" y1="9" x2="22" y2="15" /></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>}
        </button>
        <div
          className="player-vol"
          ref={volRef}
          onPointerDown={(e) => { volDrag.current = true; e.currentTarget.setPointerCapture(e.pointerId); volAt(e.clientX); e.preventDefault(); }}
          onPointerMove={(e) => { if (volDrag.current) volAt(e.clientX); }}
          onPointerUp={() => { volDrag.current = false; }}
          onPointerCancel={() => { volDrag.current = false; }}
        >
          <div className="player-vol-fill" style={{ width: volLevel + '%' }}></div>
          <div className="player-vol-thumb" style={{ left: volLevel + '%' }}></div>
        </div>
        <button className="player-btn player-btn--mini player-btn--close" onClick={close} aria-label="Close player" title="Close player">
          <svg viewBox="0 0 14 14" fill="none" width="13" height="13"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>
      </div>
    </div>
  );
}
