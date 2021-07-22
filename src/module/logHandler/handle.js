const _SN = '[MODULE][LOGHANDLER][HANDLE] -> '
const fs = require('fs')

let mines = {}

if (fs.existsSync('./data/logHandler/mines.json')) {
  mines = JSON.parse(fs.readFileSync('./data/logHandler/mines.json'))
}

async function safeMines() {
  do {
    await global.time.sleep(60)
    if (!fs.existsSync('./data/logHandler/'))
      fs.mkdirSync('./data/logHandler/', { recursive: true })
    fs.writeFileSync('./data/logHandler/mines.json', JSON.stringify(mines))
  } while (true)
}

safeMines()

function formLines(content) {
  let lines = []
  let tmpLines = content.trim().split(/\r?\n/)

  for (let line of tmpLines) {
    if (!line || !line.length) continue
    line = line.trim()
    if (line.length < 1) continue
    if (line.slice(20, 35).includes('Game version')) continue
    lines.push(line)
  }

  if (lines.length) return lines
  return false
}

exports.updates = async function updates(updatesObj) {
  for (const type in updatesObj) {
    if (updatesObj[type].length) {
      let lines = formLines(updatesObj[type])
      if (!lines) continue
      lines.sort()

      global.log.info(_SN + 'Processing ' + type + ' update')

      switch (type) {
        case 'login':
          await handleAuth(lines)
          break
        case 'chat':
          await handleChat(lines)
          break
        case 'admin':
          await handleAdmin(lines)
          break
        case 'kill':
          await handleKill(lines)
          break
        case 'mines':
          await handleMine(lines)
          break
        case 'violations':
          await handleViolation(lines)
          break
        default:
          global.log.info(_SN + 'Type not recognized: ' + type)
          break
      }
    }
  }
}

async function handleViolation(lines) {
  for (line of lines) {
    let actionObj = initAction('violation', line)
    actionObj.properties.value = line.slice(22).trim()
    global.actionHandler.handle(actionObj)
  }
}

async function handleChat(lines) {
  for (line of lines) {
    let actionObj = initAction('chat', line)
    let userProps = formUserProps(line.substring(22, line.indexOf(")' '") + 1))

    let tmpUser = global.userManager.getUserBySteamID(userProps.steamID)
    if (!tmpUser) {
      global.log.error(_SN + 'handleChat -> User not found: ' + userProps.steamID)
      continue
    }
    setActionUser(actionObj, tmpUser)

    let content = line.split("' '")[1].slice(0, -1).split(': ')
    actionObj.properties.scope = content[0].trim().toLowerCase()
    delete content[0]
    actionObj.properties.value = content.join(' ').trim()
    actionObj.properties.isCommand = content[1].trim().startsWith('/')

    actionObj.user.stats.totalMessages[actionObj.properties.scope]++
    global.actionHandler.handle(actionObj)
  }
}

async function handleAdmin(lines) {
  for (line of lines) {
    let actionObj = initAction('admin', line)
    let userProps = formUserProps(line.substring(22, line.indexOf("' Command")))

    let tmpUser = global.userManager.getUserBySteamID(userProps.steamID)
    if (!tmpUser) {
      global.log.error(_SN + 'handleAdmin -> User not found: ' + userProps.steamID)
      continue
    }
    setActionUser(actionObj, tmpUser)

    let content = line.split("' Command: '")[1].slice(0, -1).split(' ')
    let command = content[0]
    delete content[0]
    actionObj.properties = {
      command: '#' + command.trim(),
      value: content.join(' ').trim()
    }

    if (actionObj.properties.command.toLowerCase() == '#setfakename')
      actionObj.user.char.fakeName = actionObj.properties.value
    else if (actionObj.properties.command.toLowerCase() == '#clearfakename')
      actionObj.user.char.fakeName = null

    global.actionHandler.handle(actionObj)
  }
}

