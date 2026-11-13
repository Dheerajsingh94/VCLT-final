import api from './client';

export const getUserProfile = async () => {
  const res = await api.get('/user/profile');
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await api.patch('/user/profile', data);
  return res.data;
};

export const uploadProfilePhoto = async (formData) => {
  const res = await api.post('/user/profile-picture', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getUserLanguages = async () => {
  const res = await api.get('/user/languages');
  return res.data;
};

export const updateUserLanguages = async (data) => {
  const res = await api.patch('/user/languages', data);
  return res.data;
};

export const deactivateMyAccount = async () => {
  const res = await api.patch('/user/deactivate');
  return res.data;
};

export const requestReactivation = async (data) => {
  const res = await api.post('/user/reactivation-request', data);
  return res.data;
};

export const submitUserFeedback = async (data) => {
  const res = await api.post('/user/feedback', data);
  return res.data;
};

export const getUserHistory = async () => {
  const res = await api.get('/user/call-history');
  return res.data;
};
