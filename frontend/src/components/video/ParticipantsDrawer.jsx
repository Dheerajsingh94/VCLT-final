import React from 'react';
import { X, Users, UserCheck } from 'lucide-react';

export const ParticipantsDrawer = ({ isOpen, onClose, participants = [], localName }) => {
  if (!isOpen) return null;

  return (
    <div className="side-drawer">
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
          <Users size={18} color="var(--accent-cyan)" />
          <span>Participants ({participants.length || 1})</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          <X size={18} />
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem',
        }}
      >
        {/* Local user first */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--gradient-brand)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              {(localName || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{localName || 'You'} (You)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Host / Local Participant</div>
            </div>
          </div>
          <span className="badge badge-emerald">Online</span>
        </div>

        {/* Remote participants */}
        {participants
          .filter((p) => !p.name?.includes('(You)'))
          .map((participant) => (
            <div
              key={participant.uid}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                  }}
                >
                  {(participant.name || 'P').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{participant.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Connected via RTC/RTM</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-indicator" />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
