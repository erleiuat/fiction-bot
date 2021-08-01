const _SN = '[MODULE][DCHANDLER] -> '

const cp = require('child_process')
const Discord = require('discord.js')
const channels = {
  console: null,
  ingameChat: null
}

let client = null

exports.start = async function start(dcClient) {
  client = dcClient
  init()
  global.log.info(_SN + 'Started')
}

function init() {
  channels.console = client.channels.cache.find(ch => ch.id === process.env.DC_CH_CONSOLE)
  channels.ingameChat = client.channels.cache.find(ch => ch.id === process.env.DC_CH_INGAMECHAT)
  client.on('message', async msg => {
    if (msg.author.id !== process.env.DC_BOT_ID) {
      global.log.info(_SN + 'Message detected: ' + msg.content.trim())
      messageHandler(msg)
    }
  })
}

async function messageHandler(msg) {
  if (msg.channel.id == process.env.DC_CH_CONSOLE) consoleMsg(msg)
  else if (msg.content.trim() == '!connect') buildConnection(msg)
  else if (msg.content.trim() == '!restart') forceRestart(msg)
  else if (msg.content.trim() == '!reload') forceReload(msg)
  else if (msg.content.trim() == '!reboot') forceReboot(msg)
  else if (msg.channel.id == process.env.DC_CH_INGAMECHAT) chatMsg(msg)
}

async function forceRestart(msg) {
  if (
    msg.member.roles.cache.has(process.env.DC_ROLE_MOD) ||
    msg.member.roles.cache.has(process.env.DC_ROLE_SUPPORT) ||
    msg.member.hasPermission('ADMINISTRATOR')
  ) {
    global.sysControl.restart()
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    await msg.delete()
  }
}

async function forceReload(msg) {
  if (
    msg.member.roles.cache.has(process.env.DC_ROLE_MOD) ||
    msg.member.roles.cache.has(process.env.DC_ROLE_SUPPORT) ||
    msg.member.hasPermission('ADMINISTRATOR')
  ) {
    global.sysControl.reload()
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    await msg.delete()
  }
}

async function forceReboot(msg) {
  if (
    msg.member.roles.cache.has(process.env.DC_ROLE_MOD) ||
    msg.member.roles.cache.has(process.env.DC_ROLE_SUPPORT) ||
    msg.member.hasPermission('ADMINISTRATOR')
  ) {
    global.sysControl.reboot()
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    await msg.delete()
  }
}

async function buildConnection(msg) {
  let code = this.global.userManager.getConnectionCode(msg.author.id)

  msg.author.send(
    `:arrow_down: 
    \n\n\nHi there **` +
      msg.author.username +
      `!**  :metal: 
    \nHere's your connection-code to pair your Discord account with your Ingame character:
    (Only valid until the next server restart)
    \n__**` +
      code +
      `**__
    \nUse the code in the ingame-chat (global) with the command \`/connect\` to finish the pairing.\nThe full command would be:
    \`\`\`/connect ` +
      code +
      `\`\`\`
    \n_Best Regards, your FiBo_  :kissing_heart: 
    \n\n:arrow_up: 
    `
  )

  if (msg.guild.id == process.env.DC_SERVER_ID) await msg.delete()
}

async function chatMsg(msg) {
  if (msg.author.id !== process.env.DC_BOT_ID) {
    global.log.debug(_SN + 'Chat message detected!')

    if (msg.content.trim().startsWith('#') || msg.content.trim().startsWith('/')) {
      await msg.delete()
      return
    }

    msg.channel.startTyping()

    let uName = msg.author.username
    let user = global.userManager.getUserByDiscordID(msg.author.id)
    if (!user) {
      global.log.info(_SN + 'chatMsg(): User not found: ' + msg.author.username)
      msg.author.send('**Please pair your Accounts before you use the ingame-chat feature:**')
      buildConnection(msg)
      msg.channel.stopTyping()
      return
    } else {
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
        id: msg.id,
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
  if (msg.author.id != process.env.DC_BOT_ID && msg.member.hasPermission('ADMINISTRATOR')) {
    global.log.debug(_SN + 'Console message detected!')
    msg.channel.startTyping()

    let user = global.userManager.getUserByDiscordID(msg.author.id)
    if (!user) {
      global.log.error(_SN + 'consoleMsg(): User not found: ' + msg.author.username)
      await msg.delete()
      msg.channel.stopTyping()
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
        id: msg.id,
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
