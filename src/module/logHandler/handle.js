const _SN = '[MODULE][LOGHANDLER][HANDLE] -> '
const fs = require('fs')

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

async function processUpdates(updatesObj, type, handleFunction) {
  global.log.info(_SN + 'Processing ' + type + ' updates')
  const typeLines = formLines(updatesObj[type])
  if (!typeLines) return
  typeLines.sort()
  await handleFunction(typeLines)
}

exports.updates = async function updates(updatesObj) {
  if (updatesObj['login']) await processUpdates(updatesObj, 'login', handleAuth)

  if (updatesObj['mines']) await processUpdates(updatesObj, 'mines', handleMine)

  if (updatesObj['admin']) processUpdates(updatesObj, 'admin', handleAdmin)

  if (updatesObj['chat']) processUpdates(updatesObj, 'chat', handleChat)

  if (updatesObj['kill']) processUpdates(updatesObj, 'kill', handleKill)

  if (updatesObj['violations']) processUpdates(updatesObj, 'violations', handleViolation)
}

async function handleViolation(lines) {
  for (line of lines) {
    let actionObj = initAction('violation', line)
    actionObj.properties.value = line.slice(21).trim()
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
    actionObj.properties.isCommand = content[1].trim().startsWith('!')

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
        global.log.error(_SN + 'handleAuth(logout) -> User not found: ' + charID)
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

    let tmpUser = global.userManager.getUserBySteamID(victim.steamID)
    if (!tmpUser) {
      global.log.error(_SN + 'handleKill -> Victim not found: ' + vicStr)
      continue
    }
    setActionUser(actionObj, tmpUser)

    let victimLoc = newLine.substring(newLine.lastIndexOf('VictimLoc')).trim()
    victimLoc = victimLoc.substring(victimLoc.indexOf(':') + 1, victimLoc.indexOf(']'))
    victimLoc = victimLoc.replace(/,/g, '').trim().split(' ')
    if (victimLoc)
      actionObj.properties.location.victim = {
        x: parseInt(victimLoc[0]),
        y: parseInt(victimLoc[1]),
        z: parseInt(victimLoc[2])
      }

    let cauStr = newLine
      .substring(newLine.indexOf(', Causer: ') + 9, newLine.lastIndexOf('Weapon: '))
      .trim()

    causer = {
      name: cauStr.substring(0, cauStr.lastIndexOf('(')).trim(),
      steamID: cauStr.substring(cauStr.lastIndexOf('(') + 1, cauStr.lastIndexOf(')')).trim()
    }

    actionObj.properties.weapon = newLine
      .substring(newLine.lastIndexOf(' Weapon: ') + 8, newLine.indexOf(']') + 1)
      .trim()

    let causerLoc
    if (causer.steamID == -1) {
      let i = 0

      do {
        i++
        let mineProps = global.mineManager.findTriggeredMine(actionObj.timestamp, victim)
        if (mineProps) causer = mineProps.mine.owner
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

      if (causerLoc)
        actionObj.properties.location.causer = {
          x: parseInt(causerLoc[0]),
          y: parseInt(causerLoc[1]),
          z: parseInt(causerLoc[2])
        }
    }

    actionObj.properties.causer = global.userManager.getUserBySteamID(causer.steamID)
    if (!actionObj.properties.causer)
      global.log.error(_SN + 'handleKill -> Causer not found: ' + cauStr)

    if (victimLoc && causerLoc) {
      let dx = causerLoc[0] - victimLoc[0]
      let dy = causerLoc[1] - victimLoc[1]
      let dz = causerLoc[2] - victimLoc[2]
      let dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2))
      distance = actionObj.properties.distance = Math.round(dist / 100)
    }

    if (actionObj.properties.causer) actionObj.properties.causer.addKill(actionObj)
    global.actionHandler.handle(actionObj)
  }
}

