const _SN = '[MODULE][GAMEBOT] -> '

const playerReporter = require('./playerReporter')
const messages = require('./_messages/')
const commands = require('./_commands').commands
const bot = require('../../service/bot/')
const schedule = require('./schedule')
const routines = require('./routines/')
const Command = require('./command')

let run = false
let ready = false
let started = false
let sGlobal = process.env.SETTING_CHAT_GLOBAL_SCOPE
let sLocal = process.env.SETTING_CHAT_LOCAL_SCOPE

exports.executeCommand = executeCommand
exports.ready = ready

exports.start = async function start(dcClient) {
  routines.init(messages, sLocal, sGlobal)
  routines.chat.init(messages, sLocal, sGlobal)

  new Command().init(messages, sLocal, sGlobal)
  schedule.start(messages, sLocal, sGlobal)

  let state = { status: 'success' }
  if (!global.args.includes('test')) {
    playerReporter.start(dcClient, routines)
    state = await bot.start()
  }

  if (state.status == 'success') {
    let cmd = new Command(true)
    routines.botStart(cmd)
    run = true
    await executeCommand(cmd)
    global.log.info(_SN + 'Started')
    started = true
  } else global.log.error(_SN + 'Unable to start Bot')
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

async function go() {
  while (!run) await global.time.sleep(0.001)
}

async function executeCommand(cmd) {
  ready = false
  await go()
  run = false
  global.log.debug(_SN + 'Executing: ' + JSON.stringify(cmd))
  let data = { status: 'success' }
  if (!global.args.includes('test')) data = await bot.execute(cmd)
  else
    global.log.debug('\n' + _SN + '[TEST] -> Sending command to Bot:' + JSON.stringify(cmd) + '\n')
  if (!data || data.status == 'error') {
    global.log.error(
      _SN +
        'Bot-Command failed: ' +
        JSON.stringify(cmd) +
        ' ; Error:' +
        data.message +
        ' ; ' +
        data.type
    )
  }
  ready = true
  run = true
  return data
}

exports.sendFromSchedule = async function sendFromSchedule(action) {
  if (!started) return
  let cmd = new Command()
  if (action.properties.type == 'messages') {
    for (const msg of action.properties.values) cmd.addMessage(msg.scope, msg.content)
  }
  await executeCommand(cmd)
}

exports.sendFromDC = async function sendFromDC(action) {
  if (!started) return
  let cmd = new Command()

  switch (action.type) {
    case 'console':
      routines.dcMessage(cmd, action)
      await executeCommand(cmd)
      break
    case 'chat':
      routines.dcMessage(cmd, action)
      await executeCommand(cmd)
      break
    default:
      global.log.error(_SN + 'sendFromDC(): Type not recognized: ' + action.type)
      cmd = null
      break
  }
}

exports.sendFromLog = async function sendFromLog(action = false) {
  if (!started) return
  if (!action) return
  let userProps = global.userManager.getUserProperties(action.user)
  let cmd = new Command()

  try {
    switch (action.type) {
      case 'admin':
        if (userProps.allowCommands.includes('#*')) break
        if (userProps.allowCommands.includes(action.properties.command.toLowerCase())) break
        await routines.forbiddenCommand(cmd, action)
        await executeCommand(cmd)
        break

      case 'chat':
        if (!ready) {
          let i = 0
          while (!ready && i < 5) {
            await global.time.sleep(0.5)
            i++
          }
        }

        if (!ready) break

        if (!action.properties.isCommand) {
          if (action.properties.scope != 'global') break
          let s = action.properties.value
          let numUpper = s.length - s.replace(/[A-Z]/g, '').length
          if (numUpper > s.length * 0.9) {
            cmd.addMessage(
              sGlobal,
              messages[action.properties.user.lang].capslock.replace(
                '{user}',
                action.user.char.name
              )
            )
          }
          break
        }

        let cmdKey = action.properties.value.split(' ')[0].trim().toLowerCase()
        if (commands[cmdKey]) {
          if (!commands[cmdKey].scopes.includes(action.properties.scope)) break
          if (
            userProps.allowBotCommands.includes('/*') ||
            userProps.allowBotCommands.includes(cmdKey)
          ) {
            if (
              !commands[cmdKey].cooldown ||
              !cmd.tooEarly(commands[cmdKey].routine, commands[cmdKey].cooldown)
            )
              await routines.chat[commands[cmdKey].routine](cmd, action)
          } else {
            cmd.addMessage(
              sGlobal,
              messages['en'].noPermission.replace('{user}', action.user.char.name)
            )
          }
        } else if (action.properties.scope == 'global')
          cmd.addMessage(
            sGlobal,
            messages['en'].unknownCommand.replace('{user}', action.user.char.name)
          )
        await executeCommand(cmd)
        break

      case 'mine':
        if (action.properties.action != 'armed') break
        cmd.addMessage(sGlobal, messages['en'].in.traps)
        await executeCommand(cmd)
        break

      case 'kill':
        if (action.properties.event) break
        let event = 'killed'
        if (action.properties.type == 'comatosed') event = 'knocked out'
        cmd.addMessage(
          sGlobal,
          messages['en'].in.kill
            .replace(
              '{user1}',
              action.properties.causer ? action.properties.causer.char.name : 'unknown'
            )
            .replace('{event}', event)
            .replace('{user2}', action.user.char.name)
        )
        await executeCommand(cmd)
        break

      case 'auth':
        if (userProps.hideLogin || userProps.undercover) break
        let uName = userProps.loginAnonym
          ? '(Anonymous)'
          : global.userManager.groups[action.user.group].name + ' ' + action.user.char.name
        if (action.properties.authType == 'login') {
          cmd.addMessage(sGlobal, messages['en'].in.login.replace('{user}', uName))
          if (action.user.stats.totalLogins <= 1) {
            cmd.addMessage(
              sGlobal,
              messages['en'].pPos.firstJoin.replace('{userID}', action.user.steamID)
            )
            cmd.addMessage(sGlobal, '#SetFamePoints 10 ' + action.user.steamID)
            cmd.addMessage(
              sGlobal,
              messages['en'].firstJoin.m1.replace('{user}', action.user.char.name)
            )
            cmd.addMessage(sGlobal, messages['en'].firstJoin.m2)
          }
        } else cmd.addMessage(sGlobal, messages['en'].in.logout.replace('{user}', uName))
        await executeCommand(cmd)
        break
    }
  } catch (error) {
    global.log.error(_SN + 'sendFromLog(): ERROR: ' + error + ' -> ' + JSON.stringify(action))
    routines.chat.reload_bot(cmd)
    cmd.addMessage()
    await executeCommand(cmd)
  }
}
