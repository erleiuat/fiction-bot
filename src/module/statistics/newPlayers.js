const _SN = '[MODULE][STATISTICS][NEWPLAYERS] -> '

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

  let weeklyAvgDays = 0
  let weeklyAvg = 0

  for (const date of dates) {
    if (listObj[date].lastWeek) {
      weeklyAvgDays++
      weeklyAvg += listObj[date].total
    }

    msgEntry +=
      divider +
      '__**New Users from ' +
      date +
      ':**__ \n_Total: ' +
      listObj[date].total +
      '_\n\n\u200b'

    for (const user of listObj[date].users) {
      let firstLogin = toDateKey(new Date(user.firstLogin).getTime())
      let lastLogin = toDateKey(new Date(user.lastLogin).getTime())

      let userEntry =
        spaces1 +
        '◽️ ** ' +
        user.char.name.replace(/\*/g, '').replace(/_/g, '') +
        '** (' +
        user.char.id +
        ')\n' +
        spaces2 +
        'SteamID: ' +
        user.steamID +
        '\n' +
        spaces2 +
        'First Login: ' +
        firstLogin.key +
        ' - ' +
        firstLogin.time +
        '\n' +
        spaces2 +
        'Last Login: ' +
        lastLogin.key +
        ' - ' +
        lastLogin.time +
        '\n'

      if (msgEntry.length + userEntry.length >= 1900) {
        tmpMsgs.push(msgEntry)
        msgEntry = ''
      }

      msgEntry += userEntry
    }
  }

  let avgMsg =
    divider +
    '**Average last week:** __**' +
    Math.round((weeklyAvg / weeklyAvgDays) * 100) / 100 +
    ' / Day**__ \n\n\u200b'

  if (msgEntry.length + avgMsg.length >= 2000) {
    tmpMsgs.push(msgEntry)
    msgEntry = ''
  }

  msgEntry += avgMsg
  tmpMsgs.push(msgEntry)
  return tmpMsgs
}

exports.check = function check() {
  let today = new Date().getTime()
  let lastWeek = today - 7 * 24 * 60 * 60 * 1000

  let list = {}
  let firstDate = today
  let lastDate = today

  for (const user in global.userManager.users) {
    let tmpUser = global.userManager.users[user]
    if (firstDate > tmpUser.stats.firstJoin) firstDate = tmpUser.stats.firstJoin
    let keyObj = toDateKey(tmpUser.stats.firstJoin)
    if (!list[keyObj.key])
      list[keyObj.key] = {
        lastWeek: tmpUser.stats.firstJoin >= lastWeek,
        total: 0,
        users: []
      }
    list[keyObj.key].total++
    list[keyObj.key].users.push({
      char: { ...tmpUser.char },
      steamID: tmpUser.steamID,
      firstLogin: tmpUser.stats.firstJoin,
      lastLogin: tmpUser.auth.lastLogin
    })
  }

  let eachDay = firstDate
  while (eachDay < lastDate) {
    let keyObj = toDateKey(eachDay)
    if (!list[keyObj.key])
      list[keyObj.key] = {
        lastWeek: eachDay >= lastWeek,
        total: 0,
        users: []
      }
    eachDay += 24 * 60 * 60 * 1000
  }

  return list
}
