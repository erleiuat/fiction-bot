const _SN = '[MODULE][GAMEBOT] -> '

const Command = require('./command')
const messages = require('./_messages').messages
const schedule = require('./schedule')
const commands = require('./_commands').commands
const routines = require('./routines')
const bot = require('../../service/bot/')

let run = false
let queue = {}
let sGlobal = 'local'
let sLocal = 'local'

exports.start = async function start() {
  routines.init(messages, sLocal, sGlobal)
  schedule.start(messages, sLocal, sGlobal)
  //let state = await bot.start()
  run = true
  return

  if (state.status == 'success') {
    /*
    let cmd = new Command(true)
    routines.botStart(cmd)
    await bot.execute(cmd)
    */
    run = true

    global.log.info(_SN + 'Started')
  } else global.log.warning(_SN + 'Unable to start Bot')
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

async function go() {
  while (!run) await global.time.sleep(0.001)
  if (process.env.TIMEOUT_DCWRITER) await global.time.sleep(process.env.TIMEOUT_DCWRITER)
}

function addToQueue(cmd) {
  let timestamp = new Date().getTime()
  queue[timestamp] = cmd
  return timestamp
}

async function executeCommand() {
  await go()

  if (!Object.keys(queue).length) return
  run = false

  while (Object.keys(queue).length) {
    let key = Object.keys(queue).sort()[0]
    if (queue[key]) {
      global.log.debug(_SN + 'Executing: ' + JSON.stringify(queue[key]))
      //await bot.execute(queue[key])
      delete queue[key]
    }
  }

  run = true
}

async function processCommand(cmd) {
  let key = addToQueue(cmd)
  executeCommand(key)
}

exports.sendFromSchedule = async function sendFromSchedule(action) {
  let cmd = new Command()
  if (action.properties.type == 'messages') {
    for (const msg of action.properties.values) cmd.addMessage(msg.scope, msg.content)
  }
  processCommand(cmd)
}

exports.sendFromDC = async function sendFromDC(action) {
  let cmd = new Command()

  switch (action.type) {
    case 'console':
      routines.dcMessage(cmd, action)
      processCommand(cmd)
      break
    case 'chat':
      routines.dcMessage(cmd, action)
      processCommand(cmd)
      break
    default:
      global.log.warning(_SN + 'sendFromDC(): Type not recognized: ' + action.type)
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
        //if (!commands[cmdKey].scopes.includes(action.properties.scope)) return
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
      processCommand(cmd)
      break

    case 'mine':
      cmd.addMessage(sGlobal, messages.in.traps)
      processCommand(cmd)
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
      processCommand(cmd)
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

      processCommand(cmd)
      break
  }
}
