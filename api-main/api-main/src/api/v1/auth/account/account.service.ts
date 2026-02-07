import { generate } from 'randomstring';
import { supabase, redisClient } from '../../../../';
import { sendMessage } from '../../../../websocket';
import { getTotalGamesPlayed } from '../../games/wordle/stats/stats.service';

export async function generateLinkCode() {
  return generate({
    length: 10,
    charset: 'alphanumeric',
    capitalization: 'lowercase'
  })
}

export async function getProfile(userId: string) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .select()
    .eq('user_id', userId)
    .single();

  if (!data) return {
    status: 404,
    statusText: 'Profile not found'
  }

  return {
    data,
    status,
    statusText
  }
};

export async function getPublicProfile(userId: string) {
  if (process.env.CACHE_ENABLED === 'true') {
    const cache = await redisClient.get(`publicProfile_${userId}`);
    if (cache) return JSON.parse(cache); 
  }
  let username = 'Anonymous Player';
  let profileImage = '/default.jpeg';
  const identity = await supabase.auth.admin.getUserById(userId);
  const stats = await getTotalGamesPlayed(userId);
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .select('level, xp, xp_to_next_level, username, profile_image')
    .eq('user_id', userId)
    .single();

  if (!data) return {
    status: 404,
    statusText: 'Profile not found'
  }

  if (
    data.username &&
    data.username !== ''
  ) {
    username = data.username;
  }

  if (
    data.profile_image &&
    data.profile_image !== ''
  ) {
    profileImage = data.profile_image;
  } else if (
    identity?.data?.user?.user_metadata?.customProfileImage
  ) {
    profileImage = identity?.data?.user?.user_metadata?.customProfileImage;
  } else if (
    identity?.data?.user?.user_metadata?.avatar_url
  ) {
    profileImage = identity?.data?.user?.user_metadata?.avatar_url;
  }

  if (process.env.CACHE_ENABLED === 'true') {
    await redisClient.setEx(`publicProfile_${userId}`, 60, JSON.stringify({
      data: {
        ...data,
        username,
        profile_image: profileImage,
        stats: stats?.data ? {
          ...stats.data
        } : {
          games_played: 0,
          games_lost: 0,
          games_won: 0
        }
      },
      status,
      statusText
    }));
  }

  return {
    data: {
      ...data,
      username,
      profile_image: profileImage,
      stats: stats?.data ? {
        ...stats.data
      } : {
        games_played: 0,
        games_lost: 0,
        games_won: 0
      }
    },
    status,
    statusText
  }
};

export async function getProfileFromDiscordUserId(discordUserId: string) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .select()
    .eq('discord_user_id', discordUserId)
    .single();

  if (!data) return {
    status: 404,
    statusText: 'Profile not found'
  }

  return {
    data,
    status,
    statusText
  }
};

export async function getProfileFromDiscordLinkCode(discordLinkCode: string) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .select()
    .eq('discord_link_code', discordLinkCode)
    .single();

  if (!data) return {
    status: 404,
    statusText: 'Profile not found'
  }

  return {
    data,
    status,
    statusText
  }
};

export async function checkUsernameAvailablity(username: string) {
  const { 
    data, 
    error
  } = await supabase.from('profiles')
    .select()
    .eq('sanitized_username', username.toLowerCase())
    .single();

  if (!data) return {
    data,
    status: 200,
    statusText: 'Username is available'
  }

  return {
    data,
    status: 400,
    statusText: 'Username taken'
  }
};

export async function checkDiscordLinkCode(discordLinkCode: string) {
  const { 
    data, 
    error
  } = await supabase.from('profiles')
    .select()
    .eq('discord_link_code', discordLinkCode.toLowerCase())
    .single();

  if (data) return {
    data,
    status: 200,
    statusText: 'Code is valid'
  }

  return {
    data,
    status: 404,
    statusText: 'Code is invalid'
  }
};

export async function updateProfile(
  userId: string,
  firstname: string = undefined,
  lastname: string = undefined,
  profileImage: string = undefined,
) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .update({ 
      firstname,
      lastname,
      profile_image: profileImage
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (data) {
    sendMessage(userId, 'profile', data);
  }

  return {
    data, 
    error,
    status,
    statusText
  }
};

export async function updateSetupStepperState(
  userId: string,
) {
  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .update({ 
      account_setup_complete: true
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (data) {
    sendMessage(userId, 'profile', data);
  }

  return {
    data, 
    error,
    status,
    statusText
  }
};

export async function updateXpLevel(userId, xp, level, xpToNextLevel) {
  const { 
    data, 
    error,
    status,
    statusText 
  } = await supabase.from('profiles')
    .update({ 
      xp, 
      level,
      xp_to_next_level: xpToNextLevel 
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (data) {
    sendMessage(userId, 'xpLevel', { xp, level, xpToNextLevel });
  }
  if (error) console.log(error);

  return {
    data, 
    error,
    status,
    statusText
  }
}

export async function updateUsername(
  userId: string,
  username: string
) {
  const user = await checkUsernameAvailablity(username);
  if (user.status === 400) {
    return {
      status: user.status,
      statusText: user.statusText,
      data: {}
    }
  }

  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .update({ 
      username,
      sanitized_username: username.toLowerCase()
    })
    .eq('user_id', userId)
    .select()
    .single();

  sendMessage(userId, 'profile', data);

  return {
    data, 
    error,
    status,
    statusText
  }
};

export async function linkDiscord(
  discordLinkCode: string,
  discordUsername: string,
  discordUserId: string
) {
  const user = await getProfileFromDiscordLinkCode(discordLinkCode);
  if (user.status === 404) {
    return {
      status: user.status,
      statusText: user.statusText,
      data: {}
    }
  }

  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .update({ 
      discord_username: discordUsername,
      discord_user_id: discordUserId,
      discord_link_code: ''
    })
    .eq('discord_link_code', discordLinkCode)
    .select()
    .single();

  sendMessage(data.user_id, 'profile', data);

  return {
    data, 
    error,
    status,
    statusText
  }
};

export async function unlinkDiscord(
  userId: string
) {
  const user = await getPublicProfile(userId);
  if (user.status === 404) {
    return {
      status: user.status,
      statusText: user.statusText,
      data: {}
    }
  }

  const linkCode = await generateLinkCode();

  const { 
    data, 
    error,
    status,
    statusText
  } = await supabase.from('profiles')
    .update({ 
      discord_username: '',
      discord_user_id: '',
      discord_link_code: linkCode
    })
    .eq('user_id', userId)
    .select()
    .single();

  sendMessage(userId, 'profile', data);

  return {
    data, 
    error,
    status,
    statusText
  }
};

export async function deleteAccount(userId: string) {
  const { 
    data, 
    error
  } = await supabase.auth.admin.deleteUser(userId);

  if (data) return {
    status: 200,
    statusText: 'User deleted',
    data
  }

  return {
    status: 400,
    statusText: 'User failed to delete',
    data,
    error
  }
};
