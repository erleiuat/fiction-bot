const _SN = '[MODULE][GAMEBOT] -> '

const playerReporter = require('./playerReporter')
const messages = require('./_messages').messages
const commands = require('./_commands').commands
const bot = require('../../service/bot/')
const schedule = require('./schedule')
const routines = require('./routines')
const Command = require('./command')

let run = false
let queue = {}
let sGlobal = process.env.SETTING_CHAT_GLOBAL_SCOPE
let sLocal = process.env.SETTING_CHAT_LOCAL_SCOPE

exports.start = async function start(dcClient) {
  routines.init(messages, sLocal, sGlobal)
  schedule.start(messages, sLocal, sGlobal)
  playerReporter.start(dcClient, routines)

  let state = await bot.start()
  if (state.status == 'success') {
    let cmd = new Command(true)
    routines.botStart(cmd)
    run = true
    await executeCommand(cmd)
    global.log.info(_SN + 'Started')
  } else global.log.error(_SN + 'Unable to start Bot')
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

async function go() {
  while (!run) await global.time.sleep(0.001)
}

function addToQueue(cmd) {
  let timestamp = new Date().getTime()
  queue[timestamp] = cmd
  return timestamp
}

async function executeCommand(cmd) {
  await go()
  run = false
  global.log.debug(_SN + 'Executing: ' + JSON.stringify(cmd))
  let data = await bot.execute(cmd)
  if (cmd.clearQueue) queue = {}
  run = true
  return data
}

exports.executeCommand = executeCommand

async function executeQueue() {
  if (!Object.keys(queue).length) return

  while (Object.keys(queue).length) {
    let key = Object.keys(queue).sort()[0]
    if (queue[key]) {
      await executeCommand(queue[key])
      if (queue[key]) delete queue[key]
    }
  }
}

async function queueCommand(cmd) {
  let key = addToQueue(cmd)
  executeQueue(key)
}

exports.sendFromSchedule = async function sendFromSchedule(action) {
  let cmd = new Command()
  if (action.properties.type == 'messages') {
    for (const msg of action.properties.values) cmd.addMessage(msg.scope, msg.content)
  }
  queueCommand(cmd)
}

exports.sendFromDC = async function sendFromDC(action) {
  let cmd = new Command()

  switch (action.type) {
    case 'console':
      routines.dcMessage(cmd, action)
      executeCommand(cmd)
      break
    case 'chat':
      routines.dcMessage(cmd, action)
      queueCommand(cmd)
      break
    default:
      global.log.error(_SN + 'sendFromDC(): Type not recognized: ' + action.type)
      cmd = null
      break
  }
}

exports.sendFromLog = async function sendFromLog(action) {
  let cmd = new Command()

  switch (action.type) {
    case 'chat':
      if (!action.properties.isCommand) break
      let cmdKey = action.properties.value.split(' ')[0].trim()
      if (commands[cmdKey]) {
        if (!commands[cmdKey].scopes.includes(action.properties.scope)) return
        let userProps = global.userManager.getUserProperties(action.user)
        if (
          userProps.allowBotCommands.includes('/*') ||
          userProps.allowBotCommands.includes(cmdKey)
        ) {
          await routines[commands[cmdKey].routine](cmd, action)
        } else {
          cmd.addMessage(sGlobal, messages.noPermission.replace('{user}', action.user.char.name))
        }
      } else
        cmd.addMessage(sGlobal, messages.unknownCommand.replace('{user}', action.user.char.name))
      queueCommand(cmd)
      break

    case 'mine':
      cmd.addMessage(sGlobal, messages.in.traps)
      queueCommand(cmd)
      break

    case 'kill':
      if (action.properties.event) break
      let event = 'killed'
      if (action.properties.type == 'comatosed') event = 'knocked out'
      cmd.addMessage(
        sGlobal,
        messages.in.kill
          .replace('{user1}', action.properties.causer.char.name)
          .replace('{event}', event)
          .replace('{user2}', action.user.char.name)
      )
      queueCommand(cmd)
      break

    case 'auth':
      let userProps = global.userManager.getUserProperties(action.user)
      if (userProps.hideLogin) break
      if (action.properties.authType == 'login') {
        cmd.addMessage(sGlobal, messages.in.login.replace('{user}', action.user.char.name))
        if (action.user.stats.totalLogins <= 1) {
          cmd.addMessage(sGlobal, messages.pPos.firstJoin.replace('{userID}', action.user.steamID))
          cmd.addMessage(
            sGlobal,
            messages.in.firstJoin.fPoints.replace('{userID}', action.user.steamID)
          )
          cmd.addMessage(
            sGlobal,
            messages.in.firstJoin.welcome.replace('{user}', action.user.char.name)
          )
        }
      } else cmd.addMessage(sGlobal, messages.in.logout.replace('{user}', action.user.char.name))

      queueCommand(cmd)
      break
  }
}
