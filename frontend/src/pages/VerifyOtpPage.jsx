import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { verifyOtpCode, resendOtpCode } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { KeyRound, CheckCircle2, RotateCw } from 'lucide-react';

export const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState(emailParam);
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    // Focus first input box on load
    inputRefs[0].current?.focus();
  }, []);

  const handleDigitChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    const nextDigits = [...otpDigits];
    nextDigits[index] = value;
    setOtpDigits(nextDigits);
    setError('');

    // Advance focus if value typed
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Go to previous box on Backspace if current box is empty
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(paste)) {
      const digits = paste.split('');
      setOtpDigits(digits);
      inputRefs[3].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otpDigits.join('');

    if (!email.trim()) {
      setError('Email address is missing.');
      return;
    }

    if (fullOtp.length !== 4) {
      setError('Please enter all 4 digits of the OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyOtpCode({ email: email.trim(), otp: fullOtp });
      if (res.success && res.token && res.user) {
        login(res.token, res.user);
        navigate('/dashboard');
      } else {
        setError(res.message || 'OTP verification failed.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim()) {
      setError('Please specify your registered email.');
      return;
    }

    setResending(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await resendOtpCode({ email: email.trim(), purpose: 'register' });
      setSuccessMsg(res.message || 'A new OTP has been sent to your email.');
      setOtpDigits(['', '', '', '']);
      inputRefs[0].current?.focus();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
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
          textAlign: 'center',
          boxShadow: 'var(--shadow-glow), 0 20px 40px rgba(0,0,0,0.5)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#fff',
          }}
        >
          <KeyRound size={26} />
        </div>

        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Verify OTP Code</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Enter the 4-digit verification code sent to <br />
          <strong style={{ color: 'var(--accent-cyan)' }}>{email || 'your email'}</strong>
        </p>

        {error && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fda4af',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#6ee7b7',
              fontSize: '0.875rem',
              marginBottom: '1.25rem',
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 4 auto-advancing digit boxes */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '2rem',
            }}
            onPaste={handlePaste}
          >
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '56px',
                  height: '64px',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '2px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  color: '#ffffff',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                }}
                className="form-input"
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>Didn't receive the email code?</span>
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <RotateCw size={14} className={resending ? 'spin' : ''} />
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  );
};
