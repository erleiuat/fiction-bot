const botName = process.env.SETTING_BOT_NAME
const dcLink = process.env.DC_LINK

module.exports = {
  error: ':[Error]: ・ Something went wrong. Please try again or contact support.',
  unknownUser: ':[Error]: ・ Sorry, I was not able to find the user {user}.',
  noPermission: ':[Error]: ・ @{user}: Sorry, You don’t have enough permissions for this.',
  unknownCommand: ':[Error]: ・ @{user}: Sorry, I don’t know this command.',
  capslock: ':[Warn]: ・ @{user}: Please don’t write in capslock too much <3',

  'lang.unknown':
    ':[Lang]: ・ @{user}: Sorry, I don’t know this language. Please check if you wrote it correctly.',
  'lang.list.1':
    ':[Lang]: ・ @{user}: You can switch between these languages: (use "!lang [language]" to change).',
  'lang.list.2':
    ':[Lang]: ・ @{user}: english, german, russian, bulgarian, spanish, french, italian, japanese, polish, chinese, dutch',
  'lang.set': ':[Lang]: ・ @{user}: Language set to {language}.',

  'newP.m1':
    ':[New]: ・ Welcome @{user}! You are currently in a safezone, which means that no other players or zombies can harm you.',
  'newP.m2':
    ':[New]: ・ However, as soon as you leave this area, the law of the wilderness applies and you are no longer safe from anything or anyone.',
  'newP.m3':
    ':[New]: ・ You can open chat with "T" and change the scope with "TAB". There are many commands available to you, like "!lang" which changes the language I use to speak with you.',
  'newP.m4':
    ':[New]: ・ But there are a lot more commands. You can see some of them by writing "!help", and even more as well as many other features on our Discord: ' +
    dcLink,
  'newP.m5':
    ':[New]: ・ If you got any issues or questions, please don’t hesitate to contact us. We wish you a lot of fun and good luck!  ',

  'connect.help':
    ':[Connect]: ・ Send me a private message on Discord (FictionBot#9302) with the content "!connect" to get your pairing-code! You can also just write this command into any channel on our Discord-Server! ' +
    dcLink,
  'connect.nope':
    ':[Connect]: ・ Sorry, this didn’t work. Try getting a new code over on Discord or contact support.',
  'connect.yap': ':[Connect]: ・ Your Discord account has been successfully paired!',

  'rules.intro': ':[Rules]: ・ These are the rules on the server. Check Discord for more details.',
  'rules.notFound': ':[Rules]: ・ There is no rule #{number}',
  'rules.r1': ':[Rules]: ・ #1 DBAA / Don’t be an asshole',
  'rules.r2': ':[Rules]: ・ #2 No purposeless destruction',
  'rules.r3': ':[Rules]: ・ #3 No destruction of vehicles',
  'rules.r4': ':[Rules]: ・ #4 No Bambi kills',
  'rules.r5': ':[Rules]: ・ #5 Maximum 1 vehicle per player + 1 spare vehicle per squad',
  'rules.r6': ':[Rules]: ・ #6 Write in English or German in global chat and don’t spam',
  'rules.r7': ':[Rules]: ・ #7 No thievery in the Tradingzone B2',
  'rules.r8': ':[Rules]: ・ #8 Don’t raid if your base is within the safe zone Z0',
  'rules.r9': ':[Rules]: ・ #9 Traps only in own flag circle and NOT on roads or POIs',

  'anonymize.on': ' ・ @{user}: Your logins & logouts will be anonymous by now.',
  'anonymize.off': ' ・ @{user}: Your logins & logouts won’t me anonymous anymore.',

  traps:
    ':[Traps]: ・ If you have just placed a trap, please note that this is only allowed in and immediately around your Base. Remove the trap if this is not the case.',

  'sKit.illegal':
    ':[Starterkit]: ・ @{user} you should have already received your starterkit ;) If not, please contact support.',
  'sKit.start1':
    ':[Starterkit]: ・ @{user} you will be teleported to the tradingzone (green circle in B2) to receive your starterkit. Make sure you are ready and not driving a vehicle.',
  'sKit.start2':
    ':[Starterkit]: ・ @{user} you will be transported to the tradingzone in a few seconds.',
  'sKit.done':
    ':[Starterkit]: ・ @{user} your starterkit should now be there and your Quad should be waiting for you outside.',

  'trans.form': ':[Transfer]: ・ @{user} Use this format: "!transfer [amount] [user]"',
  'trans.notEnough':
    ':[Transfer]: ・ @{user} You don’t have enough famepoints for this transaction.',
  'trans.notFound':
    ':[Transfer]: ・ @{user} I couldn’t find the recipient with that name. Make sure to tell the name as it is spelled in chat.',
  'trans.success': ':[Transfer]: ・ @{user} Your transaction was successful.',
  'trans.started': ':[Transfer]: ・ @{user} Transaction started. Please wait...',
  'trans.somethingWrong': ':[Transfer]: ・ @{user} Something went wrong. Please try again.',

  'shop.info':
    ':[Shop]: ・ @{user} Check https://shop.scumfiction.com/ to find our range of products! Then, use "!buyitem [item_key] [amount]" to buy something!',
  'shop.pleaseWait': ':[Shop]: ・ @{user} Please be patient, your item should be there shortly.',
  'shop.noItem': ':[Shop]: ・ @{user} you need to tell me what Item you want to buy.',
  'shop.unknownItem': ':[Shop]: ・ @{user} I don’t know this item.',
  'shop.notNearShop': ':[Shop]: ・ @{user} you need to be near the shop to buy things.',
  'shop.notEnoughMoney': ':[Shop]: ・ @{user} you need at least {fame} Famepoints to buy this.',
  'shop.startSale':
    ':[Shop]: ・ @{user} your purchase of {amount}x {item} for {fame} Famepoints starts shortly. You will be teleported to your Item when it’s done.',
  'shop.endSale':
    ':[Shop]: ・ @{user} you successfully bought {amount}x {item} for {fame} Famepoints!',
  'shop.somethingWrong': ':[Shop]: ・ Something went wrong. Please try again.',

  'travel.info':
    ':[Travel]: ・ @{user}: Every trip costs 5 Famepoints. Available FastTravel-Stations: D0, B2, Z0, A3, D4',
  'travel.unknownLoc': ':[Travel]: ・ @{user}: I couldn’t recognize the station you want to go to.',
  'travel.notEnough': ':[Travel]: ・ @{user}: You need to have 5 famepoints for this trip.',
  'travel.noStation': ':[Travel]: ・ @{user}: You aren’t near any Fasttravel station.',
  'travel.start':
    ':[Travel]: ・ @{user}: Your trip will start shortly. It will cost you 5 famepoints.',
  'travel.somethingWrong': ':[Travel]: ・ @{user}: Something went wrong. Please try again.',

  'help.m1': ':[Help]: ・ @{user}: Available commands (if bot is online):',
  'help.m2':
    ':[Help]: ・ !voteday, !votesun, !online, !restart, !starterkit, !shop, !transfer, !whoami, !ping, !anonymize, !connect',
  'help.m3':
    ':[Help]: ・ (Most will only work in GLOBAL Chat! Open chat with "T" and press "TAB" to change chatroom)',
  'help.m4': ':[Help]: ・ To see more commands check Discord: ' + dcLink,

  ping: ':[BadaBong]: ・ Pong right back at you @{user} ;)',
  online: ':[Online]: ・ There are currently {players} Players online.',
  time: ':[Time]: ・ It is currently about {time}',
  restart: ':[Restart]: ・ Next restart will be in: {hours} hours and {minutes} minutes.'
}
