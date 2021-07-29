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
  },
  shop: {
    info: ':[Shop]: ・ @{user} Besuche https://shop.scumfiction.com/ um unser Angebot zu finden! Verwende dann /buyitem [item_key], um etwas zu kaufen!',
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

  help: {
    m1: ':[Help]: ・ @{user}: Verfügbare Befehle (wenn der Bot online ist):',
    m2: ':[Help]: ・ /voteday, /votesun, /online, /restart, /starterkit, /shop, /transfer, /fasttravel, /whoami, /ping',
    m3: ':[Help]: ・ (Die meisten funktionieren nur im GLOBAL-Chat! Öffnen den Chat mit "T" und drücke "TAB", um den Chatraum zu wechseln)',
    m4: ':[Help]: ・ Um weitere Befehle zu sehen, besuche uns auf Discord: ' + dcLink
  },
  pingoo: ':[BadaBong]: ・ Pong direkt zurück an dich @{user} ;)'
}
