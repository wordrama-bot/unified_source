import { supabase } from '../../..';
import { sendMessage } from '../../../websocket';

export async function getNotifications(userId: string, isRead: boolean = false) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('notifications')
    .select()
    .eq('user_id', userId)
    .eq('read', isRead);
    
  if (!data) return {
    status: 404,
    statusText: 'No notifications'
  }

  return {
    data,
    status,
    statusText
  }
};

export async function addNotification(
  userId: string,
  type: string,
  message: string
) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('notifications')
    .insert({ 
      user_id: userId,
      type,
      message,
      read: false
    })
    .eq('user_id', userId)
    .select();

  if (data) {
    sendMessage(userId, 'notifications', data);
  }

  return {
    data, 
    error,
    status,
    statusText
  }
};

export async function dismissNotification(
  userId: string,
  id: number
) {
  const { error } = await supabase.from('notifications')
    .update({
      read: true
    })
    .eq('user_id', userId)
    .eq('id', id)
    .select();

    const { 
      data,
      status,
      statusText
    }: any = await getNotifications(userId);

  if (data) {
    sendMessage(userId, 'notifications', data);
  }

  return {
    data, 
    error,
    status,
    statusText
  }
};