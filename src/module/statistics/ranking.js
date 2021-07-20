const _SN = '[MODULE][STATISTICS][RANKING] -> '

exports.check = function check() {
  let lastWeek = new Date()
  lastWeek.setTime(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000)
  lastWeek = lastWeek.getTime()

  let playtimes = {}
  let kills = {}
  let eventKills = {}
  let killDistance = {}
  let suicides = {}

  for (const user in global.userManager.users) {
    let tmpUser = global.userManager.users[user]

    for (const kill in tmpUser.kills) {
      let tmpKill = tmpUser.kills[kill]

      if (!killDistance[user])
        killDistance[user] = {
          char: tmpUser.char,
          amount: 0
        }

      if (tmpKill.distance && tmpKill.distance > killDistance[user].amount) {
        killDistance[user].amount = tmpKill.distance
      }

      if (tmpKill.suicide) {
        if (!suicides[user])
          suicides[user] = {
            char: tmpUser.char,
            amount: 0
          }

        suicides[user].amount++
      } else if (tmpKill.event) {
        if (!eventKills[user])
          eventKills[user] = {
            char: tmpUser.char,
            amount: 0
          }

        eventKills[user].amount++
      } else {
        if (!kills[user])
          kills[user] = {
            char: tmpUser.char,
            amount: 0
          }

        kills[user].amount++
      }
    }

    for (const session in tmpUser.session.history) {
      let tmpSession = tmpUser.session.history[session]
      if (tmpSession.start >= lastWeek && tmpSession.duration) {
        if (!playtimes[user])
          playtimes[user] = {
            char: tmpUser.char,
            amount: 0
          }

        playtimes[user].amount += tmpSession.duration
      }
    }
  }

  return {
    playtimes: playtimes,
    kills: kills,
    eventKills: eventKills,
    killDistance: killDistance,
    suicides: suicides
  }
}
