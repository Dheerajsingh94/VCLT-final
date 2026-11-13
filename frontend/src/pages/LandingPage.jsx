import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Video,
  Globe,
  Sparkles,
  ShieldCheck,
  FileText,
  Mic,
  ArrowRight,
  Languages,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../utils/languages';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '5rem 0 3.5rem', textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div
            className="badge badge-primary"
            style={{
              padding: '0.4rem 1rem',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.25)',
            }}
          >
            <Sparkles size={14} color="var(--accent-cyan)" />
            <span>Next-Gen Video Call Language Translator (VCLT)</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              fontWeight: 800,
            }}
          >
            Break Every Language Barrier in{' '}
            <span className="text-gradient">Real-Time Video Calls</span>
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.6,
            }}
          >
            Speak naturally in your mother tongue. VCLT instantly transcribes your voice,
            translates it with AI, and displays synchronized multilingual subtitles and
            meeting notes in real-time.
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <Link
              to={isAuthenticated ? '/lobby' : '/register'}
              className="btn btn-primary"
              style={{ padding: '0.9rem 2rem', fontSize: '1.1rem' }}
            >
              <span>{isAuthenticated ? 'Enter Meeting Lobby' : 'Get Started Free'}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to={isAuthenticated ? '/dashboard' : '/login'}
              className="btn btn-secondary"
              style={{ padding: '0.9rem 1.75rem', fontSize: '1.05rem' }}
            >
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Sign In'}</span>
            </Link>
          </div>

          {/* Interactive Simulation Card */}
          <div
            className="glass-panel"
            style={{
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-glow), 0 20px 50px rgba(0,0,0,0.6)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                textAlign: 'left',
              }}
            >
              {/* Speaker Box */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-medium)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    R
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>Rahul (Speaking Hindi)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
                      • Mic Active (hi-IN)
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontStyle: 'italic',
                    color: '#e2e8f0',
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;नमस्ते! क्या हम आज की प्रोजेक्ट डेडलाइन पर चर्चा कर सकते हैं?&rdquo;
                </div>
              </div>

              {/* Translation Box */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(6, 182, 212, 0.4)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--accent-cyan)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontWeight: 700,
                    }}
                  >
                    J
                  </div>
                  <div>
                    <div style={{ fontWeight: 600 }}>John (Captions in English)</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                      • Subtitles Received (en)
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '1.15rem',
                    fontWeight: 600,
                    color: '#67e8f9',
                    lineHeight: 1.5,
                  }}
                >
                  &ldquo;Hello! Can we discuss today's project deadline?&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Languages Showcase */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              Multi-Language Translation Support
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Communicate fluently across major Indian and global languages.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '1rem',
            }}
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div
                key={lang.name}
                className="glass-card"
                style={{ padding: '1.25rem', textAlign: 'center' }}
              >
                <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f8fafc' }}>
                  {lang.native}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 500, marginTop: '4px' }}>
                  {lang.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Code: {lang.captionCode}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Engineered For Seamless Communication
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Everything you need for productive international and multilingual meetings.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(99, 102, 241, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--accent-primary)',
                }}
              >
                <Video size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                HD Video Calling via Agora RTC
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Crystal-clear adaptive video streams, screen sharing, focus view, and low-latency
                multi-party conferencing.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(6, 182, 212, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--accent-cyan)',
                }}
              >
                <Globe size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                Live Speech Recognition & Translation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Continuous speech-to-text with auto-detection that translates spoken speech on-the-fly
                into the recipient's preferred caption language.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  color: 'var(--accent-emerald)',
                }}
              >
                <FileText size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>
                Meeting Minutes to PDF
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Every caption and message is cataloged. Export formatted Meeting Notes and Chat
                Transcripts as PDFs with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: '2.5rem 0',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
        }}
      >
        <div className="container">
          <p>© {new Date().getFullYear()} VCLT (Video Call Language Translator). Built with MERN Stack.</p>
        </div>
      </footer>
    </div>
  );
};
