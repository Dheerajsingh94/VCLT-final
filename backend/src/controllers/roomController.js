import { RoomDetail } from '../models/RoomDetail.js';

export const getAgoraConfig = (req, res) => {
  const appId = process.env.AGORA_APP_ID || 'acfe33308b7040beb8d22822d438123f';
  res.status(200).json({
    success: true,
    appId,
  });
};

export const joinRoom = async (req, res) => {
  try {
    const { roomName, participantName } = req.body;
    const participant = participantName || req.user.username || req.user.email;

    if (!roomName) {
      return res.status(400).json({ success: false, message: 'Room name is required.' });
    }

    let room = await RoomDetail.findOne({ roomname: roomName.trim() });

    if (!room) {
      room = await RoomDetail.create({
        roomname: roomName.trim(),
        participants: [participant],
      });
    } else {
      if (!room.participants.includes(participant)) {
        room.participants.push(participant);
        await room.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Room joined successfully.',
      room,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error joining room.', error: error.message });
  }
};

export const getRoomInfo = async (req, res) => {
  try {
    const { roomName } = req.params;
    const room = await RoomDetail.findOne({ roomname: roomName.trim() });

    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found.' });
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error getting room info.', error: error.message });
  }
};
