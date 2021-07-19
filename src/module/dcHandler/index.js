const _SN = '[MODULE][DCHANDLER] -> '

const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const channels = {
  console: null,
  ingameChat: null
}

exports.start = async function start() {
  if (!client.user) init()
  else global.log.info(_SN + 'Started')
}

function init() {
  client.on('ready', () => {
    global.log.info(_SN + `Logged in as ${client.user.tag}!`)
    channels.console = client.channels.cache.find(ch => ch.id === process.env.DC_CH_CONSOLE)
    channels.ingameChat = client.channels.cache.find(ch => ch.id === process.env.DC_CH_INGAMECHAT)

    client.on('message', async msg => {
      messageHandler(msg)
    })
  })
  global.log.info(_SN + 'Logging in')
  client.login(process.env.DC_TOKEN)
}

async function messageHandler(msg) {
  if (msg.channel.id == process.env.DC_CH_CONSOLE) consoleMsg(msg)
  else if (msg.channel.id == process.env.DC_CH_INGAMECHAT) chatMsg(msg)
}

function chatMsg(msg) {
  console.log(msg)
}

function consoleMsg(msg) {
  if (msg.author.id !== process.env.DISCORD_BOT_ID && msg.member.hasPermission('ADMINISTRATOR')) {
    global.log.debug(_SN + 'Console message detected!')

    let user = global.userManager.getUserByDiscordID(msg.author.id)
    if (!user) {
      global.log.warning(_SN + 'consoleMsg(): User not found: ' + msg.author.username)
      return
    }

    let actionObj = {
      origin: 'dcHandler',
      type: 'console',
      timestamp: msg.createdTimestamp,
      date: new Date(msg.createdTimestamp),
      user: user,
      fakeName: user.char.fakeName,
      properties: {
        id: parseInt(msd.id),
        message: "String: 'bla'",
        isCommand: 'bool: true/false'
      }
    }

    global.actionHandler.handle(actionObj)

    /*
    "origin": "dcHandler",
    "type": "console/chat",
    "timestamp": "Date([timeString]).getTime()",
    "date": "Object: Date",
    "user": "Obj: User",
    "fakeName": "String: 'bla' (optional)",
    "properties": {
      "message": "String: 'bla'",
      "isCommand": "bool: true/false"
    }
    global.commands[msg.id] = {
      message: 'console_msg',
      user: msg.author.username,
      content: msg.content.trim()
    }
    */
    await msg.delete()
  }
}
