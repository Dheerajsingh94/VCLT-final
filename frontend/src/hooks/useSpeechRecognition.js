import { useEffect, useRef } from 'react';

export const useSpeechRecognition = ({ isListening, speechCode, onTranscript }) => {
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(isListening);
  const speechCodeRef = useRef(speechCode);
  const onTranscriptRef = useRef(onTranscript);

  isListeningRef.current = isListening;
  speechCodeRef.current = speechCode;
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Web Speech API is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = speechCodeRef.current || 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      if (transcript && transcript.trim()) {
        if (onTranscriptRef.current) {
          onTranscriptRef.current(transcript.trim());
        }
      }
    };

    recognition.onerror = (event) => {
      // Ignore common non-fatal speech events
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('Speech recognition error:', event.error);
      }
    };

    recognition.onend = () => {
      // If mic is still supposed to be listening, automatically restart
      if (isListeningRef.current && recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          // Ignore if already active
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.stop();
      } catch {
        // Ignore
      }
      recognitionRef.current = null;
    };
  }, [speechCode]);

  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      try {
        recognitionRef.current.lang = speechCode || 'en-US';
        recognitionRef.current.start();
      } catch (err) {
        // Can throw if already started
      }
    } else {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        // Ignore
      }
    }
  }, [isListening, speechCode]);
};
