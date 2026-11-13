export const SUPPORTED_LANGUAGES = [
  { name: 'English', speechCode: 'en-US', captionCode: 'en', native: 'English' },
  { name: 'Hindi', speechCode: 'hi-IN', captionCode: 'hi', native: 'हिन्दी' },
  { name: 'Marathi', speechCode: 'mr-IN', captionCode: 'mr', native: 'मराठी' },
  { name: 'Tamil', speechCode: 'ta-IN', captionCode: 'ta', native: 'தமிழ்' },
  { name: 'Gujarati', speechCode: 'gu-IN', captionCode: 'gu', native: 'ગુજરાતી' },
  { name: 'Telugu', speechCode: 'te-IN', captionCode: 'te', native: 'తెలుగు' },
  { name: 'Bengali', speechCode: 'bn-IN', captionCode: 'bn', native: 'বাংলা' },
  { name: 'Kannada', speechCode: 'kn-IN', captionCode: 'kn', native: 'ಕನ್ನಡ' },
  { name: 'Malayalam', speechCode: 'ml-IN', captionCode: 'ml', native: 'മലയാളം' },
];

export const getCaptionCode = (languageName) => {
  const found = SUPPORTED_LANGUAGES.find(
    (l) => l.name.toLowerCase() === (languageName || '').toLowerCase()
  );
  return found ? found.captionCode : 'en';
};

export const getSpeechCode = (languageName) => {
  const found = SUPPORTED_LANGUAGES.find(
    (l) => l.name.toLowerCase() === (languageName || '').toLowerCase()
  );
  return found ? found.speechCode : 'en-US';
};
