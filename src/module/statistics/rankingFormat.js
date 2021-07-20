const _SN = '[MODULE][STATISTICS][RANKINGFORMAT] -> '

exports.suicides = function suicides(listObj) {
  let list = []
  for (const item in listObj) {
    //let userProps = global.userManager.getUserProperties(global.userManager.getUserBySteamID(item))
    list.push(listObj[item])
  }

  tmpMsg = '-----\n\n\n**Best Players by Suicides**\n_Beste Spieler nach Selbstmorden_'
  tmpMsg +=
    '```diff\n+Rank  \tSuicides\t  Player\n- - - - - - - - - - - - - - - - - - - - - - - -\n\n'
  list.sort((a, b) => (a.amount > b.amount ? 1 : -1)).reverse()
  for (let i = 0; i < 10 && i < list.length; i++) {
    tmpMsg +=
      global.nZero.form(i + 1, ' ') +
      '.\t\t   ' +
      global.nZero.form(list[i].amount, ' ') +
      '    \t\t' +
      list[i].char.name +
      '\n'
  }
  tmpMsg += '\n- - - - - - - - - - - - - - - - - - - - - - - -\n```\n'
  return tmpMsg
}

exports.killDistance = function killDistance(listObj) {
  let list = []
  for (const item in listObj) {
    let userProps = global.userManager.getUserProperties(global.userManager.getUserBySteamID(item))
    if (!userProps.ranking.hideKills) list.push(listObj[item])
  }

  tmpMsg = '-----\n\n\n**Best Players by Kill-Distance**\n_Beste Spieler nach Kill-Distanz_'
  tmpMsg +=
    '```diff\n+Rank  \tDistance\t\t Player\n- - - - - - - - - - - - - - - - - - - - - - - -\n\n'
  list.sort((a, b) => (a.amount > b.amount ? 1 : -1)).reverse()
  for (let i = 0; i < 10 && i < list.length; i++) {
    tmpMsg +=
      global.nZero.form(i + 1, ' ') +
      '.\t\t   ' +
      global.nZero.form(list[i].amount, ' ') +
      'm    \t\t' +
      list[i].char.name +
      '\n'
  }
  tmpMsg += '\n- - - - - - - - - - - - - - - - - - - - - - - -\n```\n'
  return tmpMsg
}

exports.eventKills = function eventKills(listObj) {
  let list = []
  for (const item in listObj) {
    let userProps = global.userManager.getUserProperties(global.userManager.getUserBySteamID(item))
    if (!userProps.ranking.hideKills) list.push(listObj[item])
  }

  tmpMsg = '-----\n\n\n**Best Players by EVENT-Kills**\n_Beste Spieler nach EVENT-Kills_'
  tmpMsg +=
    '```diff\n+Rank  \tEvent-Kills\t  Player\n- - - - - - - - - - - - - - - - - - - - - - - -\n\n'
  list.sort((a, b) => (a.amount > b.amount ? 1 : -1)).reverse()
  for (let i = 0; i < 10 && i < list.length; i++) {
    tmpMsg +=
      global.nZero.form(i + 1, ' ') +
      '.\t\t   ' +
      global.nZero.form(list[i].amount, ' ') +
      '    \t\t' +
      list[i].char.name +
      '\n'
  }
  tmpMsg += '\n- - - - - - - - - - - - - - - - - - - - - - - -\n```\n'
  return tmpMsg
}

exports.kills = function kills(listObj) {
  let list = []
  for (const item in listObj) {
    let userProps = global.userManager.getUserProperties(global.userManager.getUserBySteamID(item))
    if (!userProps.ranking.hideKills) list.push(listObj[item])
  }

  tmpMsg = '-----\n\n\n**Best Players by Kills**\n_Beste Spieler nach Kills_'
  tmpMsg +=
    '```diff\n+Rank  \tKills  \t\t Player\n- - - - - - - - - - - - - - - - - - - - - - - -\n\n'
  list.sort((a, b) => (a.amount > b.amount ? 1 : -1)).reverse()
  for (let i = 0; i < 10 && i < list.length; i++) {
    tmpMsg +=
      global.nZero.form(i + 1, ' ') +
      '.\t\t  ' +
      global.nZero.form(list[i].amount, ' ') +
      '    \t\t' +
      list[i].char.name +
      '\n'
  }
  tmpMsg += '\n- - - - - - - - - - - - - - - - - - - - - - - -\n```\n'
  return tmpMsg
}

exports.playtimes = function playtimes(listObj) {
  let list = []
  for (const item in listObj) {
    let userProps = global.userManager.getUserProperties(global.userManager.getUserBySteamID(item))
    if (!userProps.ranking.hidePlaytime) list.push(listObj[item])
  }

  tmpMsg =
    '-----\n\n\n**Best players in the last 7 days by playing time**\n_Beste Spieler der letzten 7 Tage nach Spielzeit_ ```diff\n+Rank  \tPlaytime\t\t Player\n- - - - - - - - - - - - - - - - - - - - - - - -\n\n'

  list.sort((a, b) => (a.amount > b.amount ? 1 : -1)).reverse()
  for (let i = 0; i < 10 && i < list.length; i++) {
    let formed = getDuration(list[i].amount)
    tmpMsg +=
      global.nZero.form(i + 1, ' ') +
      '.\t\t' +
      formed.d +
      'd ' +
      formed.h +
      'h  \t\t' +
      list[i].char.name +
      '\n'
  }

  tmpMsg += '\n- - - - - - - - - - - - - - - - - - - - - - - -\n```\n'

  return tmpMsg
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
