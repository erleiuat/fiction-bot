const _SN = '[MODULE][DCWRITER] -> '

const format = require('./format')
const Discord = require('discord.js')
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
    admin: null,
    violation: null
  }
}

let client = null
let run = false

exports.start = async function start(dcClient) {
  client = dcClient
  init()
  run = true
  global.log.info(_SN + 'Started')
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

async function go() {
  while (!run) await global.time.sleep(0.0005)
}

function init() {
  channels.console = client.channels.cache.find(ch => ch.id === process.env.DC_CH_CONSOLE)
  channels.ingameChat = client.channels.cache.find(ch => ch.id === process.env.DC_CH_INGAMECHAT)
  channels.killFeed = client.channels.cache.find(ch => ch.id === process.env.DC_CH_KILLFEED)
  channels.noAdminAbuse = client.channels.cache.find(ch => ch.id === process.env.DC_CH_NOADMINABUSE)

  channels.log = {
    kill: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_KILL),
    auth: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_AUTH),
    mine: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_MINE),
    chat: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_CHAT),
    admin: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_ADMIN),
    violation: client.channels.cache.find(ch => ch.id === process.env.DC_CH_LOG_VIOLATION)
  }
}

async function sendMessage(channel, message) {
  if (!global.args.includes('test')) await channel.send(message)
  else
    global.log.debug(
      '\n' +
        _SN +
        '[TEST] -> Sending message to Channel "' +
        channel.name +
        '":\n' +
        JSON.stringify(message) +
        '\n'
    )
}

async function toChannels(action, channels) {
  let msgs = buildMessages(action)
  for (const el of channels) {
    if (el.extended) await sendMessage(el.channel, msgs.extended)
    else if (msgs.default) await sendMessage(el.channel, msgs.default)
  }

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
    case 'violation':
      return format.violation(action)
  }
}

exports.sendFromLog = async function sendFromLog(action) {
  global.log.info(_SN + 'sendFromLog(): ' + action.type + ' received')

  let userProps = { undercover: false }
  if (action.type != 'violation') userProps = global.userManager.getUserProperties(action.user)
  await go()
  switch (action.type) {
    case 'admin':
      if (userProps.undercover) toChannels(action, [{ channel: channels.console, extended: true }])
      else
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
      if (userProps.undercover) toChannels(action, [{ channel: channels.console, extended: true }])
      else
        toChannels(action, [
          { channel: channels.console, extended: true },
          { channel: channels.log.auth, extended: true }
        ])
      break
    case 'violation':
      toChannels(action, [
        { channel: channels.console, extended: true },
        { channel: channels.log.violation, extended: true }
      ])
      break
  }
}

global.log.info(_SN + 'READY')
