import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Sparkles,
  ArrowRight,
  Shuffle,
  Shield,
} from 'lucide-react';

export const LobbyPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [roomName, setRoomName] = useState('');
  const [displayName, setDisplayName] = useState(user?.username || '');
  const [cameraActive, setCameraActive] = useState(true);
  const [micActive, setMicActive] = useState(true);
  const [mediaStream, setMediaStream] = useState(null);

  const videoPreviewRef = useRef(null);

  // Request webcam preview in lobby
  useEffect(() => {
    let stream = null;
    const startPreview = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        if (videoPreviewRef.current) {
          videoPreviewRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn('Lobby camera preview not available:', err.message);
      }
    };

    startPreview();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleCameraPreview = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraActive;
        setCameraActive(!cameraActive);
      }
    } else {
      setCameraActive(!cameraActive);
    }
  };

  const toggleMicPreview = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micActive;
        setMicActive(!micActive);
      }
    } else {
      setMicActive(!micActive);
    }
  };

  const handleGenerateRandomCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomName(code);
  };

  const handleJoin = (e) => {
    e.preventDefault();
    let finalRoom = roomName.trim();
    if (!finalRoom) {
      finalRoom = Math.floor(1000 + Math.random() * 9000).toString();
    }
    // Save display name for meeting session
    sessionStorage.setItem('vclt_display_name', displayName || user?.username || 'Participant');
    navigate(`/room/${encodeURIComponent(finalRoom)}`);
  };

  return (
    <div style={{ padding: '3rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.4rem', marginBottom: '0.4rem' }}>Meeting Lobby</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Check your audio and video before entering the conference room.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          {/* Camera Preview Tile */}
          <div className="glass-panel" style={{ padding: '1.25rem', overflow: 'hidden' }}>
            <div
              style={{
                position: 'relative',
                aspectRatio: '16/9',
                backgroundColor: '#0a0d14',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {cameraActive ? (
                <video
                  ref={videoPreviewRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  <VideoOff size={48} style={{ margin: '0 auto 0.5rem' }} />
                  <div>Camera is Off</div>
                </div>
              )}

              {/* In-tile preview toggles */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  display: 'flex',
                  gap: '8px',
                  zIndex: 10,
                }}
              >
                <button
                  type="button"
                  onClick={toggleMicPreview}
                  className={`btn-control ${!micActive ? 'danger-active' : ''}`}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micActive ? <Mic size={18} /> : <MicOff size={18} />}
                </button>
                <button
                  type="button"
                  onClick={toggleCameraPreview}
                  className={`btn-control ${!cameraActive ? 'danger-active' : ''}`}
                  title={cameraActive ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
                </button>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1rem',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-indicator" />
                <span>Ready to join</span>
              </div>
              <div>
                Audio: {micActive ? 'Active' : 'Muted'} | Video: {cameraActive ? 'Active' : 'Disabled'}
              </div>
            </div>
          </div>

          {/* Meeting Form */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.25rem' }}>Room Details</h2>

            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label className="form-label">Your Display Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Room Code / Meeting Name</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomCode}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 600,
                    }}
                  >
                    <Shuffle size={13} />
                    Generate 4-Digit Code
                  </button>
                </div>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 7482 or my-meeting"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Leave empty to automatically generate a random room code.
                </span>
              </div>

              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.5rem',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ fontWeight: 600, color: '#a5b4fc', marginBottom: '4px' }}>
                  Translation Preferences:
                </div>
                <div style={{ color: 'var(--text-secondary)' }}>
                  Speaking: <strong>{user?.spokenlanguage || 'English'}</strong> | Captions:{' '}
                  <strong style={{ color: 'var(--accent-cyan)' }}>{user?.captionlanguage || 'Hindi'}</strong>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.85rem', fontSize: '1.05rem' }}
              >
                <span>Enter Video Conference Room</span>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
