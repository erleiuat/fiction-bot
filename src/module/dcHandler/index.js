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

async function chatMsg(msg) {
  if (
    msg.author.id !== process.env.DISCORD_BOT_ID &&
    !msg.content.trim().startsWith('#') &&
    !msg.content.trim().startsWith('/')
  ) {
    global.log.debug(_SN + 'Chat message detected!')
    msg.channel.startTyping()

    let uName = msg.author.username
    let user = global.userManager.getUserByDiscordID(msg.author.id)
    if (!user) global.log.info(_SN + 'chatMsg(): User not found: ' + msg.author.username)
    else {
      uName = user.char.name
      let userProps = global.userManager.getUserProperties(user)
      if (user.char.fakeName && userProps.useFakeNames) uName = action.fakeName
    }

    let actionObj = {
      origin: 'dcHandler',
      type: 'chat',
      timestamp: msg.createdTimestamp,
      date: new Date(msg.createdTimestamp),
      user: user ? user : null,
      fakeName: user ? user.char.fakeName : null,
      properties: {
        id: parseInt(msg.id),
        message: msg.content.trim(),
        isCommand: msg.content.trim().startsWith('#'),
        useName: process.env.DC_HANDLER_CHAT_PREFIX + ' ' + uName
      }
    }

    global.actionHandler.handle(actionObj)

    await msg.delete()
    await global.time.sleep(1)
    msg.channel.stopTyping()
  }
}

async function consoleMsg(msg) {
  if (msg.author.id !== process.env.DISCORD_BOT_ID && msg.member.hasPermission('ADMINISTRATOR')) {
    global.log.debug(_SN + 'Console message detected!')
    msg.channel.startTyping()

    let user = global.userManager.getUserByDiscordID(msg.author.id)
    if (!user) {
      global.log.warning(_SN + 'consoleMsg(): User not found: ' + msg.author.username)
      return
    }

    let uName = user.char.name
    let userProps = global.userManager.getUserProperties(user)
    if (user.char.fakeName && userProps.useFakeNames) uName = action.fakeName

    let actionObj = {
      origin: 'dcHandler',
      type: 'console',
      timestamp: msg.createdTimestamp,
      date: new Date(msg.createdTimestamp),
      user: user,
      fakeName: user.char.fakeName,
      properties: {
        id: parseInt(msg.id),
        message: msg.content.trim(),
        isCommand: msg.content.trim().startsWith('#'),
        useName: uName
      }
    }

    global.actionHandler.handle(actionObj)

    await msg.delete()
    await global.time.sleep(1)
    msg.channel.stopTyping()
  }
}
