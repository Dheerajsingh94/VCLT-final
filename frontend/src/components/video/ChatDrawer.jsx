import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Download, MessageSquare } from 'lucide-react';
import { exportChatToPDF } from '../../utils/pdfExport';

export const ChatDrawer = ({ isOpen, onClose, messages = [], onSendMessage, roomName }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleDownloadPDF = () => {
    exportChatToPDF(roomName, messages);
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
          <MessageSquare size={18} color="var(--accent-primary)" />
          <span>In-Meeting Chat</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <button
            onClick={handleDownloadPDF}
            className="btn btn-secondary"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
            title="Download Chat as PDF"
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

      {/* Messages List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              color: 'var(--text-muted)',
              marginTop: '40%',
              fontSize: '0.875rem',
            }}
          >
            No messages yet. Send a message to start chatting!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                alignSelf: msg.sender?.includes('(Me)') ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                backgroundColor: msg.isSystem
                  ? 'rgba(255, 255, 255, 0.05)'
                  : msg.sender?.includes('(Me)')
                  ? 'var(--accent-primary)'
                  : 'rgba(30, 41, 59, 0.85)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '0.6rem 0.85rem',
                border: msg.isSystem ? '1px dashed var(--border-medium)' : 'none',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.75rem',
                  marginBottom: '2px',
                  color: msg.sender?.includes('(Me)') ? 'rgba(255,255,255,0.8)' : 'var(--accent-cyan)',
                  fontWeight: 600,
                }}
              >
                <span>{msg.sender}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.6)' }}>{msg.time}</span>
              </div>
              <div style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <input
          type="text"
          className="form-input"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ padding: '0.6rem 0.85rem', fontSize: '0.875rem' }}
        />
        <button
          type="submit"
          className="btn btn-primary"
          style={{ padding: '0 0.85rem' }}
          disabled={!inputText.trim()}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
