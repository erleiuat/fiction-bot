/* eslint prettier/prettier: ["error", { printWidth: 200 }] */

exports.commands = {
  '/voteday': {
    routine: 'vote_day',
    scopes: ['global'],
    cooldown: 5
  },
  '/dayvote': {
    routine: 'vote_day',
    scopes: ['global'],
    cooldown: 5
  },
  '/votenight': {
    routine: 'vote_night',
    scopes: ['global'],
    cooldown: 5
  },
  '/nightvote': {
    routine: 'vote_night',
    scopes: ['global'],
    cooldown: 5
  },
  '/votesun': {
    routine: 'vote_weather_sun',
    scopes: ['global'],
    cooldown: 5
  },
  '/sunvote': {
    routine: 'vote_weather_sun',
    scopes: ['global'],
    cooldown: 5
  },
  '/online': {
    routine: 'online',
    scopes: ['global'],
    cooldown: 0
  },
  '/players': {
    routine: 'online',
    scopes: ['global'],
    cooldown: 0
  },
  '/playersonline': {
    routine: 'online',
    scopes: ['global'],
    cooldown: 0
  },
  '/onlineplayers': {
    routine: 'online',
    scopes: ['global'],
    cooldown: 0
  },
  '/restart': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: 0
  },
  '/whenrestart': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: 0
  },
  '/restartwhen': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: 0
  },
  '/help': {
    routine: 'help',
    scopes: ['local', 'global'],
    cooldown: 0
  },
  '/commands': {
    routine: 'help',
    scopes: ['local', 'global'],
    cooldown: 0
  },
  '/joke': {
    routine: 'joke',
    scopes: ['global'],
    cooldown: 5
  },
  '/time': {
    routine: 'time',
    scopes: ['global'],
    cooldown: 0
  },
  '/what': {
    routine: 'what_is_going_on',
    scopes: ['local', 'global', 'squad'],
    cooldown: 0
  },
  '/fasttravel': {
    routine: 'travel',
    scopes: ['local', 'global', 'squad'],
    cooldown: 0
  },
  '/travel': {
    routine: 'travel',
    scopes: ['local', 'global', 'squad'],
    cooldown: 0
  },
  '/transfer': {
    routine: 'transfer',
    scopes: ['local', 'global', 'squad'],
    cooldown: 0
  },
  '/buyitem': {
    routine: 'shop_item',
    scopes: ['local', 'global', 'squad'],
    cooldown: 0
  },
  '/buy': {
    routine: 'shop_item',
    scopes: ['local', 'global', 'squad'],
    cooldown: 0
  },
  '/ping': {
    routine: 'ping',
    scopes: ['local', 'global'],
    cooldown: 0
  },
  '/pong': {
    routine: 'ping',
    scopes: ['local', 'global'],
    cooldown: 0
  },
  '/exec': {
    routine: 'exec',
    scopes: ['local', 'global'],
    cooldown: 0
  },
  '/spawn': {
    routine: 'spawn',
    scopes: ['local', 'global'],
    cooldown: 0
  },
  '/starterkit': {
    routine: 'starterkit',
    scopes: ['global'],
    cooldown: 0
  },
  '/ready': {
    routine: 'starterkit_ready',
    scopes: ['local', 'global'],
    cooldown: 0
  }
}
