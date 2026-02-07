const baseAchievement = {
  xp: 0,
  coins: 0,
  name: '',
  notificationMessage: undefined,
  howToGet: undefined
};

export default {
  FIRSTGAME: {
    ...baseAchievement,
    xp: 10,
    name: 'First Game',
    notificationMessage: 'Achievement "Play your first game [10xp]": Complete',
    howToGet: 'Play your first game of wordrama',
  },
  KEBAB: {
    ...baseAchievement,
    xp: 10,
    name: 'KEBAB!',
    notificationMessage: 'Achievement "Guess Kebab [10xp]": Complete',
    howToGet: 'Guess KEBAB to gain 10xp',
  },
  HUNDOSTREAK: {
    ...baseAchievement,
    coin: 1000,
    name: 'King of the castle',
    notificationMessage: 'Achievement "King of the castle": Complete',
    howToGet: 'Get to the top of the leaderboard',
  },
  KINGOFTHECASTLE: {
    ...baseAchievement,
    xp: 100,
    name: '100 games for 100xp',
    notificationMessage: 'Achievement "Win 100 games for 100xp": Complete',
    howToGet: 'Win 100 games in a row',
  },
  USERNAME: {
    ...baseAchievement,
    xp: 10,
    name: 'Get a username',
    notificationMessage: 'Achievement "Get a username [10xp]": Complete',
    howToGet: 'Set yourself a username',
  },
  LINKDISCORD: {
    ...baseAchievement,
    coins: 50,
    name: 'Link your discord account',
    notificationMessage: 'Achievement "Discord [50 coins]": Complete',
    howToGet: 'Link your wordrama to your discord account',
  },
  SOCIALSHARE: {
    ...baseAchievement,
    coins: 50,
    name: 'Share on socials',
    notificationMessage: 'Achievement "Share on socials [50 coins]": Complete',
    howToGet: 'Follow & Share wordrama on socials',
  },
  GETITINONE: {
    ...baseAchievement,
    coins: 1000,
    name: 'Get it in 1',
    notificationMessage: 'Achievement "Win a wordle in 1 guess [1000 coins]": Complete',
    howToGet: 'Win a wordle in 1 guess',
  },
  GETITINTWO: {
    ...baseAchievement,
    coins: 600,
    name: 'Get it in 2',
    notificationMessage: 'Achievement "Win a wordle in 2 guesses [600 coins]": Complete',
    howToGet: 'Win a wordle in 2 guesses',
  },
  GETITINTHREE: {
    ...baseAchievement,
    coins: 350,
    name: 'Get it in 3',
    notificationMessage: 'Achievement "Win a wordle in 3 guesses [350 coins]": Complete',
    howToGet: 'Win a wordle in 3 guesses',
  },
  GETITINFOUR: {
    ...baseAchievement,
    coins: 100,
    name: 'Get it in 4',
    notificationMessage: 'Achievement "Win a wordle in 4 guesses [100 coins]": Complete',
    howToGet: 'Win a wordle in 4 guesses',
  },
};