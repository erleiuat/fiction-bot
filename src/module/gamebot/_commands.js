/* eslint prettier/prettier: ["error", { printWidth: 200 }] */

exports.commands = {
  '/whois': {
    routine: 'whois_stats',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/reset': {
    routine: 'reset_starterkit',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/connect': {
    routine: 'connectDC',
    scopes: ['global'],
    cooldown: null
  },
  '/whoami': {
    routine: 'whoami_stats',
    scopes: ['global'],
    cooldown: null
  },
  '/welcome': {
    routine: 'manual_welcome',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/rules': {
    routine: 'list_rules',
    scopes: ['local', 'global'],
    cooldown: 5
  },
  '/rule': {
    routine: 'show_rule',
    scopes: ['global', 'local'],
    cooldown: null
  },
  '/anonymous': {
    routine: 'anonymize_login',
    scopes: ['global'],
    cooldown: null
  },
  '/anonym': {
    routine: 'anonymize_login',
    scopes: ['global'],
    cooldown: null
  },
  '/anonymize': {
    routine: 'anonymize_login',
    scopes: ['global'],
    cooldown: null
  },
  '/reboot': {
    routine: 'reboot_bot',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/reload': {
    routine: 'reload_bot',
    scopes: ['local', 'global'],
    cooldown: null
  },
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
    cooldown: null
  },
  '/players': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '/playersonline': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '/onlineplayers': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '/restart': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: null
  },
  '/whenrestart': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: null
  },
  '/restartwhen': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: null
  },
  '/help': {
    routine: 'help',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/commands': {
    routine: 'help',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/joke': {
    routine: 'joke',
    scopes: ['global'],
    cooldown: 5
  },
  '/time': {
    routine: 'time',
    scopes: ['global'],
    cooldown: null
  },
  '/what': {
    routine: 'what_is_going_on',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '/fasttravel': {
    routine: 'travel',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '/travel': {
    routine: 'travel',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '/transfer': {
    routine: 'transfer',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '/buyitem': {
    routine: 'shop_item',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '/buy': {
    routine: 'shop_item',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '/ping': {
    routine: 'ping',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/pong': {
    routine: 'ping',
    scopes: ['local', 'global'],
    cooldown: 1
  },
  '/starterkit': {
    routine: 'starterkit',
    scopes: ['global'],
    cooldown: null
  },
  '/ready': {
    routine: 'starterkit_ready',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/shop': {
    routine: 'shop_info',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/fictionshop': {
    routine: 'shop_info',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '/botshop': {
    routine: 'shop_info',
    scopes: ['local', 'global'],
    cooldown: null
  }
}
