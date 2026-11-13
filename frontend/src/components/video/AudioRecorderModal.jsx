import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Mic, Square, Play, Download, Trash2 } from 'lucide-react';

export const AudioRecorderModal = ({ isOpen, onClose }) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recordTime, setRecordTime] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setRecordTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg; codecs=opus' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordTime(0);
      setAudioUrl(null);
    } catch (err) {
      alert(`Could not start audio recorder: ${err.message}`);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetRecording = () => {
    setAudioUrl(null);
    setRecordTime(0);
    setRecording(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="In-Meeting Voice Audio Recorder">
      <div style={{ textAlign: 'center', padding: '1rem 0' }}>
        {/* Visual Record Orb */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: recording ? 'rgba(244, 63, 94, 0.2)' : 'rgba(99, 102, 241, 0.15)',
            border: `2px solid ${recording ? 'var(--accent-rose)' : 'var(--accent-primary)'}`,
            boxShadow: recording ? '0 0 24px rgba(244, 63, 94, 0.4)' : 'none',
            transition: 'all 0.3s ease',
          }}
        >
          <Mic
            size={40}
            color={recording ? 'var(--accent-rose)' : 'var(--accent-primary)'}
          />
        </div>

        {/* Timer */}
        <div
          style={{
            fontSize: '1.75rem',
            fontWeight: 700,
            fontFamily: 'monospace',
            marginBottom: '0.5rem',
            color: recording ? 'var(--accent-rose)' : 'var(--text-primary)',
          }}
        >
          {formatTimer(recordTime)}
        </div>

        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {recording
            ? 'Recording your voice note...'
            : audioUrl
            ? 'Voice note recorded successfully!'
            : 'Click Start Recording to record voice clips during the call.'}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {!recording && !audioUrl && (
            <button onClick={startRecording} className="btn btn-primary" style={{ padding: '0.7rem 1.5rem' }}>
              <Mic size={18} />
              Start Recording
            </button>
          )}

          {recording && (
            <button
              onClick={stopRecording}
              className="btn btn-danger"
              style={{
                padding: '0.7rem 1.5rem',
                background: 'var(--accent-rose)',
                color: '#fff',
              }}
            >
              <Square size={18} />
              Stop Recording
            </button>
          )}

          {audioUrl && (
            <>
              <a
                href={audioUrl}
                download={`vclt_voice_note_${Date.now()}.ogg`}
                className="btn btn-success"
                style={{ padding: '0.7rem 1.25rem' }}
              >
                <Download size={18} />
                Download Audio (.ogg)
              </a>
              <button onClick={resetRecording} className="btn btn-secondary" style={{ padding: '0.7rem 1rem' }}>
                <Trash2 size={18} />
                Discard
              </button>
            </>
          )}
        </div>

        {/* Audio Player playback preview */}
        {audioUrl && (
          <div style={{ marginTop: '1rem' }}>
            <audio src={audioUrl} controls style={{ width: '100%', borderRadius: 'var(--radius-md)' }} />
          </div>
        )}
      </div>
    </Modal>
  );
};
