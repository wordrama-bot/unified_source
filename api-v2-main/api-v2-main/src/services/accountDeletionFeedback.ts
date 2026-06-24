import { db } from '../models';

async function createFeedback(
  reason?: string | null,
  comments?: string | null,
) {
  const { data, error } = await db
    .from('_account_deletion_feedback')
    .insert({
      reason,
      comments,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

export default {
  createFeedback,
};