async function handleAuth(lines) {
  for (line of lines) {
    if (line.includes('logged in')) {
      let actionObj = initAction('auth', line)
      let propLine = line.slice(22, line.lastIndexOf("' logg")).trim()
      let userProps = formUserProps(propLine.slice(propLine.indexOf(' ') + 1))

      let tmpUser = global.userManager.getUserBySteamID(userProps.steamID)
      if (!tmpUser) tmpUser = global.userManager.createUser(userProps.steamID)
      setActionUser(actionObj, tmpUser)

      actionObj.fakeName = actionObj.user.char.fakeName
      actionObj.properties.authType = 'login'
      actionObj.user.char.id = userProps.char.id
      actionObj.user.char.name = userProps.char.name
      actionObj.user.auth = {
        isDrone: line.includes('drone'),
        ip: line.substring(22, line.lastIndexOf("' logg")).split(' ')[0].trim(),
        lastLogin: actionObj.date.getTime(),
        lastLogout: null
      }

      global.state.players++
      actionObj.user.startSession(actionObj.date)
      global.actionHandler.handle(actionObj)
    } else if (line.includes('logging out')) {
      let actionObj = initAction('auth', line)
      let charID = line.substring(line.indexOf(": '") + 3, line.lastIndexOf("' logg"))

      let tmpUser = global.userManager.getUserByCharID(charID)
      if (!tmpUser) {
        global.log.error(_SN + 'handleAuth(logout) -> User not found: ' + userProps.steamID)
        continue
      }
      setActionUser(actionObj, tmpUser)

      actionObj.properties.authType = 'logout'
      actionObj.user.auth.lastLogout = actionObj.date.getTime()

      global.state.players--
      actionObj.user.endSession(actionObj.date)
      global.actionHandler.handle(actionObj)
    } else {
      continue
    }
  }
}

async function handleKill(lines) {
  for (line of lines) {
    let actionObj = initAction('kill', line)
    let newLine = line
      .slice(20)
      .trim()
      .replace('Killer', 'Causer')
      .replace('KillerLoc', 'CauserLoc')
    if (newLine.startsWith('{')) continue

    // ------------------------ Build props

    actionObj.properties.type = newLine.substring(0, newLine.indexOf(': ')).trim().toLowerCase()
    actionObj.properties.event = newLine.toLowerCase().includes('participating in game event')

    let vicStr = newLine.substring(newLine.indexOf(': ') + 2, newLine.indexOf(', Causer: ')).trim()
    victim = {
      name: vicStr.substring(0, vicStr.lastIndexOf('(')).trim(),
      steamID: vicStr.substring(vicStr.lastIndexOf('(') + 1, vicStr.lastIndexOf(')')).trim()
    }

    let cauStr = newLine
      .substring(newLine.indexOf(', Causer: ') + 9, newLine.lastIndexOf('Weapon: '))
      .trim()
    causer = {
      name: cauStr.substring(0, cauStr.lastIndexOf('(')).trim(),
      steamID: cauStr.substring(cauStr.lastIndexOf('(') + 1, cauStr.lastIndexOf(')')).trim()
    }

    let weapon = newLine
      .substring(newLine.lastIndexOf(' Weapon: ') + 8, newLine.indexOf(']') + 1)
      .trim()

    let causerLoc
    if (causer.steamID == -1) {
      let i = 0

      do {
        i++

        if (mines[victim.steamID])
          for (const mine of mines[victim.steamID])
            if (
              mine.properties.action == 'triggered' &&
              actionObj.timestamp - 10 * 60 * 1000 < mine.timestamp &&
              actionObj.timestamp + 10 * 60 * 1000 > mine.timestamp
            ) {
              causer = {
                name: mine.properties.owner.char.name,
                steamID: mine.properties.owner.steamID
              }
            }

        if (causer.steamID == -1) await global.time.sleep(0.5)
      } while (causer.steamID == -1 && i < 20)

      if (causer.steamID == -1)
        global.log.error(_SN + 'No Mine-Entry found for kill: ' + victim.name)
    } else {
      causerLoc = newLine.substring(newLine.lastIndexOf('CauserLoc')).trim()
      causerLoc = causerLoc.substring(1, causerLoc.indexOf(']')).trim().split('VictimLoc:')[0]
      causerLoc = causerLoc
        .substring(causerLoc.indexOf(':') + 1)
        .replace(/,/g, '')
        .trim()
        .split(' ')
    }

    let victimLoc = newLine.substring(newLine.lastIndexOf('VictimLoc')).trim()
    victimLoc = victimLoc.substring(victimLoc.indexOf(':') + 1, victimLoc.indexOf(']'))
    victimLoc = victimLoc.replace(/,/g, '').trim().split(' ')

    // ------------------------ Create actionObj

    let tmpUser = global.userManager.getUserBySteamID(victim.steamID)
    if (!tmpUser) {
      global.log.error(_SN + 'handleKill -> Victim not found: ' + vicStr)
      continue
    }
    setActionUser(actionObj, tmpUser)

    actionObj.properties.causer = global.userManager.getUserBySteamID(causer.steamID)
    if (!actionObj.properties.causer)
      global.log.error(_SN + 'handleKill -> Causer not found: ' + cauStr)

    if (victimLoc)
      actionObj.properties.location.victim = {
        x: parseInt(victimLoc[0]),
        y: parseInt(victimLoc[1]),
        z: parseInt(victimLoc[2])
      }

    if (causerLoc)
      actionObj.properties.location.causer = {
        x: parseInt(causerLoc[0]),
        y: parseInt(causerLoc[1]),
        z: parseInt(causerLoc[2])
      }

    if (victimLoc && causerLoc) {
      let dx = causerLoc[0] - victimLoc[0]
      let dy = causerLoc[1] - victimLoc[1]
      let dz = causerLoc[2] - victimLoc[2]
      let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
      distance = actionObj.properties.distance = Math.round(dist / 100)
    }

    actionObj.properties.weapon = weapon

    if (actionObj.properties.causer) actionObj.properties.causer.addKill(actionObj)
    global.actionHandler.handle(actionObj)
  }
}

