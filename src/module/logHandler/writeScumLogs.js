const _SN = '[MODULE][LOGHANDLER][WRITESCUMLOGS]'

const fs = require('fs')
const writeNewLogs = global.args.includes('scumlog')

const file_merged = './data/scumLogs/_scum.log'
const file_admin = './data/scumLogs/admin.log'
const file_chat = './data/scumLogs/chat.log'
const file_auth = './data/scumLogs/auth.log'
const file_kill = './data/scumLogs/kill.log'
const file_mine = './data/scumLogs/mine.log'
const file_violation = './data/scumLogs/violation.log'

function formStamp(d) {
  return (
    d.getFullYear() +
    '.' +
    global.nZero.form(d.getMonth() + 1) +
    '.' +
    global.nZero.form(d.getDate()) +
    '-' +
    global.nZero.form(d.getHours()) +
    ':' +
    global.nZero.form(d.getMinutes()) +
    ':' +
    global.nZero.form(d.getSeconds())
  )
}

function writeMerged(logName, stamp, content) {
  fs.appendFileSync(file_merged, '[' + stamp + ']' + '[' + logName + ']' + content + '\n')
}

exports.admin = async function admin(act) {
  if (!writeNewLogs) return

  let stamp = formStamp(act.date)
  let content = JSON.stringify({
    user: {
      steamID: act.user.steamID,
      ip: act.user.auth.ip,
      char: {
        name: act.user.char.name,
        id: act.user.char.id
      }
    },
    data: {
      command: act.properties.command,
      parameters: act.properties.value
    }
  })

  fs.appendFileSync(file_admin, '[' + stamp + ']' + content + '\n')
  writeMerged('ADMIN', stamp, content)
}

exports.chat = async function chat(act) {
  if (!writeNewLogs) return

  let stamp = formStamp(act.date)
  let content = JSON.stringify({
    user: {
      steamID: act.user.steamID,
      ip: act.user.auth.ip,
      char: {
        name: act.user.char.name,
        id: act.user.char.id
      }
    },
    data: {
      scope: act.properties.scope,
      value: act.properties.value
    }
  })

  fs.appendFileSync(file_chat, '[' + stamp + ']' + content + '\n')
  writeMerged('CHAT', stamp, content)
}

exports.auth = async function auth(act) {
  if (!writeNewLogs) return

  let stamp = formStamp(act.date)
  let content = JSON.stringify({
    user: {
      steamID: act.user.steamID,
      ip: act.user.auth.ip,
      char: {
        name: act.user.char.name,
        id: act.user.char.id
      }
    },
    data: {
      type: act.properties.authType,
      drone: act.user.auth.isDrone
    }
  })

  fs.appendFileSync(file_auth, '[' + stamp + ']' + content + '\n')
  writeMerged('AUTH', stamp, content)
}

exports.kill = async function kill(act) {
  if (!writeNewLogs) return

  let stamp = formStamp(act.date)
  let content = JSON.stringify({
    user: {
      steamID: act.user.steamID,
      ip: act.user.auth.ip,
      char: {
        name: act.user.char.name,
        id: act.user.char.id
      }
    },
    data: {
      type: act.properties.type,
      weapon: act.properties.weapon,
      event: act.properties.event,
      causer: act.properties.causer
        ? {
            steamID: act.properties.causer.steamID,
            char: {
              name: act.properties.causer.char.name,
              id: act.properties.causer.char.id
            }
          }
        : false,
      location: {
        victim: act.properties.location.victim,
        causer: act.properties.location.causer
      }
    }
  })

  fs.appendFileSync(file_kill, '[' + stamp + ']' + content + '\n')
  writeMerged('KILL', stamp, content)
}

exports.mine = async function mine(act) {
  if (!writeNewLogs) return

  let stamp = formStamp(act.date)
  let content = JSON.stringify({
    user: {
      steamID: act.user.steamID,
      ip: act.user.auth.ip,
      char: {
        name: act.user.char.name,
        id: act.user.char.id
      }
    },
    data: {
      action: act.properties.action,
      mine: act.properties.mine
        ? {
            type: act.properties.mine.type,
            location: act.properties.mine.location,
            owner: act.properties.mine.owner
              ? {
                  steamID: act.properties.mine.owner.steamID,
                  char: {
                    name: act.properties.mine.owner.char.name,
                    id: act.properties.mine.owner.char.id
                  }
                }
              : false
          }
        : false
    }
  })

  fs.appendFileSync(file_mine, '[' + stamp + ']' + content + '\n')
  writeMerged('MINE', stamp, content)
}

exports.violation = async function violation(act) {
  if (!writeNewLogs) return

  let stamp = formStamp(act.date)
  let content = JSON.stringify({
    data: { value: act.properties.value }
  })

  fs.appendFileSync(file_violation, '[' + stamp + ']' + content + '\n')
  writeMerged('VIOLATION', stamp, content)
}
