const fs = require('fs')
const User = require('./user')
const merge = require('lodash.merge')

/*
var mysql = require('mysql')

var con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
})

con.connect(function (err) {
  if (err) throw err
})
*/

module.exports = class UserManager {
  #_SN = '[SERVICE][USERMANAGER] -> '
  #run = true

  users = {}
  groups = {}
  userPropertiesCache = {}

  constructor() {
    this.syncLists()
    this.saveChanges()
  }

  mergeProps(...lists) {
    let fullList = []
    for (const list of lists)
      if (list && list.length)
        for (const item of list) if (!fullList.includes(item)) fullList.push(item)
    return fullList
  }

  getPlaytime(user, startDate, endDate) {}

  getUserProperties(user, ignoreCache = false) {
    if (!ignoreCache && this.userPropertiesCache[user.steamID])
      return this.userPropertiesCache[user.steamID]

    let def = this.groups['_default']
    let group = this.groups[user.group]

    let merged = { group: user.group }
    merged = merge(merged, def, group, user.overwrite)

    let properties = {
      ...merged,
      allowBotCommands: this.mergeProps(
        def.allowBotCommands ? def.allowBotCommands : null,
        group.allowBotCommands ? group.allowBotCommands : null,
        user.overwrite.allowBotCommands ? user.overwrite.allowBotCommands : null
      ),
      hideCommandAlarms: [].concat(
        def.hideCommandAlarms ? def.hideCommandAlarms : null,
        group.hideCommandAlarms ? group.hideCommandAlarms : null,
        user.overwrite.hideCommandAlarms ? user.overwrite.hideCommandAlarms : null
      ),
      hideCommands: [].concat(
        def.hideCommands ? def.hideCommands : null,
        group.hideCommands ? group.hideCommands : null,
        user.overwrite.hideCommands ? user.overwrite.hideCommands : null
      )
    }

    this.userPropertiesCache[user.steamID] = properties
    return properties
  }

  createUser(steamID, group = 'players') {
    steamID = steamID.toString()
    if (!this.users[steamID]) this.users[steamID] = new User(steamID, group)
    return this.users[steamID]
  }

  getUserBySteamID(steamID) {
    steamID = steamID.toString()
    let user = this.users[steamID]
    if (!user) return false
    return this.users[steamID]
  }

  getUserByCharID(charID) {
    charID = charID.toString()
    for (const user in this.users) if (this.users[user].char.id === charID) return this.users[user]
    return false
  }

  getUserByDiscordID(discordID) {
    discordID = discordID.toString()
    for (const user in this.users)
      if (this.users[user].discordID === discordID) return this.users[user]
    return false
  }

  async saveChanges() {
    do {
      while (!this.#run) await global.time.sleep(0.05)
      this.#run = false
      fs.writeFileSync('./data/userManager/users.json', JSON.stringify(this.users))
      this.#run = true
      await global.time.sleep(5)
    } while (true)
  }

  async syncLists() {
    do {
      while (!this.#run) await global.time.sleep(0.05)
      this.#run = false

      let userCache = JSON.parse(fs.readFileSync('./data/userManager/users.json'))
      for (const u in userCache)
        this.users[u.toString()] = Object.assign(
          new User(userCache[u].steamID.toString(), userCache[u].group),
          userCache[u]
        )

      this.groups = this.loadGroups()
      for (const user in this.users) this.getUserProperties(this.users[user], true)

      this.#run = true
      await global.time.sleep(60)
    } while (false)
  }

  loadGroups() {
    if (fs.existsSync('./data/userManager/group.json'))
      return JSON.parse(fs.readFileSync('./data/userManager/group.json'))
  }
}
