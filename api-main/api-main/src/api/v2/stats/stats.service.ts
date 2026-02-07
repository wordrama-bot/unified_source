import { redisClient } from '../../../';
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables';

function getWeek() {
  const date = new Date(new Date().getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
  const week1 = new Date(date.getFullYear(), 0, 4);
  return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
                        - 3 + (week1.getDay() + 6) % 7) / 7);
}

const todaysStatsClient = new TableClient(
  `https://${process.env.AZURE_TABLES_ACCOUNT_NAME}.table.core.windows.net`,
  'today', 
  new AzureNamedKeyCredential(
    process.env.AZURE_TABLES_ACCOUNT_NAME,
    process.env.AZURE_TABLES_KEY
  )
);
const processedStatsClient = new TableClient(
  `https://${process.env.AZURE_TABLES_ACCOUNT_NAME}.table.core.windows.net`,
  'processed', 
  new AzureNamedKeyCredential(
    process.env.AZURE_TABLES_ACCOUNT_NAME,
    process.env.AZURE_TABLES_KEY
  )
);

const date = new Date();
const today = date.getDay();
const week = getWeek();
const month = date.getMonth() + 1;
const year = date.getFullYear();

function entitySanitizer(entity){
  const keysToRemove = ['etag', 'timestamp', 'rowKey', 'metadata', 'odata.metadata', 'partitionKey'];
  for (const key of keysToRemove){
    if (entity && entity[key]) {
      delete entity[key];
    }
  }

  if (entity && entity.wordLengths){
    entity.wordLengths = JSON.parse(entity.wordLengths);
  }
  
  return entity;

}

