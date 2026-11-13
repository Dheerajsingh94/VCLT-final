import React, { useRef, useEffect } from 'react';
import { X, Download, FileText, Sparkles } from 'lucide-react';
import { exportNotesToPDF } from '../../utils/pdfExport';

export const NotesDrawer = ({ isOpen, onClose, notes = [], roomName }) => {
  const notesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [notes, isOpen]);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    exportNotesToPDF(roomName, notes);
  };

  return (
    <div className="side-drawer">
      {/* Header */}
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
          <FileText size={18} color="var(--accent-emerald)" />
          <span>Meeting Notes & Minutes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Download Notes as PDF"
          >
            <Download size={14} />
            PDF
          </button>
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
      </div>

      {/* Info banner */}
      <div
        style={{
          padding: '0.65rem 1rem',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
          fontSize: '0.75rem',
          color: '#6ee7b7',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <Sparkles size={14} />
        Live speech transcripts and AI translations are automatically logged below.
      </div>

      {/* Notes log */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}
      >
        {notes.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginTop: '40%',
              fontSize: '0.875rem',
            }}
          >
            No meeting notes recorded yet. Speak while the mic is active to generate notes!
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.75rem',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                  {note.speaker || 'Speaker'}
                </span>
                <span style={{ color: 'var(--text-muted)' }}>{note.time}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', lineHeight: 1.4 }}>
                {note.text}
              </div>
              {note.original && note.original !== note.text && (
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '4px',
                    fontStyle: 'italic',
                  }}
                >
                  Original: {note.original}
                </div>
              )}
            </div>
          ))
        )}
        <div ref={notesEndRef} />
      </div>
    </div>
  );
};
