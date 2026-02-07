// Services
import { getNotifications } from '../api/v1/notifications/notifications.service';

export default function getNotificationsWS(io, socket, userId){
  socket.on('get-notifications', async () => {
    const { data, error }: any = await getNotifications(userId);
    if (!data) return;
    io.to(userId).emit('notifications', data);
  });
};
