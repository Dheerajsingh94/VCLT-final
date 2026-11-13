import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserHistory } from '../api/user';
import { History, Video, Search, Calendar, Users, ArrowRight } from 'lucide-react';

export const CallHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getUserHistory();
        if (res.success && res.history) {
          setHistory(res.history);
        }
      } catch (err) {
        console.warn('Error fetching call history:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter((item) =>
    (item.roomname || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
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
            <h1 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <History size={28} color="var(--accent-primary)" />
              Call Records & History
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Review your previous video meeting sessions and easily rejoin active rooms.
            </p>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', minWidth: '260px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search rooms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Loading call records...
          </div>
        ) : filteredHistory.length === 0 ? (
          <div
            className="glass-panel"
            style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}
          >
            <Video size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '0.5rem' }}>
              No Meeting Records Found
            </h3>
            <p style={{ maxWidth: '400px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
              {search ? 'No call matching your search query.' : 'You have not joined any video rooms yet.'}
            </p>
            <Link to="/lobby" className="btn btn-primary">
              Start Your First Meeting
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredHistory.map((call) => (
              <div
                key={call._id}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    <Video size={24} />
                  </div>
                  <div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '2px' }}>
                      Room Code: {call.roomname}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {call.creationdate}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={13} />
                        {call.participants?.length || 1} participant(s)
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/room/${encodeURIComponent(call.roomname)}`}
                  className="btn btn-secondary"
                  style={{ gap: '0.5rem' }}
                >
                  <span>Rejoin Room</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
