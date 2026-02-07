import * as changeKeys from 'change-case/keys';
import { db } from '../models';
import { UpdateStreamerSettings } from '../schema/streamer';
import playerService from './player';

async function updateSettings(userId: string, body: UpdateStreamerSettings) {
  const { data, error } = await db
    .from('_streamer_settings')
    .update(changeKeys.snakeCase(body))
    .eq('player', userId)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  return await playerService.getPlayerByUserId(userId);
}

export default {
  updateSettings,
};