async function handleMine(lines) {
  for (line of lines) {
    let actionObj = initAction('mine', line)
    let newLine = line.substring(line.indexOf(")' ") + 2).trim()
    let userProps = formUserProps(line.substring(22, line.indexOf(")' ") + 2))

    let tmpUser = global.userManager.getUserBySteamID(userProps.steamID)
    if (!tmpUser) {
      global.log.error(_SN + 'handleMine -> User not found: ' + userProps.steamID)
      continue
    }
    setActionUser(actionObj, tmpUser)

    actionObj.properties.action = newLine.split(' ')[0].trim()
    tmpType = line.substring(line.indexOf('trap (') + 6)
    actionObj.properties.type = tmpType.substring(0, tmpType.indexOf(')')).trim()

    if (newLine.includes('on location(')) {
      tmpLoc = newLine.substring(newLine.indexOf('on location(') + 12)
      tmpLoc = tmpLoc.substring(0, tmpLoc.indexOf(')')).trim()
      loc = tmpLoc.split(' ').map(el => el.slice(0, el.indexOf('.') + 5).trim())
      actionObj.properties.location = {
        x: parseInt(loc[0]),
        y: parseInt(loc[1]),
        z: parseInt(loc[2])
      }
    }

    if (newLine.includes(') from')) {
      let steamID = newLine.split(') from ')[1].split(':')[0]
      actionObj.properties.owner = global.userManager.getUserBySteamID(steamID)
    }

    if (!mines[actionObj.user.steamID]) mines[actionObj.user.steamID] = []

    let found = false
    if (mines[actionObj.user.steamID].length) {
      let uMines = mines[actionObj.user.steamID]
      for (const mine of uMines) {
        if (
          mine.user.steamID == actionObj.user.steamID &&
          mine.properties.type == actionObj.properties.type &&
          mine.properties.action == actionObj.properties.action &&
          mine.timestamp >= actionObj.timestamp - 5 * 1000 &&
          mine.timestamp <= actionObj.timestamp + 5 * 1000
        ) {
          found = true
        }
        if (found) break
      }
    }

    mines[actionObj.user.steamID].push(actionObj)
    if (!found) global.actionHandler.handle(actionObj)
  }
}

function setActionUser(actionObj, user) {
  actionObj.user = user
  actionObj.user.setActivity(actionObj.timestamp)
  actionObj.fakeName = actionObj.user.char.fakeName
}

function formUserProps(userString) {
  let steamID = userString.trim().slice(0, 17).trim()
  let charName = userString.substring(18, userString.lastIndexOf('(')).trim()
  let charID = userString.substring(userString.lastIndexOf('(') + 1, userString.lastIndexOf(')'))
  return {
    steamID: steamID,
    char: {
      id: charID.toString(),
      name: charName
    }
  }
}

function initAction(actType, line) {
  let type = actType

  let timestring = line.slice(0, 19)
  let stampParts = timestring.split('-')
  let dP = stampParts[0].split('.')
  let tP = stampParts[1].split('.')
  let dateStr = dP[0] + '-' + dP[1] + '-' + dP[2] + 'T' + tP[0] + ':' + tP[1] + ':' + tP[2]
  let date = new Date(dateStr)
  date.setTime(date.getTime() + 2 * 60 * 60 * 1000)
  let timestamp = date.getTime()

  switch (actType) {
    case 'auth':
      properties = {
        authType: null
      }
      break
    case 'chat':
      properties = {
        scope: null,
        value: null,
        isCommand: false
      }
      break
    case 'admin':
      properties = {
        command: null,
        value: null
      }
      break
    case 'kill':
      properties = {
        type: null,
        weapon: null,
        event: false,
        causer: null,
        distance: null,
        location: {
          causer: null,
          victim: null
        }
      }
      break
    case 'mine':
      properties = {
        action: null,
        type: null,
        location: null,
        owner: null
      }
      break
    case 'violation':
      properties = {
        value: null
      }
      break
    default:
      properties = null
      break
  }

  return {
    origin: 'logHandler',
    timestamp: timestamp,
    date: date,
    type: type,
    user: null,
    fakeName: null,
    properties: properties
  }
}
