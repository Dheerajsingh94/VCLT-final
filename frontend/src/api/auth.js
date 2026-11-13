import api from './client';

export const registerUser = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

export const verifyOtpCode = async (data) => {
  const res = await api.post('/auth/verify-otp', data);
  return res.data;
};

export const resendOtpCode = async (data) => {
  const res = await api.post('/auth/resend-otp', data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

export const forgotPasswordRequest = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

export const verifyResetOtpCode = async (data) => {
  const res = await api.post('/auth/verify-reset-otp', data);
  return res.data;
};

export const resetPasswordConfirm = async (data) => {
  const res = await api.post('/auth/reset-password', data);
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post('/auth/logout');
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};
