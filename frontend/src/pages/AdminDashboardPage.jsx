import React, { useState, useEffect } from 'react';
import {
  getAdminStats,
  getAdminUsers,
  toggleAdminUserStatus,
  getAdminRequests,
  resolveAdminRequest,
  getAdminFeedbacks,
} from '../api/admin';
import {
  ShieldAlert,
  Users,
  MessageSquare,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Star,
  Search,
  RefreshCw,
  Video,
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'requests' | 'feedbacks'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchAllAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reqsRes, feedRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminRequests(),
        getAdminFeedbacks(),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (reqsRes.success) setRequests(reqsRes.requests);
      if (feedRes.success) setFeedbacks(feedRes.feedbacks);
    } catch (err) {
      console.warn('Failed to load admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const handleToggleUser = async (userId) => {
    setActionLoading(true);
    try {
      await toggleAdminUserStatus(userId);
      await fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to toggle status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveRequest = async (requestId, action = 'approve') => {
    setActionLoading(true);
    try {
      await resolveAdminRequest(requestId, action);
      await fetchAllAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered lists by search
  const filteredUsers = users.filter(
    (u) =>
      (u.username || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredRequests = requests.filter((r) =>
    (r.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (r.message || '').toLowerCase().includes(search.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter((f) =>
    (f.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (f.feedbackmessage || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Admin Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#fbbf24',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '0.3rem',
              }}
            >
              <ShieldAlert size={16} />
              System Administration
            </div>
            <h1 style={{ fontSize: '2.2rem' }}>Admin Control Center</h1>
          </div>

          <button onClick={fetchAllAdminData} className="btn btn-secondary" disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            Refresh Data
          </button>
        </div>

        {/* Stats Summary Cards */}
        {stats && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Users</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc' }}>
                {stats.totalUsers}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Accounts</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                {stats.activeUsers}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deactivated Users</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                {stats.deactivatedUsers}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Reactivation Requests</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fbbf24' }}>
                {stats.pendingRequests}
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>User Feedbacks</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                {stats.totalFeedbacks}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setActiveTab('users')}
              className={`btn btn-secondary ${activeTab === 'users' ? 'active' : ''}`}
              style={{
                border: activeTab === 'users' ? '1px solid var(--accent-primary)' : '',
              }}
            >
              <Users size={16} />
              Users Directory ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`btn btn-secondary ${activeTab === 'requests' ? 'active' : ''}`}
              style={{
                border: activeTab === 'requests' ? '1px solid #fbbf24' : '',
              }}
            >
              <HelpCircle size={16} />
              Reactivation Requests ({requests.length})
            </button>

            <button
              onClick={() => setActiveTab('feedbacks')}
              className={`btn btn-secondary ${activeTab === 'feedbacks' ? 'active' : ''}`}
              style={{
                border: activeTab === 'feedbacks' ? '1px solid var(--accent-cyan)' : '',
              }}
            >
              <MessageSquare size={16} />
              Feedback & Ratings ({feedbacks.length})
            </button>
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '260px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Filter current view..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={16}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {/* Tab 1: Users Directory */}
        {activeTab === 'users' && (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Birth Year</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Languages</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr
                      key={u._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{u.username}</td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{u.email}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>{u.birthyear || '—'}</td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                        {u.spokenlanguage} ➔ {u.captionlanguage}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          className={`badge ${
                            u.status === 'activate' ? 'badge-emerald' : 'badge-rose'
                          }`}
                        >
                          {u.status === 'activate' ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleToggleUser(u._id)}
                          className={u.status === 'activate' ? 'btn btn-danger' : 'btn btn-success'}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                          disabled={actionLoading}
                        >
                          {u.status === 'activate' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Reactivation Requests */}
        {activeTab === 'requests' && (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Request Message</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Requested On</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No account reactivation requests pending.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr
                      key={req._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{req.email}</td>
                      <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', maxWidth: '350px' }}>
                        {req.message}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span
                          className={`badge ${
                            req.status === 'resolved' ? 'badge-emerald' : 'badge-primary'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(req.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        {req.status === 'pending' ? (
                          <button
                            onClick={() => handleResolveRequest(req._id, 'approve')}
                            className="btn btn-success"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            disabled={actionLoading}
                          >
                            <CheckCircle2 size={14} />
                            Reactivate User
                          </button>
                        ) : (
                          <span style={{ color: 'var(--accent-emerald)', fontSize: '0.85rem' }}>
                            Resolved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: User Feedbacks */}
        {activeTab === 'feedbacks' && (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-medium)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>User Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Rating</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Feedback Comments</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No feedback submissions found.
                    </td>
                  </tr>
                ) : (
                  filteredFeedbacks.map((f) => (
                    <tr
                      key={f._id}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        fontSize: '0.9rem',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>{f.email}</td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={15}
                              fill={s <= Number(f.rating) ? '#fbbf24' : 'none'}
                              color={s <= Number(f.rating) ? '#fbbf24' : '#4b5563'}
                            />
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: '#f8fafc', maxWidth: '400px' }}>
                        {f.feedbackmessage}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(f.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
