const _SN = '[MAIN] -> '

const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

global.actionHandler = null
global.mineHandler = null
global.logHandler = null
global.statistics = null
global.dcWriter = null
global.gamebot = null
global.state = {
  players: null,
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

function def() {
  require('./service/log')
  global.log.info(_SN + 'Started Service "global.log"')
  require('./service/time')
  global.log.info(_SN + 'Started Service "global.time"')
  require('./service/nZero')
  global.log.info(_SN + 'Started Service "global.nZero"')

  const UserManager = require('./service/userManager/')
  global.userManager = new UserManager()
  global.log.info(_SN + 'Started Service "global.userManager"')

  const MineManager = require('./service/mineManager/')
  global.mineManager = new MineManager()
  global.log.info(_SN + 'Started Service "global.mineManager"')

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
