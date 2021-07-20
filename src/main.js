const _SN = '[MAIN] -> '

const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

global.actionHandler = null
global.logHandler = null
global.statistics = null
global.dcWriter = null
global.gamebot = null
global.state = {
  players: 0,
  time: null
}

def()

client.on('ready', () => {
  global.log.info(_SN + `Logged in as ${client.user.tag}!`)

  if (global.args.includes('discord')) discord(client)
  if (global.args.includes('gamebot')) gamebot(client)

  global.log.info(_SN + `Started everything!`)
})

global.log.info(_SN + 'Logging in')
client.login(process.env.DC_TOKEN)

async function def() {
  global.log.info(_SN + 'Starting Module "actionHandler"')
  global.actionHandler = require('./module/actionHandler/')

  global.log.info(_SN + 'Starting Module "logHandler"')
  global.logHandler = require('./module/logHandler/')
  global.logHandler.start()
}

async function discord(client) {
  global.log.info(_SN + 'Executing Discord-Bot (arg. "discord")')

  global.log.info(_SN + 'Starting Module "dcWriter"')
  global.dcWriter = require('./module/dcWriter/')
  global.dcWriter.start(client)

  global.log.info(_SN + 'Starting Module "statistics"')
  global.statistics = require('./module/statistics/')
  global.statistics.start(client)
}

async function gamebot(client) {
  global.log.info(_SN + 'Executing Ingame-Bot (arg. "gamebot")')

  global.log.info(_SN + 'Starting Module "dcHandler"')
  global.dcHandler = require('./module/dcHandler/')
  global.dcHandler.start(client)

  global.log.info(_SN + 'Starting Module "gamebot"')
  global.gamebot = require('./module/gamebot/')
  global.gamebot.start(client)
}
