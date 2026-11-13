import React from 'react';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  PhoneOff,
  MessageSquare,
  FileText,
  Mic2,
  Users,
} from 'lucide-react';

export const ControlsBar = ({
  isMicOn,
  isCameraOn,
  isScreenSharing,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onLeaveCall,
  activeDrawer,
  onToggleDrawer,
  unreadChatCount = 0,
  notesCount = 0,
  participantCount = 1,
  onOpenRecorder,
}) => {
  return (
    <div className="controls-bar">
      {/* Left side: Participants & Audio Recorder Tool */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <button
          onClick={() => onToggleDrawer('participants')}
          className={`btn-control ${activeDrawer === 'participants' ? 'active' : ''}`}
          title="Meeting Participants"
        >
          <Users size={20} />
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
          {participantCount} {participantCount === 1 ? 'person' : 'people'}
        </span>

        <button
          onClick={onOpenRecorder}
          className="btn-control"
          title="Voice Audio Recorder Tool"
          style={{ marginLeft: '0.5rem' }}
        >
          <Mic2 size={20} color="var(--accent-cyan)" />
        </button>
      </div>

      {/* Middle: Core Media Calling Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Mic Toggle */}
        <button
          onClick={onToggleMic}
          className={`btn-control ${!isMicOn ? 'danger-active' : 'active'}`}
          title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        {/* Camera Toggle */}
        <button
          onClick={onToggleCamera}
          className={`btn-control ${!isCameraOn ? 'danger-active' : ''}`}
          title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {isCameraOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* Screen Share Toggle */}
        <button
          onClick={onToggleScreenShare}
          className={`btn-control ${isScreenSharing ? 'active' : ''}`}
          title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
        >
          <ScreenShare size={20} />
        </button>

        {/* End / Leave Meeting Call */}
        <button
          onClick={onLeaveCall}
          className="btn btn-danger"
          style={{
            padding: '0 1.25rem',
            height: '48px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--accent-rose)',
            color: '#ffffff',
            fontWeight: 700,
            gap: '0.5rem',
          }}
          title="Leave Meeting"
        >
          <PhoneOff size={18} />
          <span>Leave</span>
        </button>
      </div>

      {/* Right: Notes & Chat Drawers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {/* Notes Toggle */}
        <button
          onClick={() => onToggleDrawer('notes')}
          className={`btn-control ${activeDrawer === 'notes' ? 'active' : ''}`}
          title="Meeting Notes & Live Captions"
          style={{ position: 'relative' }}
        >
          <FileText size={20} />
          {notesCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-emerald)',
                color: '#000',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-full)',
                padding: '1px 6px',
              }}
            >
              {notesCount}
            </span>
          )}
        </button>

        {/* Chat Toggle */}
        <button
          onClick={() => onToggleDrawer('chat')}
          className={`btn-control ${activeDrawer === 'chat' ? 'active' : ''}`}
          title="Meeting Chat"
          style={{ position: 'relative' }}
        >
          <MessageSquare size={20} />
          {unreadChatCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--accent-primary)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-full)',
                padding: '1px 6px',
              }}
            >
              {unreadChatCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
