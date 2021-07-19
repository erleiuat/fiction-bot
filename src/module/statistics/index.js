const _SN = '[MODULE][STATISTICS] -> '

const state = require('./state')
const Discord = require('discord.js')

const channels = {
  players: null,
  ranking: null,
  newPlayers: null
}

let client = null
let run = false

global.state = {
  players: 0,
  time: null
}

exports.start = async function start(dcClient) {
  client = dcClient
  init()
  run = true
  loopStatistics()
  global.log.info(_SN + 'Started')
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

function init() {
  channels.players = client.channels.cache.find(ch => ch.id === process.env.DC_CH_STATS_PLAYERS)
  channels.ranking = client.channels.cache.find(ch => ch.id === process.env.DC_CH_STATS_RANKING)
  channels.newPlayers = client.channels.cache.find(
    ch => ch.id === process.env.DC_CH_STATS_NEWPLAYERS
  )
}

async function go() {
  while (!run) await global.time.sleep(0.001)
  if (process.env.TIMEOUT_DCWRITER) await global.time.sleep(process.env.TIMEOUT_DCWRITER)
}

async function loopStatistics() {
  let stateCache = ''
  let msgCache = ''

  do {
    await go()

    let serverState = await state.check()
    if (stateCache != JSON.stringify(serverState)) {
      if (serverState.players) global.state.players = serverState.players
      if (serverState.time) global.state.time = serverState.time
      stateCache = JSON.stringify(serverState)
    }

    let msg = serverState.players + ' 👥'
    if (serverState.time) msg += ' | ' + serverState.time.slice(0, -3) + ' 🕒'
    if (msg != msgCache) {
      msgCache = msg
      client.user.setActivity(msg, {
        type: 'WATCHING'
      })
    }

    await global.time.sleep(5)
  } while (true)
}
