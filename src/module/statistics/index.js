const _SN = '[MODULE][STATISTICS] -> '

const state = require('./state')
const ranking = require('./ranking')
const players = require('./players')
const newPlayers = require('./newPlayers')
const playersOnline = require('./playersOnline')
const rankingFormat = require('./rankingFormat')
const Discord = require('discord.js')

const channels = {
  players: null,
  ranking: null,
  newPlayers: null,
  playersOnline: null
}

let client = null
let run = false

exports.start = async function start(dcClient) {
  client = dcClient
  init()
  run = true
  iterateStatistics()
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
  channels.playersOnline = client.channels.cache.find(
    ch => ch.id === process.env.DC_CH_STATS_PLAYERSONLINE
  )
}

async function cleanUp(channel) {
  var msg_size = 100
  while (msg_size == 100)
    await channel
      .bulkDelete(100, true)
      .then(messages => (msg_size = messages.size))
      .catch(console.error)
}

async function go() {
  while (!run) await global.time.sleep(0.001)
  if (process.env.TIMEOUT_DCWRITER) await global.time.sleep(process.env.TIMEOUT_DCWRITER)
}

async function iterateStatistics() {
  stateSts()
  rankingSts()
  newPlayersSts()
  playersSts()
  playersOnlineSts()
}

async function playersOnlineSts() {
  let dataCache = ''
  do {
    await go()

    let data = playersOnline.check()
    if (dataCache != JSON.stringify(data)) {
      global.log.info(_SN + 'Updating "PlayersOnline"')
      await cleanUp(channels.playersOnline)
      let msgs = playersOnline.format(data)
      for (const msg of msgs) if (msg && msg.length > 0) await channels.playersOnline.send(msg)
      dataCache = JSON.stringify(data)
    }

    await global.time.sleep(15)
  } while (true)
}

async function playersSts() {
  let dataCache = ''
  do {
    await go()

    let data = players.check()
    if (dataCache != JSON.stringify(data)) {
      global.log.info(_SN + 'Updating "PlayerStats"')
      await cleanUp(channels.players)
      let msgs = players.format(data)
      for (const msg of msgs) if (msg && msg.length > 0) await channels.players.send(msg)
      dataCache = JSON.stringify(data)
    }

    await global.time.sleep(15)
  } while (true)
}

async function newPlayersSts() {
  let dataCache = ''
  do {
    await go()

    let data = newPlayers.check()
    if (dataCache != JSON.stringify(data)) {
      global.log.info(_SN + 'Updating "NewPlayers"')
      await cleanUp(channels.newPlayers)
      let msgs = newPlayers.format(data)
      for (const msg of msgs) if (msg && msg.length > 0) await channels.newPlayers.send(msg)
      dataCache = JSON.stringify(data)
    }

    await global.time.sleep(15)
  } while (true)
}

async function rankingSts() {
  let dataCache = ''

  do {
    await go()

    let data = ranking.check()
    if (dataCache != JSON.stringify(data)) {
      global.log.info(_SN + 'Updating "Ranking"')
      await cleanUp(channels.ranking)

      await channels.ranking.send(rankingFormat.playtimes(data.playtimes))
      await channels.ranking.send(rankingFormat.kills(data.kills))
      await channels.ranking.send(rankingFormat.eventKills(data.eventKills))
      await channels.ranking.send(rankingFormat.killDistance(data.killDistance))
      await channels.ranking.send(rankingFormat.suicides(data.suicides))

      dataCache = JSON.stringify(data)
    }

    await global.time.sleep(15)
  } while (true)
}

async function stateSts() {
  let playersCache = null
  let msgCache = ''

  do {
    await go()

    stateCheck = await state.check()

    let serverState = {
      players: global.state.players,
      time: global.state.time
    }

    if (playersCache == serverState.players && stateCheck.players) {
      global.state.players = stateCheck.players
      serverState.players = stateCheck.players
    }
    playersCache == serverState.players

    if (stateCheck.time) {
      global.state.time = stateCheck.time
      serverState.time = stateCheck.time
    }

    let msg = serverState.players + ' 👥'
    if (serverState.time) msg += ' | ' + serverState.time.slice(0, -3) + ' 🕒'
    if (msg != msgCache) {
      msgCache = msg
      client.user.setActivity(msg, {
        type: 'WATCHING'
      })
    }

    await global.time.sleep(120)
  } while (true)
}