async function handleMine(lines) {
  let first = []
  let second = []

  for (line of lines) {
    let tmpLine = line.substring(line.indexOf(")' ") + 2).trim()
    if (tmpLine.startsWith('crafted') || tmpLine.startsWith('armed')) first.push(line)
    else second.push(line)
  }

  for (line of first) handleMineLine(line)
  for (line of second) handleMineLine(line)
}

function handleMineLine(line) {
  let actionObj = initAction('mine', line)
  let newLine = line.substring(line.indexOf(")' ") + 2).trim()
  let userProps = formUserProps(line.substring(22, line.indexOf(")' ") + 2))

  let tmpUser = global.userManager.getUserBySteamID(userProps.steamID)
  if (!tmpUser) {
    global.log.error(_SN + 'handleMine -> User not found: ' + userProps.steamID)
    return
  }
  setActionUser(actionObj, tmpUser)

  let mineProps = formMineProps(newLine, actionObj.user, actionObj.timestamp)
  actionObj.properties.action = mineProps.action

  if (mineProps.key) actionObj.properties.mine = global.mineManager.getMineByKey(mineProps.key)

  if (!actionObj.properties.mine) {
    if (mineProps.canCreate)
      actionObj.properties.mine = global.mineManager.createMine(mineProps, actionObj.timestamp)
    else if (mineProps.owner) actionObj.properties.mine = global.mineManager.findMine(mineProps)
    else
      actionObj.properties.mine = global.mineManager.findMineByLocation(
        mineProps.location,
        mineProps.type
      )
  }

  if (!actionObj.properties.mine) {
    global.log.error(_SN + 'handleMine -> Mine not found: ' + JSON.stringify(mineProps))
    return
  }

  let found = false
  if (Object.keys(actionObj.properties.mine.events).length > 1) {
    let tmpEvents = actionObj.properties.mine.events
    let after = actionObj.timestamp - 5 * 1000
    let before = actionObj.timestamp + 5 * 1000

    for (const e in tmpEvents)
      if (tmpEvents[e].action == actionObj.properties.action)
        if (tmpEvents[e].timestamp >= after && tmpEvents[e].timestamp <= before) found = true
  }

  actionObj.properties.mine.handleEvent(mineProps, actionObj.user, actionObj.timestamp)
  if (!found) global.actionHandler.handle(actionObj)
}

function setActionUser(actionObj, user) {
  actionObj.user = user
  actionObj.user.setActivity(actionObj.timestamp)
  actionObj.fakeName = actionObj.user.char.fakeName
}

function formMineProps(mineString, actUser, timestamp) {
  mStr = mineString.trim()

  let key = null
  let type = null
  let owner = null
  let canCreate = false
  let action = mStr.substring(0, mStr.indexOf(' ')).trim()

  if (action != 'disarmed') type = mStr.substring(mStr.indexOf('(') + 1, mStr.indexOf(')')).trim()
  if (mStr.includes(' from ')) {
    owner = formUserProps(mStr.substring(mStr.indexOf(' from ') + 5).trim())
    mStr = mStr.substring(0, mStr.indexOf(' from '))
  }

  let tmpLoc = mStr
    .substring(mStr.indexOf('on location(') + 12, mStr.lastIndexOf(')'))
    .split(' ')
    .map(el => el.slice(0, el.indexOf('.') + 5).trim())

  let location = {
    x: parseInt(tmpLoc[0]),
    y: parseInt(tmpLoc[1]),
    z: parseInt(tmpLoc[2])
  }

  let locationKey = global.mineManager.locationToKey(location)

  if (action == 'armed' || action == 'crafted') {
    canCreate = true
    owner = {
      steamID: actUser.steamID,
      char: {
        id: actUser.char.id,
        name: actUser.char.name
      }
    }
  }

  if (owner && owner.steamID)
    key = timestamp + '_' + owner.steamID + '_' + type.split(' ')[0].toLowerCase()

  return {
    key: key,
    locationKey: locationKey,
    canCreate: canCreate,
    action: action,
    type: type,
    location: location,
    owner: owner
  }
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
        mine: null
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
