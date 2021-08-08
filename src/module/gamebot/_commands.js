module.exports = {
  /*
  '!team': {
    routine: 'team_channel',
    scopes: ['squad'],
    cooldown: null
  },
  */
  '!ping': {
    routine: 'ping',
    scopes: ['global'],
    cooldown: 1
  },
  '!pong': {
    routine: 'ping',
    scopes: ['global'],
    cooldown: null
  },
  '!help': {
    routine: 'help',
    scopes: ['global'],
    cooldown: null
  },
  '!commands': {
    routine: 'help',
    scopes: ['global'],
    cooldown: null
  },
  '!voteday': {
    routine: 'vote_day',
    scopes: ['global'],
    cooldown: 10
  },
  '!dayvote': {
    routine: 'vote_day',
    scopes: ['global'],
    cooldown: 10
  },
  '!votenight': {
    routine: 'vote_night',
    scopes: ['global'],
    cooldown: 10
  },
  '!nightvote': {
    routine: 'vote_night',
    scopes: ['global'],
    cooldown: 10
  },
  '!votesun': {
    routine: 'vote_weather_sun',
    scopes: ['global'],
    cooldown: 10
  },
  '!sunvote': {
    routine: 'vote_weather_sun',
    scopes: ['global'],
    cooldown: 10
  },
  '!voterain': {
    routine: 'vote_weather_rain',
    scopes: ['global'],
    cooldown: 10
  },
  '!rainvote': {
    routine: 'vote_weather_rain',
    scopes: ['global'],
    cooldown: 10
  },
  '!online': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '!players': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '!playersonline': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '!onlineplayers': {
    routine: 'online',
    scopes: ['global'],
    cooldown: null
  },
  '!restart': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: null
  },
  '!whenrestart': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: null
  },
  '!restartwhen': {
    routine: 'restart_countdown',
    scopes: ['global'],
    cooldown: null
  },
  '!joke': {
    routine: 'joke',
    scopes: ['global'],
    cooldown: 5
  },
  '!time': {
    routine: 'time',
    scopes: ['global'],
    cooldown: null
  },
  '!whoami': {
    routine: 'whoami_stats',
    scopes: ['global'],
    cooldown: null
  },
  '!lotterydraw': {
    routine: 'lottery_draw',
    scopes: ['global'],
    cooldown: null
  },
  '!lottery': {
    routine: 'lottery',
    scopes: ['global'],
    cooldown: null
  },
  '!bounty': {
    routine: 'bounty',
    scopes: ['global'],
    cooldown: null
  },

  '!rules': {
    routine: 'list_rules',
    scopes: ['local'],
    cooldown: 5
  },
  '!buyitem': {
    routine: 'shop_item',
    scopes: ['local'],
    cooldown: null
  },
  '!buy': {
    routine: 'shop_item',
    scopes: ['local'],
    cooldown: null
  },

  '!anonymous': {
    routine: 'anonymize_login',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!anonym': {
    routine: 'anonymize_login',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!anonymize': {
    routine: 'anonymize_login',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!connect': {
    routine: 'connectDC',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!starterkit': {
    routine: 'starterkit',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!starterset': {
    routine: 'starterkit',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!starterpack': {
    routine: 'starterkit',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!lang': {
    routine: 'set_lang',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!language': {
    routine: 'set_lang',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!tl': {
    routine: 'translate_chat',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!translate': {
    routine: 'translate_chat',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!transfer': {
    routine: 'transfer',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!fasttravel': {
    routine: 'travel',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '!travel': {
    routine: 'travel',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },

  '!shop': {
    routine: 'shop_info',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!fictionshop': {
    routine: 'shop_info',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!botshop': {
    routine: 'shop_info',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!what': {
    routine: 'what_is_going_on',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!discord': {
    routine: 'discord_link',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!deactivatemine': {
    routine: 'deactivate_mine',
    scopes: ['squad', 'global', 'local'],
    cooldown: null
  },
  '!whois': {
    routine: 'whois_stats',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!new': {
    routine: 'new_player',
    scopes: ['global', 'local'],
    cooldown: null
  },
  '!rule': {
    routine: 'show_rule',
    scopes: ['global', 'local'],
    cooldown: null
  },
  '!reboot': {
    routine: 'reboot_bot',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!reload': {
    routine: 'reload_bot',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!restart': {
    routine: 'restart_bot',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!reset': {
    routine: 'reset_starterkit',
    scopes: ['local', 'global'],
    cooldown: null
  },
  '!exec': {
    routine: 'exec_cmd',
    scopes: ['local', 'global', 'squad'],
    cooldown: null
  },
  '!welcome': {
    routine: 'manual_welcome',
    scopes: ['local', 'global'],
    cooldown: null
  }
}
