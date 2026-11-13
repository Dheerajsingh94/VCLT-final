import translate from '@iamtraction/google-translate';

// High-reliability translation helper
const performTranslation = async (text, sourceLang, targetLang) => {
  // Strategy 1: MyMemory Translated API (fast, reliable, free public REST endpoint)
  try {
    const pair = `${sourceLang === 'auto' ? 'en' : sourceLang}|${targetLang}`;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(pair)}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (response.ok) {
      const data = await response.json();
      if (data && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
    }
  } catch (err) {
    console.warn('MyMemory translation fallback triggered:', err.message);
  }

  // Strategy 2: @iamtraction/google-translate (original library)
  try {
    const res = await translate(text, {
      from: sourceLang === 'auto' ? undefined : sourceLang,
      to: targetLang,
    });
    if (res && res.text) {
      return res.text;
    }
  } catch (err) {
    console.warn('@iamtraction/google-translate fallback:', err.message);
  }

  // Strategy 3: Graceful fallback with original text
  return text;
};

export const translateText = async (req, res) => {
  try {
    const { text, from, to } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, message: 'Text to translate is required.' });
    }

    const sourceLang = (from || 'auto').split('-')[0].toLowerCase();
    const targetLang = (to || 'en').split('-')[0].toLowerCase();

    if (sourceLang === targetLang) {
      return res.status(200).json({
        success: true,
        originalText: text,
        translatedText: text,
        from: sourceLang,
        to: targetLang,
      });
    }

    const translated = await performTranslation(text, sourceLang, targetLang);

    res.status(200).json({
      success: true,
      originalText: text,
      translatedText: translated,
      from: sourceLang,
      to: targetLang,
    });
  } catch (error) {
    console.error('Translation error:', error.message);
    res.status(200).json({
      success: false,
      originalText: req.body.text || '',
      translatedText: req.body.text || '',
      error: error.message,
    });
  }
};

export const translateLegacy = async (req, res) => {
  try {
    const { message, speechcode, captioncode } = req.params;

    if (!message) return res.send('');

    const sourceLang = (speechcode || 'en').split('-')[0].toLowerCase();
    const targetLang = (captioncode || 'hi').split('-')[0].toLowerCase();

    if (sourceLang === targetLang) return res.send(message);

    const translated = await performTranslation(message, sourceLang, targetLang);
    res.send(translated);
  } catch (error) {
    console.error('Legacy translation error:', error.message);
    res.send(req.params.message || '');
  }
};