function compareStats(todaysStats, yesterdaysStats){
  if (todaysStats.status === 404 || yesterdaysStats.status === 404) {
    return {
      status: 404,
      statusText: 'Not Enough Data',
      data: {}
    };
  }

  const wordLengths = {};
  ["FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN"].forEach((length) => {
    wordLengths[length] = {
      coinsWon: todaysStats.data.wordLengths[length]?.coinsWon || 0 - yesterdaysStats.data.wordLengths[length]?.coinsWon || 0,
      customGamesLost: todaysStats.data.wordLengths[length]?.customGamesLost || 0 - yesterdaysStats.data.wordLengths[length]?.customGamesLost || 0,
      customGamesPlayed: todaysStats.data.wordLengths[length]?.customGamesPlayed || 0 - yesterdaysStats.data.wordLengths[length]?.customGamesPlayed || 0,
      customGamesWon: todaysStats.data.wordLengths[length]?.customGamesWon || 0 - yesterdaysStats.data.wordLengths[length]?.customGamesWon || 0,
      dailyGameLost: todaysStats.data.wordLengths[length]?.dailyGameLost || 0 - yesterdaysStats.data.wordLengths[length]?.dailyGameLost || 0,
      dailyGamesPlayed: todaysStats.data.wordLengths[length]?.dailyGamesPlayed || 0 - yesterdaysStats.data.wordLengths[length]?.dailyGamesPlayed || 0,
      dailyGamesWon: todaysStats.data.wordLengths[length]?.dailyGamesWon || 0 - yesterdaysStats.data.wordLengths[length]?.dailyGamesWon || 0,
      gamesLost: todaysStats.data.wordLengths[length]?.gamesLost || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLost || 0,
      gamesLostInDarkMode: todaysStats.data.wordLengths[length]?.gamesLostInDarkMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLostInDarkMode || 0,
      gamesLostInHardMode: todaysStats.data.wordLengths[length]?.gamesLostInHardMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLostInHardMode || 0,
      gamesLostInHighContrastMode: todaysStats.data.wordLengths[length]?.gamesLostInHighContrastMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLostInHighContrastMode || 0,
      gamesLostInLightMode: todaysStats.data.wordLengths[length]?.gamesLostInLightMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLostInLightMode || 0,
      gamesLostInSpeedRunMode: todaysStats.data.wordLengths[length]?.gamesLostInSpeedRunMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLostInSpeedRunMode || 0,
      gamesLostWithKeysSwapped: todaysStats.data.wordLengths[length]?.gamesLostWithKeysSwapped || 0 - yesterdaysStats.data.wordLengths[length]?.gamesLostWithKeysSwapped || 0,
      gamesPlayed: todaysStats.data.wordLengths[length]?.gamesPlayed || 0 - yesterdaysStats.data.wordLengths[length]?.gamesPlayed || 0,
      gamesPlayedWithKeysSwapped: todaysStats.data.wordLengths[length]?.gamesPlayedWithKeysSwapped || 0 - yesterdaysStats.data.wordLengths[length]?.gamesPlayedWithKeysSwapped || 0,
      gamesWon: todaysStats.data.wordLengths[length]?.gamesWon || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWon || 0,
      gamesWonInDarkMode: todaysStats.data.wordLengths[length]?.gamesWonInDarkMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInDarkMode || 0,
      gamesWonInFiveAttempts: todaysStats.data.wordLengths[length]?.gamesWonInFiveAttempts || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInFiveAttempts || 0,
      gamesWonInFourAttempts: todaysStats.data.wordLengths[length]?.gamesWonInFourAttempts || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInFourAttempts || 0,
      gamesWonInHardMode: todaysStats.data.wordLengths[length]?.gamesWonInHardMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInHardMode || 0,
      gamesWonInHighContrastMode: todaysStats.data.wordLengths[length]?.gamesWonInHighContrastMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInHighContrastMode || 0,
      gamesWonInLightMode: todaysStats.data.wordLengths[length]?.gamesWonInLightMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInLightMode || 0,
      gamesWonInOneAttempts: todaysStats.data.wordLengths[length]?.gamesWonInOneAttempts || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInOneAttempts || 0,
      gamesWonInSixAttempts: todaysStats.data.wordLengths[length]?.gamesWonInSixAttempts || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInSixAttempts || 0,
      gamesWonInSpeedRunMode: todaysStats.data.wordLengths[length]?.gamesWonInSpeedRunMode || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInSpeedRunMode || 0,
      gamesWonInThreeAttempts: todaysStats.data.wordLengths[length]?.gamesWonInThreeAttempts || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInThreeAttempts || 0,
      gamesWonInTwoAttempts: todaysStats.data.wordLengths[length]?.gamesWonInTwoAttempts || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonInTwoAttempts || 0,
      gamesWonWithKeysSwapped: todaysStats.data.wordLengths[length]?.gamesWonWithKeysSwapped || 0 - yesterdaysStats.data.wordLengths[length]?.gamesWonWithKeysSwapped || 0,
      guesses: todaysStats.data.wordLengths[length]?.guesses || 0 - yesterdaysStats.data.wordLengths[length]?.guesses || 0,
      infiniteGamesLost: todaysStats.data.wordLengths[length]?.infiniteGamesLost || 0 - yesterdaysStats.data.wordLengths[length]?.infiniteGamesLost || 0,
      infiniteGamesPlayed: todaysStats.data.wordLengths[length]?.infiniteGamesPlayed || 0 - yesterdaysStats.data.wordLengths[length]?.infiniteGamesPlayed || 0,
      infiniteGamesWon: todaysStats.data.wordLengths[length]?.infiniteGamesWon || 0 - yesterdaysStats.data.wordLengths[length]?.infiniteGamesWon || 0
    };
    return;
  });

  const coinsWon = todaysStats.data.coinsWon - yesterdaysStats.data.coinsWon;
  console.log(todaysStats.data.coinsWon, '-', yesterdaysStats.data.coinsWon, '=', coinsWon);
  const customGamesLost = todaysStats.data.customGamesLost - yesterdaysStats.data.customGamesLost;
  const customGamesPlayed = todaysStats.data.customGamesPlayed - yesterdaysStats.data.customGamesPlayed;
  const customGamesWon = todaysStats.data.customGamesWon - yesterdaysStats.data.customGamesWon;
  const dailyGameLost = todaysStats.data.dailyGameLost - yesterdaysStats.data.dailyGameLost;
  const dailyGamesPlayed = todaysStats.data.dailyGamesPlayed - yesterdaysStats.data.dailyGamesPlayed;
  const dailyGamesWon = todaysStats.data.dailyGamesWon - yesterdaysStats.data.dailyGamesWon;
  const gamesLost = todaysStats.data.gamesLost - yesterdaysStats.data.gamesLost;
  const gamesLostInDarkMode = todaysStats.data.gamesLostInDarkMode - yesterdaysStats.data.gamesLostInDarkMode;
  const gamesLostInHardMode = todaysStats.data.gamesLostInHardMode - yesterdaysStats.data.gamesLostInHardMode;
  const gamesLostInHighContrastMode = todaysStats.data.gamesLostInHighContrastMode - yesterdaysStats.data.gamesLostInHighContrastMode;
  const gamesLostInLightMode = todaysStats.data.gamesLostInLightMode - yesterdaysStats.data.gamesLostInLightMode;
  const gamesLostInSpeedRunMode = todaysStats.data.gamesLostInSpeedRunMode - yesterdaysStats.data.gamesLostInSpeedRunMode;
  const gamesLostWithKeysSwapped = todaysStats.data.gamesLostWithKeysSwapped - yesterdaysStats.data.gamesLostWithKeysSwapped;
  const gamesPlayed = todaysStats.data.gamesPlayed - yesterdaysStats.data.gamesPlayed;
  const gamesPlayedWithKeysSwapped = todaysStats.data.gamesPlayedWithKeysSwapped - yesterdaysStats.data.gamesPlayedWithKeysSwapped;
  const gamesWon = todaysStats.data.gamesWon - yesterdaysStats.data.gamesWon;
  const gamesWonInDarkMode = todaysStats.data.gamesWonInDarkMode - yesterdaysStats.data.gamesWonInDarkMode;
  const gamesWonInFiveAttempts = todaysStats.data.gamesWonInFiveAttempts - yesterdaysStats.data.gamesWonInFiveAttempts;
  const gamesWonInFourAttempts = todaysStats.data.gamesWonInFourAttempts - yesterdaysStats.data.gamesWonInFourAttempts;
  const gamesWonInHardMode = todaysStats.data.gamesWonInHardMode - yesterdaysStats.data.gamesWonInHardMode;
  const gamesWonInHighContrastMode = todaysStats.data.gamesWonInHighContrastMode - yesterdaysStats.data.gamesWonInHighContrastMode;
  const gamesWonInLightMode = todaysStats.data.gamesWonInLightMode - yesterdaysStats.data.gamesWonInLightMode;
  const gamesWonInOneAttempts = todaysStats.data.gamesWonInOneAttempts - yesterdaysStats.data.gamesWonInOneAttempts;
  const gamesWonInSixAttempts = todaysStats.data.gamesWonInSixAttempts - yesterdaysStats.data.gamesWonInSixAttempts;
  const gamesWonInSpeedRunMode = todaysStats.data.gamesWonInSpeedRunMode - yesterdaysStats.data.gamesWonInSpeedRunMode;
  const gamesWonInThreeAttempts = todaysStats.data.gamesWonInThreeAttempts - yesterdaysStats.data.gamesWonInThreeAttempts;
  const gamesWonInTwoAttempts = todaysStats.data.gamesWonInTwoAttempts - yesterdaysStats.data.gamesWonInTwoAttempts;
  const gamesWonWithKeysSwapped = todaysStats.data.gamesWonWithKeysSwapped - yesterdaysStats.data.gamesWonWithKeysSwapped;
  const guesses = todaysStats.data.guesses - yesterdaysStats.data.guesses;
  const infiniteGamesLost = todaysStats.data.infiniteGamesLost - yesterdaysStats.data.infiniteGamesLost;
  const infiniteGamesPlayed = todaysStats.data.infiniteGamesPlayed - yesterdaysStats.data.infiniteGamesPlayed;
  const infiniteGamesWon = todaysStats.data.infiniteGamesWon - yesterdaysStats.data.infiniteGamesWon;

  const comparison = {
    userId: todaysStats.data.userId,
    coinsWon,
    customGamesLost,
    customGamesPlayed,
    customGamesWon,
    dailyGameLost,
    dailyGamesPlayed,
    dailyGamesWon,
    gamesLost,
    gamesLostInDarkMode,
    gamesLostInHardMode,
    gamesLostInHighContrastMode,
    gamesLostInLightMode,
    gamesLostInSpeedRunMode,
    gamesLostWithKeysSwapped,
    gamesPlayed,
    gamesPlayedWithKeysSwapped,
    gamesWon,
    gamesWonInDarkMode,
    gamesWonInFiveAttempts,
    gamesWonInFourAttempts,
    gamesWonInHardMode,
    gamesWonInHighContrastMode,
    gamesWonInLightMode,
    gamesWonInOneAttempts,
    gamesWonInSixAttempts,
    gamesWonInSpeedRunMode,
    gamesWonInThreeAttempts,
    gamesWonInTwoAttempts,
    gamesWonWithKeysSwapped,
    guesses,
    infiniteGamesLost,
    infiniteGamesPlayed,
    infiniteGamesWon,
    wordLengths
  };

  return comparison;
};

