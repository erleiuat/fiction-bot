const _SN = '[MAIN] -> '

if (global.conf.execute == 'discord') {
  global.log.info(_SN + 'Executing Discord-Bot (arg. "discord")')
  discord()
} else if (global.conf.execute == 'gamebot') {
  global.log.info(_SN + 'Executing Ingame-Bot (arg. "gamebot")')
  gamebot()
}

async function discord() {
  global.log.info(_SN + 'Starting Module "logHandler"')
  global.logHandler = require('./module/logHandler/')
  global.logHandler.start()

  global.log.info(_SN + 'Starting Module "dcWriter"')
  global.dcWriter = require('./module/dcWriter/')
  global.dcWriter.start()

  global.log.info(_SN + 'Starting Module "actionHandler"')
  global.actionHandler = require('./module/actionHandler/')
}

async function gamebot() {
  global.log.info(_SN + 'Starting Module "logHandler"')
  global.logHandler = require('./module/logHandler/')
  global.logHandler.start()

  global.log.info(_SN + 'Starting Module "dcHandler"')
  global.dcHandler = require('./module/dcHandler/')
  global.dcHandler.start()

  global.log.info(_SN + 'Starting Module "gamebot"')
  global.gamebot = require('./module/gamebot/')
  global.gamebot.start()

  global.log.info(_SN + 'Starting Module "actionHandler"')
  global.actionHandler = require('./module/actionHandler/')
}
