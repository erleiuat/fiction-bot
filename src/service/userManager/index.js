const fs = require('fs')
const User = require('./user')

module.exports = class UserManager {
  #run = true
  #_SN = '[SERVICE][USERMANAGER] -> '

  users = {}
  groups = {}

  constructor() {
    this.loadGroups()
    this.syncLists()
    this.saveChanges()
  }

  getUserProperties(user) {
    let group = this.groups[user.group]
    let properties = { group: user.group, ...group, ...user.overwrite }
    return properties
  }

  getUserBySteamID(steamID, date) {
    let user = this.users[steamID.toString()]
    if (!user) this.users[steamID.toString()] = new User(parseInt(steamID), 'players')
    if (date) this.users[steamID.toString()].stats.lastActivity = date
    return this.users[steamID.toString()]
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
    if (fs.existsSync('./data/userManager/users.json'))
      this.users = JSON.parse(fs.readFileSync('./data/userManager/users.json'))
    this.#run = true
    await global.time.sleep(60)
  }

  loadGroups() {
    if (fs.existsSync('./data/userManager/group.json'))
      this.groups = JSON.parse(fs.readFileSync('./data/userManager/group.json'))
  }
}
