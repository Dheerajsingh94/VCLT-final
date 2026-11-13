import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/auth';
import { requestReactivation } from '../api/user';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/common/Modal';
import { Mail, Lock, LogIn, AlertCircle, Send, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeactivated, setIsDeactivated] = useState(false);

  // Reactivation Modal state
  const [reactivateModalOpen, setReactivateModalOpen] = useState(false);
  const [reactivateMessage, setReactivateMessage] = useState('');
  const [reactivateLoading, setReactivateLoading] = useState(false);
  const [reactivateSuccess, setReactivateSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setIsDeactivated(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        if (res.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(res.message || 'Login failed.');
      }
    } catch (err) {
      if (err.response?.data?.deactivated) {
        setIsDeactivated(true);
        setError(err.response.data.message || 'Your account is currently deactivated.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReactivation = async (e) => {
    e.preventDefault();
    if (!reactivateMessage.trim()) return;

    setReactivateLoading(true);
    try {
      const res = await requestReactivation({
        email: formData.email.trim(),
        message: reactivateMessage.trim(),
      });
      setReactivateSuccess(res.message || 'Request submitted successfully.');
      setTimeout(() => {
        setReactivateModalOpen(false);
        setReactivateSuccess('');
        setReactivateMessage('');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit reactivation request.');
    } finally {
      setReactivateLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-glow), 0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--gradient-brand)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: '#fff',
            }}
          >
            <LogIn size={26} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sign in to start or join translated video meetings
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div>{error}</div>
                {isDeactivated && (
                  <button
                    type="button"
                    onClick={() => setReactivateModalOpen(true)}
                    style={{
                      marginTop: '6px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    Click here to request account reactivation ➔
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem' }}
                required
              />
              <Mail
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <Link
                to="/forgot-password"
                style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}
              >
                Forgot Password?
              </Link>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                required
              />
              <Lock
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                tabIndex={-1}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            Create one free
          </Link>
        </div>
      </div>

      {/* Reactivation Request Modal */}
      <Modal
        isOpen={reactivateModalOpen}
        onClose={() => setReactivateModalOpen(false)}
        title="Request Account Reactivation"
      >
        <form onSubmit={handleSendReactivation}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Your account ({formData.email}) is currently deactivated. Send a message to the
            administrator to request reactivating your account.
          </p>

          <div className="form-group">
            <label className="form-label">Reason / Message for Admin</label>
            <textarea
              className="form-textarea"
              rows={4}
              value={reactivateMessage}
              onChange={(e) => setReactivateMessage(e.target.value)}
              placeholder="e.g. Please reactivate my account so I can join today's client meeting..."
              required
            />
          </div>

          {reactivateSuccess && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#6ee7b7',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              <CheckCircle2 size={16} style={{ display: 'inline', marginRight: '6px' }} />
              {reactivateSuccess}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setReactivateModalOpen(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={reactivateLoading || !reactivateMessage.trim()}
            >
              <Send size={16} />
              {reactivateLoading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
