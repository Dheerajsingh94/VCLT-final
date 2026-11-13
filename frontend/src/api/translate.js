import api from './client';

export const translateMessage = async (text, from, to) => {
  const res = await api.post('/translate', { text, from, to });
  return res.data;
};