export async function getPlayersStatsForToday(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-daily-${today}`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }
    const statsEntity = await todaysStatsClient.getEntity(userId, `daily-${today}`);
    const stats = await entitySanitizer(statsEntity);
    
    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-daily-${today}`, 60, JSON.stringify(stats));
    }
    
    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getPlayersStatsForYesterday(userId: string) {
  try {
    let yesterdaysStats = today - 1;
    if (today === 6) {
      yesterdaysStats = 0;
    }

    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-yesterdaysStats`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }

    const statsEntity = await processedStatsClient.getEntity(userId, `daily-${yesterdaysStats}`);
    const stats = await entitySanitizer(statsEntity);

    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-yesterdaysStats`, 60 * 60, JSON.stringify(stats));
    }

    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getTodayVsYesterdaysStats(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-todayVsYesterdaysStats`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }
    const today = await getPlayersStatsForToday(userId);
    const yesterdaysStats = await getPlayersStatsForYesterday(userId);
    const stats = await compareStats(today, yesterdaysStats);
    
    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-todayVsYesterdaysStats`, 5 * 60, JSON.stringify(stats));
    }
    
    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getPlayersStatsForWeek(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-weekly-${week}`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }

    const statsEntity = await processedStatsClient.getEntity(userId, `weekly-${week}`);
    const stats = await entitySanitizer(statsEntity);

    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-weekly-${week}`, 60 * 60, JSON.stringify(stats));
    }

    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getPlayersStatsForLastWeek(userId: string) {
  try {
    let lastWeek = week - 1;
    if (week === 1) {
      lastWeek = 52;
    }

    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-weekly-${lastWeek}`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }

    const statsEntity = await processedStatsClient.getEntity(userId, `weekly-${lastWeek}`);
    const stats = await entitySanitizer(statsEntity);

    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-weekly-${lastWeek}`, 24 * 60 * 60, JSON.stringify(stats));
    }

    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getWeekVsLastWeekStats(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-weekVsLastWeekStats`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }
    const thisWeekStats = await getPlayersStatsForWeek(userId);
    const lastWeekStats = await getPlayersStatsForLastWeek(userId);
    const stats = await compareStats(thisWeekStats, lastWeekStats);
    
    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-weekVsLastWeekStats`, 60 * 60, JSON.stringify(stats));
    }
    
    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getPlayersStatsForMonth(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-monthly-${month}`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }

    const statsEntity = await processedStatsClient.getEntity(userId, `monthly-${month}`);
    const stats = await entitySanitizer(statsEntity);

    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-monthly-${month}`, 7 * 24 * 60 * 60, JSON.stringify(stats));
    }

    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getPlayersStatsForLastMonth(userId: string) {
  try {
    let lastMonth = month - 1;
    if (month === 12) {
      lastMonth = 1;
    }

    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-monthly-${lastMonth}`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }

    const statsEntity = await processedStatsClient.getEntity(userId, `monthly-${lastMonth}`);
    const stats = await entitySanitizer(statsEntity);

    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-monthly-${lastMonth}`, 7 * 24 * 60 * 60, JSON.stringify(stats));
    }

    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getMonthVsLastMonthStats(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-monthVsLastMonthStats`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }
    const thisMonthStats = await getPlayersStatsForWeek(userId);
    const lastMonthStats = await getPlayersStatsForLastWeek(userId);
    const stats = await compareStats(thisMonthStats, lastMonthStats);
    
    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-monthVsLastMonthStats`, 7 * 60 * 60, JSON.stringify(stats));
    }
    
    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getPlayersStatsForYear(
  userId: string,
  specifiedYear: number | string = undefined
) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-yearly-${specifiedYear || year}`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }

    const statsEntity = await processedStatsClient.getEntity(userId, `yearly-${specifiedYear || year}`);
    const stats = await entitySanitizer(statsEntity);

    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-yearly-${specifiedYear || year}`, 4 * 7 * 24 * 60 * 60, JSON.stringify(stats));
    }

    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};

export async function getYearVsLastYearStats(userId: string) {
  try {
    if (process.env.CACHE_ENABLED === 'true') {
      const cache = await redisClient.get(`STATS-${userId}-yearVsLastYearStats`);
      if (cache) return {
        status: 200,
        statusText: 'OK',
        data: JSON.parse(cache)
      };
    }
    const thisYearStats = await getPlayersStatsForYear(userId);
    const lastYearStats = await getPlayersStatsForYear(userId, year - 1);
    const stats = await compareStats(thisYearStats, lastYearStats);
    
    if (process.env.CACHE_ENABLED === 'true') {
      await redisClient.setEx(`STATS-${userId}-yearVsLastYearStats`, 7 * 60 * 60, JSON.stringify(stats));
    }
    
    return {
      status: 200,
      statusText: 'OK',
      data: stats
    };
  } catch (error) {
    console.error(error);
    return {
      status: 404,
      statusText: 'Not Found',
      data: {}
    };
  }
};