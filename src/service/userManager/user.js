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
    lastActivity: null
  }

  constructor(steamID, group) {
    this.steamID = parseInt(steamID)
    this.group = group
  }
}
