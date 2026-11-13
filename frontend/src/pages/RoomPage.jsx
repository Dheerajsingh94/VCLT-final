import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getAgoraConfig, joinRoomCall } from '../api/room';
import { translateMessage } from '../api/translate';
import { useAgora } from '../hooks/useAgora';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { getSpeechCode, getCaptionCode } from '../utils/languages';

import { ControlsBar } from '../components/video/ControlsBar';
import { CaptionOverlay } from '../components/video/CaptionOverlay';
import { ChatDrawer } from '../components/video/ChatDrawer';
import { NotesDrawer } from '../components/video/NotesDrawer';
import { ParticipantsDrawer } from '../components/video/ParticipantsDrawer';
import { AudioRecorderModal } from '../components/video/AudioRecorderModal';
import { Video, Mic, Globe, Sparkles, Maximize2, User } from 'lucide-react';

export const RoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [appId, setAppId] = useState('');
  const [activeDrawer, setActiveDrawer] = useState(null); // 'chat' | 'notes' | 'participants' | null
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [focusedUid, setFocusedUid] = useState(null); // For spotlight view

  // Live subtitles and meeting notes state
  const [currentCaption, setCurrentCaption] = useState(null);
  const [meetingNotes, setMeetingNotes] = useState([]);
  const captionTimerRef = useRef(null);

  const displayName =
    sessionStorage.getItem('vclt_display_name') || user?.username || 'Participant';

  const userSpeechCode = getSpeechCode(user?.spokenlanguage || 'English');
  const userCaptionCode = getCaptionCode(user?.captionlanguage || 'Hindi');

  // Handle incoming speech broadcast (local or remote participant)
  const handleIncomingSpeech = useCallback(
    async ({ originalText, speaker, speechCode }) => {
      try {
        // Translate text into this user's preferred caption language
        const res = await translateMessage(
          originalText,
          speechCode || 'auto',
          userCaptionCode
        );

        const translatedText = res.translatedText || originalText;
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Update live subtitle overlay
        setCurrentCaption({
          speaker,
          text: translatedText,
          original: originalText,
        });

        // Clear subtitle after 6 seconds
        if (captionTimerRef.current) clearTimeout(captionTimerRef.current);
        captionTimerRef.current = setTimeout(() => {
          setCurrentCaption(null);
        }, 6000);

        // Auto-log to meeting notes (no DOM duplication bug!)
        setMeetingNotes((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            time,
            speaker,
            text: translatedText,
            original: originalText,
          },
        ]);
      } catch (err) {
        console.warn('Speech translation error:', err.message);
      }
    },
    [userCaptionCode]
  );

  // Initialize room registration and Agora configuration
  useEffect(() => {
    let mounted = true;

    const setupRoom = async () => {
      try {
        // Register participation in database
        await joinRoomCall(roomId, displayName);

        // Fetch Agora App ID
        const config = await getAgoraConfig();
        if (mounted && config.success) {
          setAppId(config.appId);
        }
      } catch (err) {
        console.error('Room setup error:', err);
      }
    };

    setupRoom();

    return () => {
      mounted = false;
      if (captionTimerRef.current) clearTimeout(captionTimerRef.current);
    };
  }, [roomId, displayName]);

  // Agora Real-Time Call Hook
  const {
    localAudioTrack,
    localVideoTrack,
    screenTrack,
    localVideoRef,
    isMicOn,
    isCameraOn,
    isScreenSharing,
    remoteUsers,
    messages,
    participants,
    joined,
    error,
    toggleMic,
    toggleCamera,
    toggleScreenShare,
    sendChatMessage,
    broadcastSpeech,
  } = useAgora({
    appId,
    roomId,
    displayName,
    speechCode: userSpeechCode,
    captionCode: userCaptionCode,
    onIncomingSpeech: handleIncomingSpeech,
  });

  // Client Web Speech Recognition Hook (triggers while mic is active)
  useSpeechRecognition({
    isListening: isMicOn && joined,
    speechCode: userSpeechCode,
    onTranscript: (transcript) => {
      broadcastSpeech(transcript);
    },
  });

  // Attach local video track to DOM
  const localVideoContainerRef = useRef(null);
  useEffect(() => {
    if (localVideoContainerRef.current) {
      if (isScreenSharing && screenTrack) {
        screenTrack.play(localVideoContainerRef.current);
      } else if (localVideoTrack && isCameraOn) {
        localVideoTrack.play(localVideoContainerRef.current);
      }
    }
  }, [localVideoTrack, screenTrack, isScreenSharing, isCameraOn]);

  const handleLeaveCall = () => {
    navigate('/dashboard');
  };

  const handleToggleDrawer = (drawerName) => {
    setActiveDrawer((prev) => (prev === drawerName ? null : drawerName));
  };

  const allParticipantsCount = 1 + remoteUsers.length;

  return (
    <div className="video-room-container">
      {/* Main Video Stage */}
      <div className="video-stage">
        {/* Top Floating Room Header */}
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 30,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '6px 14px',
              background: 'rgba(10, 14, 23, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 600,
              pointerEvents: 'auto',
            }}
          >
            <span className="pulse-indicator" />
            <span>Room: {roomId}</span>
          </div>

          <div
            style={{
              padding: '6px 14px',
              background: 'rgba(10, 14, 23, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.8rem',
              color: 'var(--accent-cyan)',
              pointerEvents: 'auto',
            }}
          >
            <Globe size={14} />
            <span>
              Speaking: {user?.spokenlanguage || 'English'} ➔ Subtitles:{' '}
              {user?.captionlanguage || 'Hindi'}
            </span>
          </div>
        </div>

        {/* Video Grid */}
        <div
          className={`video-grid ${
            focusedUid
              ? 'grid-1'
              : allParticipantsCount === 1
              ? 'grid-1'
              : allParticipantsCount === 2
              ? 'grid-2'
              : allParticipantsCount === 3
              ? 'grid-3'
              : 'grid-many'
          }`}
        >
          {/* Local User Tile */}
          {(!focusedUid || focusedUid === 'local') && (
            <div
              className={`video-tile ${focusedUid === 'local' ? 'focused' : ''}`}
              onClick={() => setFocusedUid(focusedUid === 'local' ? null : 'local')}
              title="Click to spotlight"
              style={{ cursor: 'pointer' }}
            >
              <div
                ref={localVideoContainerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  display: isCameraOn || isScreenSharing ? 'block' : 'none',
                }}
              />

              {!isCameraOn && !isScreenSharing && (
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '50%',
                      background: 'var(--gradient-brand)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.75rem',
                      fontWeight: 700,
                      margin: '0 auto 0.75rem',
                    }}
                  >
                    {(displayName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Camera is Turned Off
                  </div>
                </div>
              )}

              {/* Local Participant Badge */}
              <div className="video-overlay-info">
                <span>{displayName} (You)</span>
                {isMicOn ? (
                  <Mic size={14} color="var(--accent-emerald)" />
                ) : (
                  <span style={{ color: 'var(--accent-rose)', fontSize: '0.75rem' }}>Muted</span>
                )}
              </div>
            </div>
          )}

          {/* Remote Participants Tiles */}
          {remoteUsers.map((remoteUser) => {
            if (focusedUid && focusedUid !== remoteUser.uid) return null;

            return (
              <RemoteUserTile
                key={remoteUser.uid}
                user={remoteUser}
                isFocused={focusedUid === remoteUser.uid}
                onToggleFocus={() =>
                  setFocusedUid(focusedUid === remoteUser.uid ? null : remoteUser.uid)
                }
              />
            );
          })}
        </div>

        {/* Live Subtitle Caption Overlay */}
        <CaptionOverlay caption={currentCaption} />

        {/* Bottom Meeting Controls Bar */}
        <ControlsBar
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          isScreenSharing={isScreenSharing}
          onToggleMic={toggleMic}
          onToggleCamera={toggleCamera}
          onToggleScreenShare={toggleScreenShare}
          onLeaveCall={handleLeaveCall}
          activeDrawer={activeDrawer}
          onToggleDrawer={handleToggleDrawer}
          unreadChatCount={messages.length}
          notesCount={meetingNotes.length}
          participantCount={allParticipantsCount}
          onOpenRecorder={() => setRecorderOpen(true)}
        />
      </div>

      {/* Side Drawers */}
      <ChatDrawer
        isOpen={activeDrawer === 'chat'}
        onClose={() => setActiveDrawer(null)}
        messages={messages}
        onSendMessage={sendChatMessage}
        roomName={roomId}
      />

      <NotesDrawer
        isOpen={activeDrawer === 'notes'}
        onClose={() => setActiveDrawer(null)}
        notes={meetingNotes}
        roomName={roomId}
      />

      <ParticipantsDrawer
        isOpen={activeDrawer === 'participants'}
        onClose={() => setActiveDrawer(null)}
        participants={participants}
        localName={displayName}
      />

      {/* Voice Audio Recorder Modal */}
      <AudioRecorderModal isOpen={recorderOpen} onClose={() => setRecorderOpen(false)} />
    </div>
  );
};

// Component for rendering a Remote Participant Tile
const RemoteUserTile = ({ user, isFocused, onToggleFocus }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && user.videoTrack) {
      user.videoTrack.play(videoRef.current);
    }
  }, [user.videoTrack]);

  return (
    <div
      className={`video-tile ${isFocused ? 'focused' : ''}`}
      onClick={onToggleFocus}
      title="Click to spotlight"
      style={{ cursor: 'pointer' }}
    >
      <div ref={videoRef} style={{ width: '100%', height: '100%' }} />

      {!user.videoTrack && (
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.75rem',
              fontWeight: 700,
              margin: '0 auto 0.75rem',
            }}
          >
            U
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Participant Video Off
          </div>
        </div>
      )}

      <div className="video-overlay-info">
        <span>Participant {String(user.uid).slice(-4)}</span>
      </div>
    </div>
  );
};
