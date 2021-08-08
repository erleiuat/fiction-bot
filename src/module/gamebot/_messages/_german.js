const botName = process.env.SETTING_BOT_NAME
const dcLink = process.env.DC_LINK

module.exports = {
  error: ':[Error]: ・ Etwas ging schief... Bitte versuche es erneut oder kontaktiere den Support.',
  tooEarly: ':[Error]: ・ Entschuldigung, du bist zu schnell. Bitte warte {minutes} Minuten.',
  unknownUser: ':[Error]: ・ Sorry, ich konnte den Benutzer {user} nicht finden.',
  noPermission: ':[Error]: ・ @{user}: Sorry, du hast nicht genügend Berechtigungen dazu.',
  unknownCommand: ':[Error]: ・ @{user}: Sorry, ich kenne diesen Befehl nicht.',
  capslock: ':[Warn]: ・ @{user}: Bitte schreibe nicht zu viel mit Capslock <3',
  traps:
    ':[Traps]: ・ Falls du gerade eine Falle plaziert hast beachte bitte, dass diese nur in und unmittelbar um deine Base erlaubt sind. Entferne die Falle wieder, falls dies nicht der Fall sein sollte.',

  'sKit.illegal':
    ':[Starterkit]: ・ @{user} du solltest dein Starterkit bereits erhalten haben ;) Wenn nicht, kontaktiere bitte den Support.',
  'sKit.start1':
    ':[Starterkit]: ・ @{user} du wirst zur Handelszone (grüner Kreis in B2) teleportiert, um dein Starterkit zu erhalten. Stelle sicher, dass du bereit bist und kein Fahrzeug fährst.',
  'sKit.start2':
    ':[Starterkit]: ・ @{user} du wirst in wenigen Sekunden in die Handelszone transportiert.',
  'shop.info':
    ':[Shop]: ・ @{user} Besuche https://shop.scumfiction.com/ um unser Angebot zu finden! Verwende dann "!buyitem [item] [Menge]", um etwas zu kaufen!',
  'shop.pleaseWait':
    ':[Shop]: ・ @{user} bitte hab etwas Geduld, dein Artikel sollte in Kürze bei dir sein.',
  'shop.noItem':
    ':[Shop]: ・ @{user} du musst mir noch sagen, welchen Artikel due kaufen möchtest.',
  'shop.unknownItem': ':[Shop]: ・ @{user} Ich kenne diesen Artikel nicht.',
  'shop.notNearShop': ':[Shop]: ・ @{user} du musst in der Nähe des Shops sein um Dinge zu kaufen.',
  'shop.notEnoughMoney':
    ':[Shop]: ・ @{user} du brauchst mindestens {fame} Ruhmpunkte um das zu kaufen.',
  'shop.startSale':
    ':[Shop]: ・ @{user} dein Kauf von {amount}x {item} für {fame} Ruhmpunkte beginnt in Kürze. Du wirst zu deinem Artikel teleportiert, wenn es soweit ist.',
  'shop.endSale':
    ':[Shop]: ・ @{user} du hast erfolgreich {amount}x {item} für {fame} Ruhmpunkte gekauft!',
  'shop.somethingWrong': ':[Shop]: ・ Es ist ein Fehler aufgetreten. Bitte versuche es erneut.',

  'help.m1': ':[Help]: ・ @{user}: Verfügbare Befehle (wenn der Bot online ist):',
  'help.m2':
    ':[Help]: ・ !voteday, !votesun, !online, !restart, !starterkit, !shop, !transfer, !fasttravel, !whoami, !ping',
  'help.m3':
    ':[Help]: ・ (Die meisten funktionieren nur im GLOBAL-Chat! Öffnen den Chat mit "T" und drücke "TAB", um den Chatraum zu wechseln)',
  'help.m4': ':[Help]: ・ Um weitere Befehle zu sehen, besuche uns auf Discord: ' + dcLink,

  ping: ':[BadaBong]: ・ Pong direkt zurück an dich @{user} ;)'
}
