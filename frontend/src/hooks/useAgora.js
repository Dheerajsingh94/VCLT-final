import { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';

export const useAgora = ({
  appId,
  roomId,
  displayName,
  speechCode,
  captionCode,
  onIncomingSpeech,
}) => {
  const [localAudioTrack, setLocalAudioTrack] = useState(null);
  const [localVideoTrack, setLocalVideoTrack] = useState(null);
  const [screenTrack, setScreenTrack] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState(null);

  const rtcClientRef = useRef(null);
  const rtmClientRef = useRef(null);
  const rtmChannelRef = useRef(null);
  const localVideoRef = useRef(null);

  const rtmUid = useRef(String(Math.floor(Math.random() * 1000000000))).current;

  // Initialize and join RTC + RTM
  useEffect(() => {
    if (!appId || !roomId) return;

    let mounted = true;

    const initCall = async () => {
      try {
        // --- 1. RTC Client Setup ---
        const rtc = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        rtcClientRef.current = rtc;

        // RTC event listeners
        rtc.on('user-published', async (user, mediaType) => {
          await rtc.subscribe(user, mediaType);
          if (mediaType === 'video') {
            setRemoteUsers((prev) => {
              if (prev.find((u) => u.uid === user.uid)) return prev;
              return [...prev, user];
            });
          }
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
        });

        rtc.on('user-unpublished', (user, mediaType) => {
          if (mediaType === 'video') {
            setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
          }
        });

        rtc.on('user-left', (user) => {
          setRemoteUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        });

        // Join RTC Channel
        await rtc.join(appId, roomId, null, null);

        // Try initializing Camera & Mic tracks
        try {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(
            { encoderConfig: 'music_standard' },
            { encoderConfig: '720p_2' }
          );

          if (mounted) {
            setLocalAudioTrack(audioTrack);
            setLocalVideoTrack(videoTrack);
            await rtc.publish([audioTrack, videoTrack]);
          }
        } catch (mediaErr) {
          console.warn('Microphone/Camera permission denied or unavailable:', mediaErr.message);
          // Allow joining in listen/observe mode
        }

        // --- 2. RTM Client Setup ---
        if (window.AgoraRTM) {
          try {
            const rtm = window.AgoraRTM.createInstance(appId);
            rtmClientRef.current = rtm;

            await rtm.login({ uid: rtmUid });
            await rtm.addOrUpdateChannelAttributes(roomId, {
              name: displayName || 'Participant',
            });

            const channel = rtm.createChannel(roomId);
            rtmChannelRef.current = channel;
            await channel.join();

            // Set up initial member count & roster
            const members = await channel.getMembers();
            setParticipants(members.map((m) => ({ uid: m, name: m === rtmUid ? `${displayName} (You)` : `User ${m.slice(-4)}` })));

            channel.on('MemberJoined', async (memberId) => {
              setParticipants((prev) => [
                ...prev,
                { uid: memberId, name: `User ${memberId.slice(-4)}` },
              ]);
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  sender: 'VCLT BOT',
                  text: `A new participant has joined the room.`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isSystem: true,
                },
              ]);
            });

            channel.on('MemberLeft', (memberId) => {
              setParticipants((prev) => prev.filter((p) => p.uid !== memberId));
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  sender: 'VCLT BOT',
                  text: `A participant left the room.`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isSystem: true,
                },
              ]);
            });

            channel.on('ChannelMessage', async (messageData, memberId) => {
              try {
                const data = JSON.parse(messageData.text);

                if (data.type === 'chat') {
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: Date.now() + Math.random(),
                      sender: data.sender || 'Participant',
                      text: data.text,
                      time: data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      isSystem: false,
                    },
                  ]);
                } else if (data.type === 'speech') {
                  if (onIncomingSpeech) {
                    onIncomingSpeech({
                      originalText: data.message,
                      speaker: data.displayName || 'Speaker',
                      speechCode: data.speechCode,
                    });
                  }
                }
              } catch (parseErr) {
                // Regular plain text chat fallback
                setMessages((prev) => [
                  ...prev,
                  {
                    id: Date.now() + Math.random(),
                    sender: `User ${memberId.slice(-4)}`,
                    text: messageData.text,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ]);
              }
            });
          } catch (rtmErr) {
            console.warn('Agora RTM initialization failed:', rtmErr.message);
          }
        }

        if (mounted) {
          setJoined(true);
        }
      } catch (err) {
        console.error('Call initialization error:', err);
        if (mounted) {
          setError(err.message || 'Failed to connect to video call server.');
        }
      }
    };

    initCall();

    return () => {
      mounted = false;
      // Clean up RTC
      if (localAudioTrack) {
        localAudioTrack.stop();
        localAudioTrack.close();
      }
      if (localVideoTrack) {
        localVideoTrack.stop();
        localVideoTrack.close();
      }
      if (screenTrack) {
        screenTrack.stop();
        screenTrack.close();
      }
      if (rtcClientRef.current) {
        rtcClientRef.current.leave();
      }
      // Clean up RTM
      if (rtmChannelRef.current) {
        rtmChannelRef.current.leave();
      }
      if (rtmClientRef.current) {
        rtmClientRef.current.logout();
      }
    };
  }, [appId, roomId]);

  // Toggle Mic
  const toggleMic = useCallback(async () => {
    if (localAudioTrack) {
      await localAudioTrack.setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    } else {
      setIsMicOn(!isMicOn);
    }
  }, [localAudioTrack, isMicOn]);

  // Toggle Camera
  const toggleCamera = useCallback(async () => {
    if (localVideoTrack) {
      await localVideoTrack.setEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    } else {
      setIsCameraOn(!isCameraOn);
    }
  }, [localVideoTrack, isCameraOn]);

  // Toggle Screen Share
  const toggleScreenShare = useCallback(async () => {
    const rtc = rtcClientRef.current;
    if (!rtc) return;

    if (!isScreenSharing) {
      try {
        const screen = await AgoraRTC.createScreenVideoTrack();
        setScreenTrack(screen);

        if (localVideoTrack) {
          await rtc.unpublish(localVideoTrack);
        }
        await rtc.publish(screen);
        setIsScreenSharing(true);

        screen.on('track-ended', async () => {
          await rtc.unpublish(screen);
          screen.close();
          setScreenTrack(null);
          setIsScreenSharing(false);
          if (localVideoTrack && isCameraOn) {
            await rtc.publish(localVideoTrack);
          }
        });
      } catch (err) {
        console.warn('Screen sharing cancelled or error:', err.message);
      }
    } else {
      if (screenTrack) {
        await rtc.unpublish(screenTrack);
        screenTrack.close();
        setScreenTrack(null);
      }
      setIsScreenSharing(false);
      if (localVideoTrack && isCameraOn) {
        await rtc.publish(localVideoTrack);
      }
    }
  }, [isScreenSharing, screenTrack, localVideoTrack, isCameraOn]);

  // Send Chat message via Agora RTM
  const sendChatMessage = useCallback(
    async (text) => {
      if (!text || !text.trim()) return;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const msgObj = {
        type: 'chat',
        text: text.trim(),
        sender: displayName || 'Me',
        time,
      };

      if (rtmChannelRef.current) {
        try {
          await rtmChannelRef.current.sendMessage({ text: JSON.stringify(msgObj) });
        } catch (e) {
          console.warn('Failed to send RTM message:', e.message);
        }
      }

      // Add to local chat list
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          sender: `${displayName || 'You'} (Me)`,
          text: text.trim(),
          time,
        },
      ]);
    },
    [displayName]
  );

  // Broadcast Speech Transcript via Agora RTM
  const broadcastSpeech = useCallback(
    async (transcript) => {
      if (!transcript || !transcript.trim()) return;

      const speechObj = {
        type: 'speech',
        message: transcript.trim(),
        displayName: displayName || 'Speaker',
        speechCode: speechCode || 'en-US',
      };

      if (rtmChannelRef.current) {
        try {
          await rtmChannelRef.current.sendMessage({ text: JSON.stringify(speechObj) });
        } catch (e) {
          console.warn('Failed to broadcast speech via RTM:', e.message);
        }
      }

      // Also trigger locally for own captions if needed
      if (onIncomingSpeech) {
        onIncomingSpeech({
          originalText: transcript.trim(),
          speaker: `${displayName || 'You'} (Me)`,
          speechCode: speechCode || 'en-US',
        });
      }
    },
    [displayName, speechCode, onIncomingSpeech]
  );

  return {
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
  };
};
