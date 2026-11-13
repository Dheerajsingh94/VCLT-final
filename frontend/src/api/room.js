import api from './client';

export const getAgoraConfig = async () => {
  const res = await api.get('/rooms/config');
  return res.data;
};

export const joinRoomCall = async (roomName, participantName) => {
  const res = await api.post('/rooms/join', { roomName, participantName });
  return res.data;
};

export const getRoomInfo = async (roomName) => {
  const res = await api.get(`/rooms/info/${roomName}`);
  return res.data;
};
