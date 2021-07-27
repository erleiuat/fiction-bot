//const botName = 'scumfiction'
//const botName = 'Chris P. Bacon'
const botName = process.env.SETTING_BOT_NAME

module.exports = {
  prefix: ' ・ ',
  error: ':[Error]: ・ Etwas ging schief... Bitte versuche es erneut oder kontaktiere den Support.',
  tooEarly: ':[Error]: ・ Entschuldigung, du bist zu schnell. Bitte warte {minutes} Minuten.',
  unknownUser: ':[Error]: ・ Sorry, ich konnte den Benutzer {user} nicht finden.',
  noPermission: ':[Error]: ・ @{user}: Sorry, du hast nicht genügend Berechtigungen dazu.',
  unknownCommand: ':[Error]: ・ @{user}: Sorry, ich kenne diesen Befehl nicht.',
  capslock: ':[Warn]: ・ @{user}: Bitte schreibe nicht zu viel mit capslock <3',
  resetStarter: ':[Starterkit]: ・ The Starterkit for {user} has been reset.',
  deactMine: ' ・ (Mine has been deactivated)',
  deactMineNotFound: ' ・ (Mine not found)',
  lang: {
    unknown:
      ':[Lang]: ・ @{user}: Sorry, I don’t know this language. Please check if you wrote it correctly.',
    list: ':[Lang]: ・ @{user}: You can switch between these languages: english, german, russian',
    ger: ':[Lang]: ・ @{user}: Language set to German.',
    eng: ':[Lang]: ・ @{user}: Language set to English.',
    rus: ':[Lang]: ・ @{user}: Language set to Russian.'
  },
  firstJoin: {
    m1: ':[Welcome]: ・ Welcome to the Server @{user}!',
    m2: ':[Welcome]: ・ Open chat with "T" and write "/new" to get started!'
  },
  newP: {
    m1: ':[New]: ・ Welcome to the Server @{user}!',
    m2: ':[New]: ・ Make sure you get your starterkit! Write: "/starterkit"',
    m3: ':[New]: ・ You can change the language I use to speak with you by writing: "/lang" (early-access feature, not complete)',
    m4: ':[New]: ・ You can open chat with "T" and change the scope with "TAB". Some commands only work in a specific scope, like the "/rules" command. Use "/rules" in local to get a list of the rules.',
    m5: ':[New]: ・ If you have any questions, please don’t hesitate to contact us. Use "@support" to directly notify an admin or mod.',
    m6: ':[New]: ・ Is it so dark that you can’t see something? Start a voting for daytime with "/voteday"!',
    m7: ':[New]: ・ There are quite a few more commands available. Get a list of some important ones by writing "/help".',
    m8: ':[New]: ・ To see all commands as well as tons of other features, join our Discord! https://discord.gg/pZtw7NPdrZ'
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
    m4: ':[Stats]: ・ Warnings: Capslock {caps} | Spam - | Rules -',
    m5: ':[Stats]: ・ Kills: {kills} (including events and suicides)'
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
    firstJoin: '#Teleport -116250 -64286 37312 {userID}',
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
    traps:
      ':[Traps]: ・ Falls du gerade eine Falle plaziert hast beachte bitte, dass diese nur in und unmittelbar um deine Base erlaubt sind. Entferne die Falle wieder, falls dies nicht der Fall sein sollte.',
    sKit: {
      illegal:
        ':[Starterkit]: ・ @{user} du solltest dein Starterkit bereits erhalten haben ;) Wenn nicht, kontaktiere bitte den Support.',
      start1:
        ':[Starterkit]: ・ @{user} du wirst zur Handelszone (grüner Kreis in B2) teleportiert, um dein Starterkit zu erhalten. Stelle sicher, dass du bereit bist und kein Fahrzeug fährst.',
      start2:
        ':[Starterkit]: ・ Schreibe "/ready", wenn du soweit bist. Du erhälst ein Quad, um wieder aus der Handelszone herauszukommen.',
      start3:
        ':[Starterkit]: ・ @{user} du wirst in wenigen Sekunden in die Handelszone transportiert.',
      done: ':[Starterkit]: ・ @{user} dein Starterkit sollte nun da sein und dein Quad sollte draußen auf dich warten.'
    }
  },
  shop: {
    info: ':[Shop]: ・ @{user} Besuche https://shop.scumfiction.com/ um unser Angebot zu finden! Verwende dann /buyitem [item_key], um etwas zu kaufen!',
    trans: {
      form: ':[Transfer]: ・ @{user} Use this format: /transfer [amount] [user]',
      notEnough: ':[Transfer]: ・ @{user} You don’t have enough famepoints for this transaction.',
      notFound:
        ':[Transfer]: ・ @{user} I couldn’t find the recipient with that name. Make sure to tell the name as it is spelled in chat.',
      success: ':[Transfer]: ・ @{user} Your transaction was successful.',
      started: ':[Transfer]: ・ @{user} Transaction started. Please wait...',
      somethingWrong: ':[Transfer]: ・ @{user} Something went wrong. Please try again.'
    },
    pleaseWait:
      ':[Shop]: ・ @{user} bitte hab etwas Geduld, dein Artikel sollte in Kürze bei dir sein.',
    noItem: ':[Shop]: ・ @{user} du musst mir noch sagen, welchen Artikel due kaufen möchtest.',
    unknownItem: ':[Shop]: ・ @{user} Ich kenne diesen Artikel nicht.',
    notNearShop: ':[Shop]: ・ @{user} du musst in der Nähe des Shops sein um Dinge zu kaufen.',
    notEnoughMoney:
      ':[Shop]: ・ @{user} du brauchst mindestens {fame} Ruhmpunkte um das zu kaufen.',
    startSale:
      ':[Shop]: ・ @{user} dein Kauf von {item} für {fame} Ruhmpunkte beginnt in Kürze. Du wirst zu deinem Artikel teleportiert, wenn es soweit ist.',
    endSale: ':[Shop]: ・ @{user} du hast erfolgreich {item} für {fame} Ruhmpunkte gekauft!',
    somethingWrong: ':[Shop]: ・ Es ist ein Fehler aufgetreten. Bitte versuche es erneut.'
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
      m1: ':[Help]: ・ @{user}: Verfügbare Befehle (wenn der Bot online ist):',
      m2: ':[Help]: ・ /voteday, /votesun, /online, /restart, /starterkit, /shop, /transfer, /fasttravel, /whoami, /ping',
      m3: ':[Help]: ・ (Die meisten funktionieren nur im GLOBAL-Chat! Öffnen den Chat mit "T" und drücke "TAB", um den Chatraum zu wechseln)',
      m4: ':[Help]: ・ Um weitere Befehle zu sehen, besuche uns auf Discord: https://discord.gg/pZtw7NPdrZ'
    },

    joke: ':[Joke]: ・ {joke}',
    ping: ':[BadaBong]: ・ Pong direkt zurück an dich @{user} ;)',
    online: ':[Online]: ・ There are currently {players} Players online.',
    time: ':[Time]: ・ It is currently about {time}',
    restart: ':[Restart]: ・ Next restart will be in: {hours} hours and {minutes} minutes.'
  }
}
