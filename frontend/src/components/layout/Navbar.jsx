import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Video,
  Globe,
  User,
  LogOut,
  ShieldAlert,
  MessageSquare,
  History,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
} from 'lucide-react';

export const Navbar = ({ onOpenFeedback }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        height: '70px',
        backgroundColor: 'rgba(10, 13, 20, 0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        {/* Brand Logo */}
        <Link
          to={isAuthenticated ? '/dashboard' : '/'}
          style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)',
            }}
          >
            <Video size={22} color="#ffffff" />
          </div>
          <div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              VCLT <span className="text-gradient">AI</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Real-Time Video Translation
            </div>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        {isAuthenticated ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link
              to="/dashboard"
              className={`btn btn-secondary ${isActive('/dashboard') ? 'active' : ''}`}
              style={{
                padding: '0.5rem 0.9rem',
                fontSize: '0.85rem',
                border: isActive('/dashboard') ? '1px solid var(--accent-primary)' : '',
              }}
            >
              <LayoutDashboard size={16} />
              Dashboard
            </Link>

            <Link
              to="/lobby"
              className={`btn btn-secondary ${isActive('/lobby') ? 'active' : ''}`}
              style={{
                padding: '0.5rem 0.9rem',
                fontSize: '0.85rem',
                border: isActive('/lobby') ? '1px solid var(--accent-cyan)' : '',
              }}
            >
              <Video size={16} color="var(--accent-cyan)" />
              Join / Start Call
            </Link>

            <Link
              to="/history"
              className={`btn btn-secondary ${isActive('/history') ? 'active' : ''}`}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem' }}
            >
              <History size={16} />
              Call History
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="btn btn-secondary"
                style={{
                  padding: '0.5rem 0.9rem',
                  fontSize: '0.85rem',
                  color: '#fbbf24',
                  borderColor: 'rgba(251, 191, 36, 0.3)',
                }}
              >
                <ShieldAlert size={16} />
                Admin Panel
              </Link>
            )}

            {/* Language Preference Tag */}
            <div
              className="badge badge-primary"
              title="Your configured speech and caption languages"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe size={13} />
              <span>
                {user?.spokenlanguage || 'English'} ➔ {user?.captionlanguage || 'Hindi'}
              </span>
            </div>

            {/* Feedback Button */}
            {onOpenFeedback && (
              <button
                onClick={onOpenFeedback}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.8rem', fontSize: '0.85rem' }}
                title="Send Feedback"
              >
                <MessageSquare size={16} />
                Feedback
              </button>
            )}

            {/* User Profile & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/profile"
                className="btn btn-secondary"
                style={{
                  padding: '0.45rem 0.8rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <User size={15} />
                <span>{user?.username || 'User'}</span>
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.9rem' }}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
              style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem' }}
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
