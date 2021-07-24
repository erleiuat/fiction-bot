/* eslint prettier/prettier: ["error", { printWidth: 200 }] */

/*
    Placeholders:
        {userID} = Users Steam-ID
        {user[...]} = Name of the user
        {msg[...]} = Placeholder for custom messages
*/

//const botName = 'scumfiction'
//const botName = 'Chris P. Bacon'
const botName = process.env.SETTING_BOT_NAME

exports.messages = {
  rules: {
    intro:
      'There are the rules on the server. Check Discord for more details about a specific rule',
    rules: [
      '- #1 DBAA / Don’t be an asshole',
      '- #2 No purposeless destruction',
      '- #3 No destruction of vehicles',
      '- #4 No Bambi kills',
      '- #5 Maximum 1 vehicle per player + 1 spare vehicle per squad',
      '- #6 Write in English or German and don’t spam',
      '- #7 No thievery in the Tradingzone B2.',
      '- #8 Don’t raid if your base is within the safe zone Z0',
      '- #9 Traps only in own flag circle and NOT on roads or POIs',
      '- #10 Bases must not be unraidable'
    ]
  },
  schedule: {
    restart1: '#Announce Restart in 5 minutes!',
    restart2:
      ":[Restart-Info]: ・ Don't drive and make sure there are no valuable items on the floor!",
    restart3: '#Announce Restart in 1 minute!'
  },
  anonymize: {
    on: ' ・ @{user}: Your logins & logouts will be anonymous by now.',
    off: " ・ @{user}: Your logins & logouts won't me anonymous anymore."
  },
  tooEarly: ' ・ Sorry, you are too fast. Please wait {minutes} minutes.',
  noPermission: ":[Error]: ・ @{user}: Sorry, You don't have enough permissions for this.",
  unknownCommand: ":[Error]: ・ @{user}: Sorry, I don't know this command.",
  prefix: ' ・ ',
  fName: '#SetFakeName ・ :[FiBo]',
  pos: {
    idle: '#Teleport -117145 -66735 37125 "' + botName + '"',
    outside: '#Teleport -113436 -65667 37300 "' + botName + '"'
  },
  pPos: {
    firstJoin: '#Teleport -113641 -64016 37682 {userID}',
    inside: '#Teleport -116800 -66735 37065 {userID}',
    outside: '#Teleport -113436 -65667 37000 {userID}'
  },
  start: {
    reload: ' ・ Reloading...',
    reboot: " ・ I will reboot my PC now. It can take up to 10 minutes untill I'm ready again.",
    ready: " ・ I'm ready!"
  },
  in: {
    login: ' ・ >> {user} is joining << ・ ',
    logout: ' ・ >> {user} left << ・ ',
    kill: ':[Killfeed]: ・ >> {user1} {event} {user2} << ・ ',
    firstJoin: {
      fPoints: '#SetFamePoints 10 {userID}',
      welcome:
        " ・ Welcome to the Server @{user}! If you have any questions, please don't hesitate to contact us. You are also entitled to a starterkit! Get it with: /starterkit (in global-chat)."
    },
    traps:
      ':[Traps]: ・ If you have just placed a trap, please note that this is only allowed in and immediately around your Base. Remove the mine if this is not the case.',
    sKit: {
      illegal:
        ':[Starterkit]: ・ @{user} you should have already received your starterkit ;) If not, please contact support.',
      start1:
        ':[Starterkit]: ・ @{user} you will be teleported to the trading-zone (green circle in B2) to receive your starterkit. Make sure you are ready and not driving a vehicle.',
      start2:
        ':[Starterkit]: ・ Type "/ready" when you are ready. You will get a quad to get out of the trading-zone again.',
      start3:
        ':[Starterkit]: ・ @{user} you will be transported to the trading zone in a few seconds.',
      done: ':[Starterkit]: ・ @{user} your starterkit should now be there and your Quad should be waiting for you outside.'
    }
  },
  shop: {
    info: ':[Shop]: ・ @{user} Check https://shop.scumfiction.com/ to find our range of products! Then, use /buyitem [item_key] to buy something!',
    trans: {
      form: ':[Transfer]: ・ @{user} Use this format: /transfer [amount] [user]',
      notEnough: ":[Transfer]: ・ @{user} You don't have enough famepoints for this transaction.",
      notFound:
        ":[Transfer]: ・ @{user} I couldn't find the recipient with that name. Make sure to tell the name as it is spelled in chat.",
      success: ':[Transfer]: ・ @{user} Your transaction was successful.',
      started: ':[Transfer]: ・ @{user} Transaction started. Please wait...',
      somethingWrong: ':[Transfer]: ・ @{user} Something went wrong. Please try again.'
    },
    pleaseWait: ':[Shop]: ・ @{user} Please be patient, your item should be there shortly.',
    noItem: ':[Shop]: ・ @{user} you need to tell me what Item you want to buy.',
    unknownItem: ":[Shop]: ・ @{user} I don't know this item.",
    notNearShop: ':[Shop]: ・ @{user} you need to be near the shop to buy things.',
    notEnoughMoney: ':[Shop]: ・ @{user} you need at least {fame} Famepoints to buy this.',
    startSale:
      ":[Shop]: ・ @{user} your purchase of {item} for {fame} Famepoints starts shortly. You will be teleported to your Item when it's done.",
    endSale: ':[Shop]: ・ @{user} you successfully bought {item} for {fame} Famepoints!',
    somethingWrong: ':[Shop]: ・ Something went wrong. Please try again.'
  },
  pub: {
    travel: {
      info: ':[Travel]: ・ @{user}: Every trip costs 5 Famepoints. Available FastTravel-Stations: D0, B2, Z0, A3, D4',
      unknownLoc: ":[Travel]: ・ @{user}: I couldn't recognize the station you want to go to.",
      notEnough: ':[Travel]: ・ @{user}: You need to have 5 famepoints for this trip.',
      noStation: ":[Travel]: ・ @{user}: You aren't near any Fasttravel station.",
      start: ':[Travel]: ・ @{user}: Your trip will start shortly. It will cost you 5 famepoints.',
      somethingWrong: ':[Travel]: ・ @{user}: Something went wrong. Please try again.'
    },
    vote: {
      day: ':[Voting]: ・ Daytime-Voting begins! (7:00 AM) Press "F2" or "F3" to vote!',
      night: ':[Voting]: ・ Nighttime-Voting begins! (10:00 PM) Press "F2" or "F3" to vote!',
      sun: ':[Voting]: ・ Weather voting begins! (Sunny) Press "F2" or "F3" to vote!'
    },
    help: {
      m1: ':[Help]: ・ @{user}: Available commands (if bot is online):',
      m2: ':[Help]: ・ /voteday, /votesun, /online, /restart, /joke, /starterkit, /time',
      m3: ':[Help]: ・ (Most will only work in GLOBAL Chat! Press "TAB" to change chatroom)',
      m4: ':[Help]: ・ To see more commands check Discord: https://discord.gg/pZtw7NPdrZ'
    },
    joke: ':[Joke]: ・ {joke}',
    ping: ':[BadaBong]: ・ Pong right back at you @{user} ;)',
    online: ':[Online]: ・ There are currently {players} Players online.',
    time: ':[Time]: ・ It is currently about {time}',
    restart: ':[Restart]: ・ Next restart will be in: {hours} hours and {minutes} minutes.'
  }
}
