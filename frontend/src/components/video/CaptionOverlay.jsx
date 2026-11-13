import React from 'react';
import { Sparkles, Globe } from 'lucide-react';

export const CaptionOverlay = ({ caption }) => {
  if (!caption || !caption.text) return null;

  return (
    <div className="caption-overlay">
      <div className="caption-speaker">
        <Sparkles size={14} color="var(--accent-cyan)" />
        <span>{caption.speaker || 'Speaker'}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
          • Live AI Translation
        </span>
      </div>
      <div className="caption-text">{caption.text}</div>
      {caption.original && caption.original !== caption.text && (
        <div className="caption-original">
          Original: &ldquo;{caption.original}&rdquo;
        </div>
      )}
    </div>
  );
};
