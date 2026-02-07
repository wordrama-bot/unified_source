import { supabase } from "../";
import { generateLinkCode } from "../api/v1/auth/account/account.service";
import ACHIEVEMENTS from '../api/v1/achievements/achievements.config';

async function getProfile(userId) {
  return await supabase.from('profiles')
    .select()
    .eq('user_id', userId)
    .limit(1)
    .single();
}

async function initialiszeProfile(userId) {
  const user = await supabase.auth.getUser(userId);
  const profile = { 
    user_id: userId,
    discord_username: '',
    discord_user_id: '',
    discord_link_code: ''
  }

  if (user?.data?.user?.app_metadata?.provider === 'discord') {
    //defaultProfile.discord_username = user.data.user.app_metadata.identities[0].id
    profile.discord_user_id = user.data.user.app_metadata.identities[0].id
  } else {
    const linkCode = await generateLinkCode();
    profile.discord_link_code = linkCode;
  }
  return await supabase.from('profiles')
  .insert(profile)
  .select()
  .limit(1)
  .single();
}

async function initialiszeLedger(userId) {
  return await supabase.from('ledger')
  .insert({ 
    user_id: userId,  
    coin_count: 0
  })
  .select()
  .limit(1)
  .single();
}

async function initialiszeWordleSettings(userId) {
  try {
    await supabase.from('wordle_settings')
    .insert({ 
      user_id: userId,
      colour_blind: false,
      dark_mode: true,
      hard_mode: false,
      word_length: 'FIVE',
      confetti_enabled: true
    })
    .select()
    .limit(1)
    .single();
  } catch(err){ console.log(err)}
  
}

async function initialiszeWordleStats(userId) {
  const baseStat = { 
    user_id: userId,
    games_won: 0,
    games_failed: 0,
    current_streak: 0,
    best_streak: 0,
    success_rate: 0,
    total_games: 0,
    win_distribution: [0,0,0,0,0,0],
  }

  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'FIVE'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'SIX'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'SEVEN'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'EIGHT'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'NINE'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'TEN'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 0,
    word_length: 'ELEVEN'
  });

  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'FIVE'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'SIX'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'SEVEN'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'EIGHT'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'NINE'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'TEN'
  });
  await supabase.from('wordle_stats').insert({
    ...baseStat,
    gamemode_id: 1,
    word_length: 'ELEVEN'
  });
}

async function initialiszeDailySpin(userId) {
  return await supabase.from('daily_spin')
  .insert({ 
    user_id: userId,  
    is_claimed: false,
    prize_coin_count: 0,
    last_spin: 0,
    is_coin_prize: false
  })
  .select()
  .limit(1)
  .single();
}

async function initialiszeAchievements(userId) {
  await Promise.all(Object.keys(ACHIEVEMENTS).map(async (achievement) => {
    await supabase.from('achievements')
    .insert({ 
      user_id: userId,  
      name: achievement,
      achieved: false
    })
    .select()
    .limit(1)
    .single();
  }));
}

export default async function initializeNewUser(io, socket, userId){
  try {
    const { data } = await getProfile(userId);
    if (data) return;
    await initialiszeProfile(userId);
    await initialiszeWordleSettings(userId);
    await initialiszeWordleStats(userId);
    await initialiszeLedger(userId);
    await initialiszeDailySpin(userId);
    await initialiszeAchievements(userId);
    await io.to(userId).emit(
      'client-connected-to-userId',
      `Emitting again now user ${userId} has been initialized`
    );
  } catch(err){
    console.log(err)
  }
};
