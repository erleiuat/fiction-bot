const _SN = '[MODULE][STATISTICS][PLAYERSONLINE] -> '

const spaces1 = '\u0020\u0020'
const spaces2 = '\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020'
const divider = '\u200b\n\n--------------------------------------------------------------\n\n\u200b'

function toDateKey(timestamp) {
  let date = new Date(timestamp)
  let day = global.nZero.form(date.getDate())
  let month = global.nZero.form(date.getMonth() + 1)
  let year = global.nZero.form(date.getFullYear())
  let hour = global.nZero.form(date.getHours())
  let minute = global.nZero.form(date.getMinutes())
  let second = global.nZero.form(date.getSeconds())
  return {
    year: year,
    month: month,
    day: day,
    hour: hour,
    minute: minute,
    second: second,
    key: year + '/' + month + '/' + day,
    time: hour + ':' + minute + ':' + second
  }
}

exports.format = function format(listObj) {
  let dates = []
  for (const key in listObj) dates.push(key)
  dates.sort()

  let tmpMsgs = []
  let msgEntry = ''

  for (const date of dates) {
    let user = listObj[date]
    let login = toDateKey(new Date(user.lastLogin).getTime())

    let userEntry =
      spaces1 +
      '\u200b\n◽️ ** 1. ' +
      user.char.name.replace(/\*/g, '').replace(/_/g, '') +
      '** (' +
      user.char.id +
      ')\n' +
      spaces2 +
      'SteamID: ' +
      user.steamID +
      '\n' +
      spaces2 +
      'IP: ' +
      user.ip +
      '\n' +
      spaces2 +
      'Login: ' +
      login.key +
      ' - ' +
      login.time +
      '\n' +
      spaces2 +
      'Total Logins: ' +
      user.totalLogins +
      '\n' +
      spaces2 +
      'Drone: ' +
      (user.drone ? '**True**' : 'False') +
      '\n'

    if (msgEntry.length + userEntry.length >= 2000) {
      tmpMsgs.push(msgEntry)
      msgEntry = ''
    }

    msgEntry += userEntry
    tmpMsgs.push({ key: user.steamID, content: userEntry })
  }

  let totalMsg = divider + '**Total:** __**' + dates.length + '**__ \n\n\u200b'

  if (msgEntry.length + totalMsg.length >= 2000) {
    tmpMsgs.push(msgEntry)
    msgEntry = ''
  }

  msgEntry += totalMsg
  tmpMsgs.push(msgEntry)
  return tmpMsgs
}

exports.check = function check() {
  let list = {}

  for (const user in global.userManager.users) {
    let tmpUser = global.userManager.users[user]
    if (!tmpUser.session.current) continue
    let keyObj = toDateKey(tmpUser.stats.lastActivity)
    list[keyObj.key + '_' + tmpUser.steamID] = {
      char: { ...tmpUser.char },
      ip: tmpUser.auth.ip,
      steamID: tmpUser.steamID,
      lastLogin: tmpUser.auth.lastLogin,
      totalLogins: tmpUser.stats.totalLogins,
      drone: tmpUser.auth.isDrone
    }
  }

  return list
}
