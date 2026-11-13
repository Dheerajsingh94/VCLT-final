import api from './client';

export const getAdminStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const toggleAdminUserStatus = async (id) => {
  const res = await api.patch(`/admin/users/${id}/toggle-status`);
  return res.data;
};

export const getAdminRequests = async () => {
  const res = await api.get('/admin/requests');
  return res.data;
};

export const resolveAdminRequest = async (id, action = 'approve') => {
  const res = await api.patch(`/admin/requests/${id}/resolve`, { action });
  return res.data;
};

export const getAdminFeedbacks = async () => {
  const res = await api.get('/admin/feedbacks');
  return res.data;
};
