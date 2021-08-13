const _SN = '[MODULE][STATISTICS][PLAYERS] -> '

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

function getDuration(milli) {
  let minutes = milli / 60000
  let hours = minutes / 60
  let days = Math.floor(Math.floor(hours) / 24)
  minutes = (hours - Math.floor(hours)) * 60
  hours = Math.floor(hours) - days * 24
  return {
    d: global.nZero.form(Math.floor(days)),
    h: global.nZero.form(Math.floor(hours)),
    m: global.nZero.form(Math.floor(minutes))
  }
}

exports.format = function format(listObj) {
  let dates = []
  for (const key in listObj) dates.push(key)
  dates.sort()

  let tmpMsgs = []
  let totalPlaytime = 0
  let totalAvgPlaytime = 0
  let msgEntry = ''

  for (const date of dates) {
    let user = listObj[date]

    totalPlaytime += user.stats.totalPlaytime
    let playtimeformed = getDuration(user.stats.totalPlaytime)
    let firstLogin = toDateKey(new Date(user.stats.firstJoin).getTime())
    let lastActivity = toDateKey(new Date(user.stats.lastActivity).getTime())
    let starterkit = user.info.starterkit ? toDateKey(user.info.starterkit) : null

    let avgPlaytime = user.stats.totalPlaytime / Object.keys(user.session.history).length
    totalAvgPlaytime += avgPlaytime

    let avgPlaytimeFormed = getDuration(avgPlaytime)

    let userEntry =
      spaces1 +
      '\u200b\n◽️ ** ' +
      user.char.name.replace(/\*/g, '').replace(/_/g, '') +
      '** (' +
      user.char.id +
      ')\n' +
      spaces2 +
      'Name: `' +
      user.char.name +
      '`\n' +
      spaces2 +
      'SteamID: ' +
      user.steamID +
      '\n' +
      spaces2 +
      'First login: ' +
      firstLogin.key +
      ' - ' +
      firstLogin.time +
      '\n' +
      spaces2 +
      'Last activity: ' +
      lastActivity.key +
      ' - ' +
      lastActivity.time +
      '\n' +
      spaces2 +
      'Total Playtime: ' +
      playtimeformed.d +
      'd ' +
      playtimeformed.h +
      'h ' +
      playtimeformed.m +
      'm ' +
      '\n' +
      spaces2 +
      'Avg. Playtime: ' +
      avgPlaytimeFormed.d +
      'd ' +
      avgPlaytimeFormed.h +
      'h ' +
      avgPlaytimeFormed.m +
      'm ' +
      '\n' +
      spaces2 +
      'IP: ' +
      user.auth.ip +
      '\n' +
      spaces2 +
      'Total Logins: ' +
      user.stats.totalLogins +
      '\n' +
      spaces2 +
      'Global-Chat Messages: ' +
      user.stats.totalMessages.global +
      '\n' +
      spaces2 +
      'Local-Chat Messages: ' +
      user.stats.totalMessages.local +
      '\n' +
      spaces2 +
      'Squad-Chat Messages: ' +
      user.stats.totalMessages.squad +
      '\n' +
      spaces2 +
      'Starterkit: ' +
      (starterkit ? starterkit.key + ' - ' + starterkit.time : 'No') +
      '\n'

    if (user.char.fakeName) userEntry += spaces2 + 'Fakename: ' + user.char.fakeName + '\n'
    tmpMsgs.push({ key: user.steamID, content: userEntry })
  }

  let formed1 = getDuration(totalPlaytime / dates.length)
  let formed2 = getDuration(totalAvgPlaytime / dates.length)
  let totalMsg =
    divider +
    '**Total Users:** __**' +
    dates.length +
    '**__ \n\u200b' +
    '**Avg. Playtime per User:** __**' +
    formed1.d +
    'd ' +
    formed1.h +
    'h ' +
    formed1.m +
    'm' +
    '**__ \n\u200b' +
    '**Avg. Session length:** __**' +
    formed2.d +
    'd ' +
    formed2.h +
    'h ' +
    formed2.m +
    'm' +
    '**__ \n\u200b'

  tmpMsgs.push({
    key: '--------------------------------------------------------------',
    content: totalMsg
  })

  return tmpMsgs
}

exports.check = function check() {
  let list = {}

  for (const user in global.userManager.users) {
    let tmpUser = global.userManager.users[user]
    let keyObj = toDateKey(tmpUser.stats.lastActivity)
    list[keyObj.key + '_' + keyObj.time + '_' + tmpUser.steamID] = tmpUser
  }

  return list
}
