const _SN = '[MODULE][STATISTICS][RANKING] -> '

exports.check = function check() {
  let now = new Date().getTime()
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
      if (tmpSession.start >= lastWeek) {
        if (!playtimes[user])
          playtimes[user] = {
            char: tmpUser.char,
            amount: 0
          }

        if (tmpSession.duration !== null) playtimes[user].amount += tmpSession.duration
        else {
          let activeDuration = now - tmpSession.start
          let activeMin = Math.round(activeDuration / 1000 / 60)
          playtimes[user].amount += activeMin * 60 * 1000
        }
      }
    }

    if (playtimes[user]) {
      let playHours = Math.round(playtimes[user].amount / 1000 / 60 / 60)
      setUserRank(global.userManager.users[user], playHours)
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

function setUserRank(user, playHours) {
  if (playHours <= 7) user.rank = 'Beginner'
  else if (playHours <= 14) user.rank = 'Trainee'
  else if (playHours <= 21) user.rank = 'Amateur'
  else if (playHours <= 28) user.rank = 'Expert'
  else if (playHours <= 35) user.rank = 'Veteran'
  else if (playHours <= 42) user.rank = 'Professional'
  else if (playHours <= 49) user.rank = 'Master'
  else if (playHours <= 56) user.rank = 'Legend'
  else if (playHours >= 56) user.rank = 'Immortal'
}
