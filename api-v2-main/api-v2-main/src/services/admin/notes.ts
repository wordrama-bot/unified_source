import { db } from '../../models';

export async function getModeratorNotes(playerId: string) {
  const { data, error } = await db
    .from('_moderator_notes')
    .select(`
      id,
      target_player_id,
      admin_player_id,
      note,
      created_at,
      metadata,
      admin:_players!_moderator_notes_admin_player_id_fkey (
        id,
        username,
        display_name
      )
    `)
    .eq('target_player_id', playerId)
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin.notes] getModeratorNotes error', error);
    throw new Error('Unable to load moderator notes.');
  }

  return data ?? [];
}

export async function addModeratorNote({
  targetPlayerId,
  adminPlayerId,
  note,
  requestIp,
  userAgent,
}: {
  targetPlayerId: string;
  adminPlayerId: string;
  note: string;
  requestIp?: string;
  userAgent?: string;
}) {
  const cleanNote = note.trim();

  if (!cleanNote) {
    throw new Error('Note is required.');
  }

  const { data, error } = await db
    .from('_moderator_notes')
    .insert({
      target_player_id: targetPlayerId,
      admin_player_id: adminPlayerId,
      note: cleanNote,
      metadata: {},
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[admin.notes] addModeratorNote error', error);
    throw new Error('Unable to add moderator note.');
  }

  await db.from('_moderation_actions').insert({
    action_type: 'NOTE_ADDED',
    target_user_id: targetPlayerId,
    reason: cleanNote,
    performed_by: adminPlayerId,
    target_type: 'PLAYER',
    target_id: targetPlayerId,
    after_value: data,
    request_ip: requestIp ?? null,
    user_agent: userAgent ?? null,
    metadata: {
      noteId: data?.id,
    },
  });

  return data;
}
