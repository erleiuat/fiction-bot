const _SN = '[MODULE][DCWRITER] -> '

const format = require('./format')
const Discord = require('discord.js')
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })
const channels = {
  console: null,
  killFeed: null,
  ingameChat: null,
  noAdminAbuse: null,
  log: {
    kill: null,
    auth: null,
    mine: null,
    chat: null,
    admin: null
  }
}

let run = false

exports.start = async function start() {
  if (!client.user) init()
  else {
    run = true
    global.log.info(_SN + 'Started')
  }
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

function init() {
  client.on('ready', () => {
    global.log.info(_SN + `Logged in as ${client.user.tag}!`)

    channels.console = client.channels.cache.find(ch => ch.id === process.env.DC_CH_CONSOLE)
    channels.ingameChat = client.channels.cache.find(ch => ch.id === process.env.DC_CH_INGAMECHAT)
    channels.killFeed = client.channels.cache.find(ch => ch.id === process.env.DC_CH_KILLFEED)
    channels.noAdminAbuse = client.channels.cache.find(
      ch => ch.id === process.env.DC_CH_NOADMINABUSE
    )

    channels.log = {
      kill: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_KILL),
      auth: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_AUTH),
      mine: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_MINE),
      chat: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_CHAT),
      admin: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_ADMIN)
    }

    run = true
  })
  global.log.info(_SN + 'Logging in')
  client.login(process.env.DC_TOKEN)
}

async function go() {
  while (!run) await global.time.sleep(0.001)
  if (process.env.TIMEOUT_DCWRITER) await global.time.sleep(process.env.TIMEOUT_DCWRITER)
}

async function toChannels(action, channels) {
  let msgs = buildMessages(action)
  for (const el of channels)
    if (el.extended) await el.channel.send(msgs.extended)
    else if (msgs.default) await el.channel.send(msgs.default)

  global.log.info(_SN + 'sendFromLog(): ' + action.type + ' sent')
}

function buildMessages(action) {
  switch (action.type) {
    case 'admin':
      return format.admin(action)
    case 'chat':
      return format.chat(action)
    case 'auth':
      return format.auth(action)
    case 'kill':
      return format.kill(action)
    case 'mine':
      return format.mine(action)
  }
}

exports.sendFromLog = async function sendFromLog(action) {
  global.log.info(_SN + 'sendFromLog(): ' + action.type + ' received')
  await go()
  switch (action.type) {
    case 'admin':
      toChannels(action, [
        { channel: channels.console, extended: true },
        { channel: channels.log.admin, extended: true },
        { channel: channels.noAdminAbuse, extended: false }
      ])
      break
    case 'chat':
      toChannels(action, [
        { channel: channels.console, extended: true },
        { channel: channels.log.chat, extended: true },
        { channel: channels.ingameChat, extended: false }
      ])
      break
    case 'kill':
      toChannels(action, [
        { channel: channels.console, extended: true },
        { channel: channels.log.kill, extended: true },
        { channel: channels.killFeed, extended: false }
      ])
      break
    case 'mine':
      toChannels(action, [
        { channel: channels.console, extended: true },
        { channel: channels.log.mine, extended: true }
      ])
      break
    case 'auth':
      toChannels(action, [
        { channel: channels.console, extended: true },
        { channel: channels.log.auth, extended: true }
      ])
      break
  }
}

global.log.info(_SN + 'READY')
