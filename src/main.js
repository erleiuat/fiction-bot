const _SN = '[MAIN] -> '

const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

global.actionHandler = null
global.logHandler = null
global.statistics = null
global.dcWriter = null
global.gamebot = null

def()

if (global.runType == 'discord') {
  global.log.info(_SN + 'Executing Discord-Bot (arg. "discord")')
  discord()
} else if (global.runType == 'gamebot') {
  global.log.info(_SN + 'Executing Ingame-Bot (arg. "gamebot")')
  gamebot()
} else if (global.runType == 'full') {
  global.log.info(_SN + 'Executing Everything (arg. "full")')
  discord()
  gamebot()
}

async function def() {
  global.log.info(_SN + 'Starting Module "actionHandler"')
  global.actionHandler = require('./module/actionHandler/')

  global.log.info(_SN + 'Starting Module "logHandler"')
  global.logHandler = require('./module/logHandler/')
  global.logHandler.start()
}

async function discord() {
  client.on('ready', () => {
    global.log.info(_SN + `Logged in as ${client.user.tag}!`)

    global.log.info(_SN + 'Starting Module "dcWriter"')
    global.dcWriter = require('./module/dcWriter/')
    global.dcWriter.start(client)

    global.log.info(_SN + 'Starting Module "statistics"')
    global.statistics = require('./module/statistics/')
    global.statistics.start(client)
  })
  global.log.info(_SN + 'Logging in')
  client.login(process.env.DC_TOKEN)
}

async function gamebot() {
  global.log.info(_SN + 'Starting Module "dcHandler"')
  global.dcHandler = require('./module/dcHandler/')
  global.dcHandler.start()

  global.log.info(_SN + 'Starting Module "gamebot"')
  global.gamebot = require('./module/gamebot/')
  global.gamebot.start()
}
