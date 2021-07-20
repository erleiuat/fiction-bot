module.exports = class User {
  steamID = null
  discordID = null

  group = null
  overwrite = {}

  char = {
    id: null,
    name: null,
    fakeName: null
  }

  auth = {
    ip: null,
    isDrone: null,
    lastLogin: null,
    lastLogout: null
  }

  stats = {
    firstJoin: null,
    lastActivity: 0,
    totalLogins: 0,
    totalPlaytime: 0,
    totalMessages: {
      local: 0,
      global: 0,
      squad: 0
    }
  }

  info = {
    starterkit: null
  }

  kills = {}

  session = {
    current: null,
    history: {}
  }

  constructor(steamID, group = 'players') {
    this.steamID = steamID.toString()
    this.group = group
  }

  setActivity(timestamp) {
    if (this.stats.lastActivity < timestamp) this.stats.lastActivity = timestamp
  }

  activeSession() {
    let now = new Date().getTime()

    if (!Object.keys(this.session.history).length) return false
    for (const el in this.session.history) {
      if (!this.session.history[el].end) {
        let sRestart = new Date(this.session.history[el].start)

        if (sRestart.getHours() < 6) sRestart.setHours(6, 0, 0)
        else if (sRestart.getHours() < 12) sRestart.setHours(12, 0, 0)
        else if (sRestart.getHours() < 18) sRestart.setHours(18, 0, 0)
        else if (sRestart.getHours() > 18) {
          sRestart.setDate(sRestart.getDate() + 1)
          sRestart.setHours(0, 0, 0)
        }

        if (sRestart.getTime() < now) {
          this.session.history[el].end = this.session.history[el].start + 10
          this.session.history[el].duration = 10
        } else {
          this.session.current = el
          return this.session.history[el]
        }
      }
    }
    return false
  }

  startSession(dateObj, ip, isDrone = false) {
    let aSession = this.activeSession()
    if (aSession) this.endSession(new Date(aSession.start + 10), aSession.start)

    let loginTime = dateObj.getTime()
    if (!this.stats.firstJoin || this.stats.firstJoin > loginTime) this.stats.firstJoin = loginTime

    if (this.auth.lastLogin < loginTime)
      this.auth = {
        isDrone: isDrone,
        ip: ip,
        lastLogin: loginTime,
        lastLogout: null
      }

    const session = {
      start: dateObj.getTime(),
      end: false,
      duration: null
    }

    this.setActivity(loginTime)
    this.stats.totalLogins++
    this.session.history[session.start] = session
    this.session.current = session.start
  }

  endSession(dateObj, sessionKey = this.session.current) {
    if (this.session.history[sessionKey]) {
      let logoutTime = dateObj.getTime()
      this.session.history[sessionKey].end = logoutTime
      this.session.history[sessionKey].duration =
        logoutTime - this.session.history[sessionKey].start
      this.setActivity(logoutTime)
      this.stats.totalPlaytime += this.session.history[sessionKey].duration
      if (this.auth.lastLogout < logoutTime) this.auth.lastLogout = logoutTime
    }
    if (this.session.current == sessionKey) this.session.current = null
  }

  addKill(action) {
    this.kills[action.timestamp] = {
      type: action.properties.type == 'died' ? 'kill' : 'coma',
      event: action.properties.event,
      distance: action.properties.distance,
      suicide: action.user.steamID == action.properties.causer.steamID,
      victim: {
        steamID: action.user.steamID,
        char: {
          id: action.user.char.id,
          name: action.user.char.name
        }
      },
      weapon: action.properties.weapon
    }
  }
}
