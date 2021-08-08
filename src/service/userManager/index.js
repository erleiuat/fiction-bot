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
  connectionCodes = {}

  constructor() {
    if (!fs.existsSync('./data/userManager/updates/'))
      fs.mkdirSync('./data/userManager/updates/', { recursive: true })
    if (!fs.existsSync('./data/userManager/backup/updates/'))
      fs.mkdirSync('./data/userManager/backup/updates/', { recursive: true })
    this.loadCached()
    this.importUpdates()
    this.iterateSave()
  }

  getBountyList() {
    let bountyList = []
    for (const e in this.users) {
      let u = this.users[e]

      let bountyLength = Object.keys(u.bounties).length
      if (!bountyLength) continue

      let totalAmount = 0
      for (const el in u.bounties) totalAmount += u.bounties[el]

      bountyList.push({ charName: u.char.name, bounties: bountyLength, totalAmount: totalAmount })
    }

    return bountyList
  }

  redeemConnectionCode(user, code) {
    let discordID = this.connectionCodes[code]
    if (!discordID) return false
    user.discordID = discordID
    this.saveChanges()
    delete this.connectionCodes[code]
    return true
  }

  getConnectionCode(discordID) {
    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let charactersLength = characters.length
    for (let i = 0; i < 10; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    this.connectionCodes[result] = discordID
    return result
  }

  mergeProps(...lists) {
    let fullList = []
    for (const list of lists)
      if (list && list.length)
        for (const item of list)
          if (!fullList.includes(item.toLowerCase())) fullList.push(item.toLowerCase())
    return fullList
  }

  getUserProperties(user, ignoreCache = false) {
    if (!ignoreCache && this.userPropertiesCache[user.steamID])
      return this.userPropertiesCache[user.steamID]

    let def = this.groups['_default']
    let group = this.groups[user.group]

    let merged = {
      group: user.group,
      undercover: user.undercover
    }

    merged = merge(merged, def, group, user.overwrite)

    let properties = {
      ...merged,
      allowBotCommands: this.mergeProps(
        def.allowBotCommands ? def.allowBotCommands : null,
        group.allowBotCommands ? group.allowBotCommands : null,
        user.overwrite.allowBotCommands ? user.overwrite.allowBotCommands : null
      ),
      allowCommands: this.mergeProps(
        def.allowCommands ? def.allowCommands : null,
        group.allowCommands ? group.allowCommands : null,
        user.overwrite.allowCommands ? user.overwrite.allowCommands : null
      ),
      hideCommandAlarms: this.mergeProps(
        def.hideCommandAlarms ? def.hideCommandAlarms : null,
        group.hideCommandAlarms ? group.hideCommandAlarms : null,
        user.overwrite.hideCommandAlarms ? user.overwrite.hideCommandAlarms : null
      ),
      hideCommands: this.mergeProps(
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

  getUserByCharName(charName) {
    let cName = charName.toString().trim().toLowerCase()
    for (const user in this.users)
      if (this.users[user].char.name.toLowerCase() === cName) return this.users[user]
    return false
  }

  getUserByDiscordID(discordID) {
    discordID = discordID.toString()
    for (const user in this.users)
      if (this.users[user].discordID === discordID) return this.users[user]
    return false
  }

  async iterateSave() {
    do {
      while (!this.#run) await global.time.sleep(0.05)
      this.saveChanges()
      await global.time.sleep(30)
    } while (true)
  }

  saveChanges() {
    this.#run = false
    fs.writeFileSync('./data/userManager/users.json', JSON.stringify(this.users))
    this.#run = true
  }

  loadCached() {
    this.#run = false

    let userCache = {}
    if (fs.existsSync('./data/userManager/users.json'))
      userCache = JSON.parse(fs.readFileSync('./data/userManager/users.json'))

    for (const u in userCache)
      this.users[u.toString()] = Object.assign(
        new User(userCache[u].steamID.toString(), userCache[u].group),
        userCache[u]
      )

    this.groups = this.loadGroups()
    for (const user in this.users) this.getUserProperties(this.users[user], true)

    this.#run = true
  }

  async importUpdates() {
    do {
      while (!this.#run) await global.time.sleep(0.05)
      this.#run = false

      let files = fs.readdirSync('./data/userManager/updates/')

      if (files.length) {
        let now = new Date().getTime()
        fs.copyFileSync(
          './data/userManager/users.json',
          './data/userManager/backup/users_' + now + '.json'
        )

        for (const e in files) {
          try {
            let data = JSON.parse(fs.readFileSync('./data/userManager/updates/' + files[e]))

            for (const user in data) {
              if (!this.users[user]) continue

              let tmpUser = this.users[user]
              let up = data[user]

              if ('undercover' in up) {
                tmpUser.undercover = up.undercover
                global.log.info(this.#_SN + 'Updated undercover for user: ' + user)
              }

              if ('discordID' in up) {
                tmpUser.discordID = up.discordID
                global.log.info(this.#_SN + 'Updated discordID for user: ' + user)
              }

              if ('group' in up) {
                tmpUser.group = up.group
                global.log.info(this.#_SN + 'Updated group for user: ' + user)
              }

              if ('overwrite' in up) {
                tmpUser.overwrite = up.overwrite
                global.log.info(this.#_SN + 'Updated overwrite for user: ' + user)
              }

              if ('char' in up) {
                tmpUser.char = up.char
                global.log.info(this.#_SN + 'Updated char for user: ' + user)
              }

              if ('info' in up) {
                tmpUser.info = up.info
                global.log.info(this.#_SN + 'Updated info for user: ' + user)
              }

              this.getUserProperties(this.users[user], true)
            }
          } catch (err) {
            global.log.error(this.#_SN + 'Failed to parse JSON: ' + files[e])
          }

          fs.renameSync(
            './data/userManager/updates/' + files[e],
            './data/userManager/backup/updates/' + now + '_' + files[e]
          )
        }

        this.saveChanges()
      }

      this.#run = true
      await global.time.sleep(15)
    } while (true)
  }

  loadGroups() {
    if (fs.existsSync('./data/userManager/group.json'))
      return JSON.parse(fs.readFileSync('./data/userManager/group.json'))
  }
}
