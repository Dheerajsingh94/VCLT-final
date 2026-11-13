import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
  updateUserLanguages,
  deactivateMyAccount,
} from '../api/user';
import { SUPPORTED_LANGUAGES } from '../utils/languages';
import { Modal } from '../components/common/Modal';
import {
  User,
  Mail,
  Calendar,
  Phone,
  MapPin,
  Globe,
  Upload,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Save,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';

export const ProfilePage = () => {
  const { user, updateLocalUser, logout } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    birthyear: '',
    birthdate: '',
    contactNumber: '',
    address: '',
    gender: '',
    spokenlanguage: 'English',
    captionlanguage: 'Hindi',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [deactivateModalOpen, setDeactivateModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        if (res.success && res.user) {
          setProfileData({
            username: res.user.username || '',
            email: res.user.email || '',
            birthyear: res.user.birthyear || '',
            birthdate: res.user.birthdate || '',
            contactNumber: res.user.contactNumber || '',
            address: res.user.address || '',
            gender: res.user.gender || '',
            spokenlanguage: res.user.spokenlanguage || 'English',
            captionlanguage: res.user.captionlanguage || 'Hindi',
          });
        }
      } catch (err) {
        console.warn('Failed to fetch profile:', err.message);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setMsg({ type: '', text: '' });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMsg({ type: '', text: '' });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        username: profileData.username,
        birthyear: Number(profileData.birthyear),
        birthdate: profileData.birthdate,
        contactNumber: profileData.contactNumber,
        address: profileData.address,
        gender: profileData.gender,
      };

      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
          setMsg({ type: 'error', text: 'New passwords do not match.' });
          setLoading(false);
          return;
        }
        payload.currentPassword = passwordData.currentPassword;
        payload.newPassword = passwordData.newPassword;
      }

      const res = await updateUserProfile(payload);
      if (res.success) {
        updateLocalUser(res.user);
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setMsg({ type: 'success', text: 'Profile details saved successfully.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLanguages = async () => {
    setLoading(true);
    try {
      const res = await updateUserLanguages({
        spokenlanguage: profileData.spokenlanguage,
        captionlanguage: profileData.captionlanguage,
      });
      if (res.success) {
        updateLocalUser({
          spokenlanguage: profileData.spokenlanguage,
          captionlanguage: profileData.captionlanguage,
        });
        setMsg({ type: 'success', text: 'Language preferences updated!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update languages.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const res = await uploadProfilePhoto(formData);
      if (res.success && res.user) {
        updateLocalUser(res.user);
        setMsg({ type: 'success', text: 'Profile picture updated!' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to upload photo.' });
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateMyAccount();
      await logout();
      window.location.href = '/login';
    } catch (err) {
      alert('Failed to deactivate account.');
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>Account & Preferences</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Manage your personal details, language preferences, and security settings.
        </p>

        {msg.text && (
          <div
            style={{
              padding: '0.85rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: msg.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: msg.type === 'success' ? '#6ee7b7' : '#fda4af',
              border: `1px solid ${msg.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {msg.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
            <span>{msg.text}</span>
          </div>
        )}

        {/* Profile Card & Avatar */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 700,
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                {user?.profile ? (
                  <img
                    src={`/uploads/${user.profile}`}
                    alt="Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  (profileData.username || 'U').charAt(0).toUpperCase()
                )}
              </div>
              <label
                htmlFor="photoUpload"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  background: 'var(--accent-primary)',
                  padding: '6px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                }}
                title="Change Photo"
              >
                <Upload size={14} color="#fff" />
                <input
                  type="file"
                  id="photoUpload"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
                {profileData.username || 'User Profile'}
              </h2>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                {profileData.email}
              </div>
              <span className="badge badge-emerald">Active Account</span>
            </div>
          </div>
        </div>

        {/* Language Selection Card */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Globe size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.35rem' }}>Real-Time Language Preferences</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Choose which language you speak during video calls, and which language subtitles you prefer to receive.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
              marginBottom: '1.5rem',
            }}
          >
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">I Speak (Spoken Language)</label>
              <select
                name="spokenlanguage"
                className="form-select"
                value={profileData.spokenlanguage}
                onChange={handleProfileChange}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name} ({l.native})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label">I Want Captions In (Subtitle Language)</label>
              <select
                name="captionlanguage"
                className="form-select"
                value={profileData.captionlanguage}
                onChange={handleProfileChange}
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.name} value={l.name}>
                    {l.name} ({l.native})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleSaveLanguages} className="btn btn-secondary" disabled={loading}>
            <Save size={16} />
            Save Language Preferences
          </button>
        </div>

        {/* Profile Details & Password Form */}
        <form onSubmit={handleSaveProfile} className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <User size={22} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '1.35rem' }}>Personal Details</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.25rem',
            }}
          >
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={profileData.username}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input type="email" className="form-input" value={profileData.email} disabled />
            </div>

            <div className="form-group">
              <label className="form-label">Birth Year</label>
              <input
                type="number"
                name="birthyear"
                className="form-input"
                value={profileData.birthyear}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Birthdate (Optional)</label>
              <input
                type="date"
                name="birthdate"
                className="form-input"
                value={profileData.birthdate}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Number (Optional)</label>
              <input
                type="text"
                name="contactNumber"
                className="form-input"
                placeholder="e.g. +91 9876543210"
                value={profileData.contactNumber}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                className="form-select"
                value={profileData.gender}
                onChange={handleProfileChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Home Address (Optional)</label>
            <input
              type="text"
              name="address"
              className="form-input"
              placeholder="e.g. 123 Main Street, City"
              value={profileData.address}
              onChange={handleProfileChange}
            />
          </div>

          {/* Change Password Sub-section */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={16} />
              Change Password (Leave blank if keeping current)
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem',
              }}
            >
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                    title={showCurrentPassword ? 'Hide password' : 'Show password'}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
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
                    title={showNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmNewPassword ? 'text' : 'password'}
                    name="confirmNewPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={passwordData.confirmNewPassword}
                    onChange={handlePasswordChange}
                    style={{ paddingRight: '2.5rem' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
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
                    title={showConfirmNewPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={16} />
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>

        {/* Danger Zone: Account Deactivation */}
        <div
          className="glass-panel"
          style={{
            padding: '2rem',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#fda4af' }}>
            <AlertTriangle size={22} />
            <h2 style={{ fontSize: '1.35rem' }}>Danger Zone: Account Deactivation</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Deactivating your account will immediately revoke access to meetings. You can request
            reactivation later from the sign-in page.
          </p>

          <button
            type="button"
            onClick={() => setDeactivateModalOpen(true)}
            className="btn btn-danger"
          >
            Deactivate My Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={deactivateModalOpen}
        onClose={() => setDeactivateModalOpen(false)}
        title="Confirm Account Deactivation"
      >
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Are you sure you want to deactivate your account? You will be immediately logged out and
          unable to access VCLT until an administrator approves your reactivation request.
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={() => setDeactivateModalOpen(false)}
            className="btn btn-secondary"
          >
            Keep Account Active
          </button>
          <button
            onClick={handleDeactivate}
            className="btn btn-danger"
            style={{ background: 'var(--accent-rose)', color: '#fff' }}
          >
            Yes, Deactivate Account
          </button>
        </div>
      </Modal>
    </div>
  );
};
