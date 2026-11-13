import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserHistory } from '../api/user';
import {
  Video,
  Plus,
  ArrowRight,
  Globe,
  History,
  User,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState('');
  const [history, setHistory] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserHistory();
        if (res.success && res.history) {
          setHistory(res.history.slice(0, 5));
        }
      } catch (err) {
        console.warn('Could not fetch history preview:', err.message);
      }
    };
    fetchHistory();
  }, []);

  const handleStartInstantMeeting = () => {
    // Generate 4-digit room code matching original project pattern
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    navigate(`/room/${randomCode}`);
  };

  const handleJoinMeeting = (e) => {
    e.preventDefault();
    if (!roomCode.trim()) return;
    navigate(`/room/${encodeURIComponent(roomCode.trim())}`);
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Welcome Header */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem 2.5rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            background: 'linear-gradient(135deg, rgba(23, 32, 51, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                color: 'var(--accent-cyan)',
                fontWeight: 600,
                marginBottom: '0.4rem',
              }}
            >
              <Sparkles size={16} />
              Welcome to VCLT Hub
            </div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>
              Hello, {user?.username || 'User'}!
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Your multilingual real-time video communication platform is ready.
            </p>
          </div>

          {/* Clock Widget */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              background: 'rgba(10, 13, 20, 0.6)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <Clock size={22} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace' }}>
                {currentTime.toLocaleTimeString()}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {currentTime.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Start Instant Call Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '1.25rem',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
              }}
            >
              <Plus size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Start Instant Meeting</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Create a new room instantly with a randomized 4-digit code and invite peers.
            </p>
            <button
              onClick={handleStartInstantMeeting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <Video size={18} />
              Start Meeting Now
            </button>
          </div>

          {/* Join Existing Call Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)',
                marginBottom: '1.25rem',
              }}
            >
              <Video size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Join Meeting</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Enter a 4-digit invite code or meeting name shared by the host.
            </p>
            <form onSubmit={handleJoinMeeting} style={{ display: 'flex', gap: '0.6rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 5241 or room-alpha"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                style={{ flex: 1 }}
                required
              />
              <button type="submit" className="btn btn-secondary" style={{ padding: '0 1.25rem' }}>
                Join
              </button>
            </form>
          </div>

          {/* Language Preference Card */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-emerald)',
                marginBottom: '1.25rem',
              }}
            >
              <Globe size={28} />
            </div>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '0.5rem' }}>Language Config</h3>
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Speaking In:</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                {user?.spokenlanguage || 'English'}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Receiving Captions In:</div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                {user?.captionlanguage || 'Hindi'}
              </div>
            </div>
            <Link to="/profile" className="btn btn-secondary" style={{ width: '100%', padding: '0.8rem' }}>
              Change Preferences ➔
            </Link>
          </div>
        </div>

        {/* Recent Meeting History */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <History size={20} color="var(--accent-primary)" />
              <h2 style={{ fontSize: '1.35rem' }}>Recent Meeting History</h2>
            </div>
            <Link
              to="/history"
              style={{ fontSize: '0.875rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View Full History <ArrowRight size={14} />
            </Link>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
              No previous meetings recorded yet. Start your first video call above!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.map((room) => (
                <div
                  key={room._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 1.25rem',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(99, 102, 241, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <Video size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Room: {room.roomname}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Created: {room.creationdate}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/room/${encodeURIComponent(room.roomname)}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                  >
                    Rejoin Room
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
