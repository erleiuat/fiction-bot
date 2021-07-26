//const botName = 'scumfiction'
//const botName = 'Chris P. Bacon'
const botName = process.env.SETTING_BOT_NAME

module.exports = {
  prefix: ' ・ ',
  error: ':[Error]: ・ Something went wrong. Please try again or contact support.',
  tooEarly: ':[Error]: ・ Sorry, you are too fast. Please wait {minutes} minutes.',
  unknownUser: ':[Error]: ・ Sorry, I was not able to find the user {user}.',
  noPermission: ':[Error]: ・ @{user}: Sorry, You don’t have enough permissions for this.',
  unknownCommand: ':[Error]: ・ @{user}: Sorry, I don’t know this command.',
  resetStarter: ':[Starterkit]: ・ The Starterkit for {user} has been reset.',
  lang: {
    unknown:
      ':[Lang]: ・ @{user}: Sorry, I don’t know this language. Please check if you wrote it correctly.',
    list: ':[Lang]: ・ @{user}: You can switch between these languages: english, german, russian',
    ger: ':[Lang]: ・ @{user}: Language set to German.',
    eng: ':[Lang]: ・ @{user}: Language set to English.',
    rus: ':[Lang]: ・ @{user}: Language set to Russian.'
  },
  tChnl: {
    needName: ':[Teams]: ・ Please tell me the name you’d like to use ("/team create [team-name]")'
  },
  connect: {
    help: ':[Connect]: ・ Send me a private message on Discord (FictionBot#9302) with the content "/connect" to get your pairing-code! You can also just write this command into any channel on our Discord-Server!',
    nope: ':[Connect]: ・ Sorry, this didn’t work. Try getting a new code over on Discord or contact support.',
    yap: ':[Connect]: ・ Your Discord account has been successfully paired!'
  },
  whoami: {
    m1: ':[Stats]: ・ Name: {user} | Role: "{group}" | Joined: {date} at {time}',
    m2: ':[Stats]: ・ Total logins: {logins} | Total playtime: {playtime} hours',
    m3: ':[Stats]: ・ Messages - Local: {local} | Global: {global} | Squad: {squad}',
    m4: ':[Stats]: ・ Kills: {kills} (including events and suicides)'
  },
  rules: {
    intro: ':[Rules]: ・ These are the rules on the server. Check Discord for more details.',
    notFound: ':[Rules]: ・ There is no rule #{number}',
    rules: [
      ':[Rules]: ・ #1 DBAA / Don’t be an asshole',
      ':[Rules]: ・ #2 No purposeless destruction',
      ':[Rules]: ・ #3 No destruction of vehicles',
      ':[Rules]: ・ #4 No Bambi kills',
      ':[Rules]: ・ #5 Maximum 1 vehicle per player + 1 spare vehicle per squad',
      ':[Rules]: ・ #6 Write in English or German and don’t spam',
      ':[Rules]: ・ #7 No thievery in the Tradingzone B2',
      ':[Rules]: ・ #8 Don’t raid if your base is within the safe zone Z0',
      ':[Rules]: ・ #9 Traps only in own flag circle and NOT on roads or POIs',
      ':[Rules]: ・ #10 Bases must not be unraidable'
    ]
  },
  schedule: {
    restart1: '#Announce Restart in 5 minutes!',
    restart2:
      ':[Restart-Info]: ・ Don’t drive and make sure there are no valuable items on the floor!',
    restart3: '#Announce Restart in 1 minute!'
  },
  anonymize: {
    on: ' ・ @{user}: Your logins & logouts will be anonymous by now.',
    off: ' ・ @{user}: Your logins & logouts won’t me anonymous anymore.'
  },
  fName: '#SetFakeName ・ :[FiBo]',
  pos: {
    idle: '#Teleport -117145 -66735 37125 "' + botName + '"',
    outside: '#Teleport -116360 -66380 37477 "' + botName + '"'
  },
  pPos: {
    firstJoin: '#Teleport -113641 -64016 37682 {userID}',
    inside: '#Teleport -116800 -66735 37065 {userID}',
    outside: '#Teleport -116101 -66406 37065 {userID}'
  },
  start: {
    reload: ' ・ Reloading...',
    reboot: ' ・ I will reboot my PC now. It can take up to 10 minutes untill I’m ready again.',
    ready: ' ・ I’m ready!'
  },
  in: {
    login: ' ・ >> {user} is joining << ・ ',
    logout: ' ・ >> {user} left << ・ ',
    kill: ':[Killfeed]: ・ >> {user1} {event} {user2} << ・ ',
    firstJoin: {
      fPoints: '#SetFamePoints 10 {userID}',
      welcome1: ':[Welcome]: ・ Welcome to the Server @{user}!',
      welcome2: ':[Welcome]: ・ Get your starterkit! Write: "/starterkit" in global-chat.',
      welcome3: ':[Welcome]: ・ You can open chat with "T" and change the scope with "TAB".',
      welcome4: ':[Welcome]: ・ If you have any questions, please don’t hesitate to contact us.'
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
      notEnough: ':[Transfer]: ・ @{user} You don’t have enough famepoints for this transaction.',
      notFound:
        ':[Transfer]: ・ @{user} I couldn’t find the recipient with that name. Make sure to tell the name as it is spelled in chat.',
      success: ':[Transfer]: ・ @{user} Your transaction was successful.',
      started: ':[Transfer]: ・ @{user} Transaction started. Please wait...',
      somethingWrong: ':[Transfer]: ・ @{user} Something went wrong. Please try again.'
    },
    pleaseWait: ':[Shop]: ・ @{user} Please be patient, your item should be there shortly.',
    noItem: ':[Shop]: ・ @{user} you need to tell me what Item you want to buy.',
    unknownItem: ':[Shop]: ・ @{user} I don’t know this item.',
    notNearShop: ':[Shop]: ・ @{user} you need to be near the shop to buy things.',
    notEnoughMoney: ':[Shop]: ・ @{user} you need at least {fame} Famepoints to buy this.',
    startSale:
      ':[Shop]: ・ @{user} your purchase of {item} for {fame} Famepoints starts shortly. You will be teleported to your Item when it’s done.',
    endSale: ':[Shop]: ・ @{user} you successfully bought {item} for {fame} Famepoints!',
    somethingWrong: ':[Shop]: ・ Something went wrong. Please try again.'
  },
  pub: {
    travel: {
      info: ':[Travel]: ・ @{user}: Every trip costs 5 Famepoints. Available FastTravel-Stations: D0, B2, Z0, A3, D4',
      unknownLoc: ':[Travel]: ・ @{user}: I couldn’t recognize the station you want to go to.',
      notEnough: ':[Travel]: ・ @{user}: You need to have 5 famepoints for this trip.',
      noStation: ':[Travel]: ・ @{user}: You aren’t near any Fasttravel station.',
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
    ping: ':[BadaBong]: ・ Pong прямо на тебя @{user} ;)',
    online: ':[Online]: ・ There are currently {players} Players online.',
    time: ':[Time]: ・ It is currently about {time}',
    restart: ':[Restart]: ・ Next restart will be in: {hours} hours and {minutes} minutes.'
  }
}
