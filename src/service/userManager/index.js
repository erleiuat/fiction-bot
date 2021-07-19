const fs = require('fs')
const User = require('./user')
const merge = require('lodash.merge')

module.exports = class UserManager {
  #_SN = '[SERVICE][USERMANAGER] -> '
  #run = true

  users = {}
  groups = {}

  constructor() {
    this.loadGroups()
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

  getUserProperties(user) {
    let def = this.groups['_default']
    let group = this.groups[user.group]

    let merged = { group: user.group }
    merged = merge(merged, def, group, user.overwrite)

    return {
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
  }

  getActiveSessions() {
    console.log('todo')
  }

  getUserBySteamID(steamID, date) {
    steamID = parseInt(steamID)
    let user = this.users[steamID]
    if (!user) this.users[steamID] = new User(steamID, 'players')
    if (date) this.users[steamID].stats.lastActivity = date
    return this.users[steamID]
  }

  getUserByCharID(charID, date) {
    charID = parseInt(charID)
    for (const user in this.users)
      if (this.users[user].char.id === charID) {
        if (date) this.users[user].stats.lastActivity = date
        return this.users[user]
      }
    return false
  }

  getUserByDiscordID(discordID, date) {
    discordID = parseInt(discordID)
    for (const user in this.users)
      if (this.users[user].discordID === discordID) {
        if (date) this.users[user].stats.lastActivity = date
        return this.users[user]
      }
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
    while (!this.#run) await global.time.sleep(0.05)
    this.#run = false

    if (fs.existsSync('./data/userManager/users.json')) {
      let userCache = JSON.parse(fs.readFileSync('./data/userManager/users.json'))
      for (const u in userCache) {
        this.users[parseInt(u)] = Object.assign(
          new User(parseInt(userCache[u].steamID), userCache[u].group),
          userCache[u]
        )
      }
    }

    this.#run = true
    await global.time.sleep(60)
  }

  loadGroups() {
    if (fs.existsSync('./data/userManager/group.json'))
      this.groups = JSON.parse(fs.readFileSync('./data/userManager/group.json'))
  }
}
