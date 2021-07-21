const _SN = '[MODULE][GAMEBOT][ROUTINES] -> '

const fetch = require('node-fetch')
const request = require('request')

let botMsgs = null
let sGlobal = null
let sLocal = null

exports.init = function init(msgs, scopeLocal, scopeGlobal) {
  sGlobal = scopeGlobal
  sLocal = scopeLocal
  botMsgs = msgs
}

exports.mapShot = function mapShot(cmd, action) {
  cmd.addAction('mapShot', { path: action.path })
}

exports.playerReport = function playerReport(cmd, action) {
  cmd.addAction('playerReport', true)
}

exports.starterkit = function starterkit(cmd, action) {
  if (action.user.info.starterkit) {
    cmd.addMessage(sGlobal, botMsgs.in.sKit.illegal.replace('{user}', action.user.char.name))
    return
  }
  cmd.addMessage(sGlobal, botMsgs.in.sKit.start1.replace('{user}', action.user.char.name))
  cmd.addMessage(sGlobal, botMsgs.in.sKit.start2)
}

exports.starterkit_ready = function starterkit_ready(cmd, action) {
  if (action.user.info.starterkit) {
    cmd.addMessage(sGlobal, botMsgs.in.sKit.illegal.replace('{user}', action.user.char.name))
    return
  }
  cmd.addMessage(sGlobal, botMsgs.in.sKit.start3.replace('{user}', action.user.char.name))
  cmd.addMessage(sGlobal, botMsgs.pPos.inside.replace('{userID}', action.user.steamID))
  cmd.addMessage(sGlobal, botMsgs.pos.idle)
  cmd.addMessage(sGlobal, '#SpawnItem Backpack_01_07')
  cmd.addMessage(sGlobal, '#SpawnItem MRE_Stew 2')
  cmd.addMessage(sGlobal, '#SpawnItem MRE_CheeseBurger 2')
  cmd.addMessage(sGlobal, '#SpawnItem MRE_TunaSalad 2')
  cmd.addMessage(sGlobal, '#SpawnItem Milk 2')
  cmd.addMessage(sGlobal, '#SpawnItem Canteen 2')
  cmd.addMessage(sGlobal, '#SpawnItem Emergency_Bandage_Big')
  cmd.addMessage(sGlobal, '#SpawnItem Painkillers_03')
  cmd.addMessage(sGlobal, '#SpawnItem Vitamins_03')
  cmd.addMessage(sGlobal, '#SpawnItem BP_Compass_Advanced')
  cmd.addMessage(sGlobal, '#SpawnItem 1H_Small_Axe')
  cmd.addMessage(sGlobal, '#SpawnItem 2H_Baseball_Bat_With_Wire')
  cmd.addMessage(sGlobal, '#SpawnItem Car_Repair_Kit')
  cmd.addMessage(sGlobal, '#SpawnItem Lock_Item_Basic')
  cmd.addMessage(sGlobal, '#SpawnItem Lock_Item_Advanced')
  cmd.addMessage(sGlobal, botMsgs.pos.outside)
  cmd.addMessage(sGlobal, '#SpawnVehicle BP_Quad_01_A')
  cmd.addMessage(sLocal, botMsgs.in.sKit.done.replace('{user}', action.user.char.name))
  cmd.addMessage(sGlobal, botMsgs.pos.idle)

  let stamp = new Date().getTime()
  action.user.info.starterkit = stamp
}

function getJoke() {
  return new Promise(resolve => {
    request.get(
      {
        url: 'https://api.api-ninjas.com/v1/jokes?limit=1',
        headers: {
          'X-Api-Key': '7wk74FwsQHrQj9A6JgE1FA==5uxpvXNNabi4lflP'
        }
      },
      (error, response, body) => {
        if (error) return console.error('Request failed:', error)
        else if (response.statusCode != 200)
          return console.error('Error:', response.statusCode, body.toString('utf8'))
        else resolve(JSON.parse(body)[0]['joke'])
      }
    )
  })
}

exports.joke = async function joke(cmd, action) {
  let joke = await getJoke()
  while (joke.length > 195) joke = await getJoke()
  cmd.addMessage(sGlobal, botMsgs.pub.joke.replace('{joke}', joke))
}

exports.botStart = function botStart(cmd, action = null) {
  cmd.addMessage(sLocal, botMsgs.fName)
  cmd.addMessage(sLocal, '#ListAnimals')
  cmd.addMessage(sLocal, botMsgs.pos.idle)
  cmd.addMessage(sLocal, '#ShowOtherPlayerInfo true')
  cmd.addMessage(sLocal, '#ShowFlagLocations true')
  cmd.addMessage(sGlobal, botMsgs.start.ready)
}

exports.shop_info = function shop_info(cmd, action) {
  cmd.addMessage(sGlobal, botMsgs.shop.info.replace('{user}', action.user.char.name))
}

exports.dcMessage = function dcMessage(cmd, action) {
  cmd.addMessage(sGlobal, '#SetFakeName ' + action.properties.useName)
  cmd.addMessage(sGlobal, action.properties.message)
  cmd.addMessage(sGlobal, botMsgs.fName)
}

exports.ping = function ping(cmd, action) {
  cmd.addMessage(sGlobal, botMsgs.pub.ping.replace('{user}', action.user.char.name))
}

exports.help = function help(cmd, action) {
  cmd.addMessage(sGlobal, botMsgs.pub.help.m1.replace('{user}', action.user.char.name))
  cmd.addMessage(sGlobal, botMsgs.pub.help.m2)
  cmd.addMessage(sGlobal, botMsgs.pub.help.m3)
  cmd.addMessage(sGlobal, botMsgs.pub.help.m4)
}

exports.what_is_going_on = function what_is_going_on(cmd, action) {
  cmd.addMessage(sGlobal, ':[Wot]: ・ ...is going on here')
  cmd.addMessage(sGlobal, ':[Wot]: ・ BREKFEST')
}

exports.vote_weather_sun = function vote_weather_sun(cmd, action) {
  cmd.addMessage(sGlobal, botMsgs.pub.vote.sun)
  cmd.addMessage(sGlobal, '#vote SetWeather 0')
}

exports.vote_day = function vote_day(cmd, action) {
  cmd.addMessage(sGlobal, botMsgs.pub.vote.day)
  cmd.addMessage(sGlobal, '#vote SetTimeOfDay 7')
}

exports.online = function online(cmd, action) {
  cmd.addMessage(sGlobal, botMsgs.pub.online.replace('{players}', global.state.players))
}

exports.time = function time(cmd, action) {
  let time = '<unavailable>'
  if (global.state.time) time = global.state.time
  cmd.addMessage(sGlobal, botMsgs.pub.time.replace('{time}', time))
}

exports.restart_countdown = function restart_countdown(cmd, action) {
  let now = new Date()
  let curHour = now.getHours()
  let countDownDate = new Date()
  countDownDate.setMinutes(0)
  if (curHour < 6) countDownDate.setHours(6)
  else if (curHour < 12) countDownDate.setHours(12)
  else if (curHour < 18) countDownDate.setHours(18)
  else if (curHour >= 18) {
    countDownDate.setDate(countDownDate.getDate() + 1)
    countDownDate.setHours(0)
  }

  let distance = countDownDate.getTime() - now.getTime()
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))

  cmd.addMessage(
    sGlobal,
    botMsgs.pub.restart.replace('{minutes}', minutes).replace('{hours}', hours)
  )
}

exports.travel = function travel(cmd, action) {
  let target = false
  let station = action.properties.value
    .toLowerCase()
    .replace('/travel', '')
    .replace('/fasttravel', '')
    .trim()
  if (station == 'd0') target = '#Teleport -669327 387796 72675'
  else if (station == 'b2') target = '#Teleport -116775 -66744 37065'
  else if (station == 'z0') target = '#Teleport -829491 -837658 5690'
  else if (station == 'a3') target = '#Teleport 101034 -492350 9982'
  else if (station == 'd4') target = '#Teleport 430079 477843 10546'
  else if (station == 'info' || station == 'infos') {
    cmd.addMessage(sGlobal, botMsgs.pub.travel.info.replace('{user}', action.user.char.name))
    return
  } else {
    cmd.addMessage(sGlobal, botMsgs.pub.travel.unknownLoc.replace('{user}', action.user.char.name))
    return
  }

  cmd.addAction('travel', {
    steamID: action.user.steamID,
    target: target + ' ' + action.user.steamID,
    costs: 5,
    stations: [
      [-669327, 387796, 1000, 1000],
      [-116775, -66744, 1000, 1000],
      [-829491, -837658, 1000, 1000],
      [101034, -492350, 1000, 1000],
      [430079, 477843, 1000, 1000]
    ],
    messages: {
      notEnough: botMsgs.pub.travel.notEnough.replace('{user}', action.user.char.name),
      noStation: botMsgs.pub.travel.noStation.replace('{user}', action.user.char.name),
      start: botMsgs.pub.travel.start.replace('{user}', action.user.char.name),
      somethingWrong: botMsgs.pub.travel.somethingWrong.replace('{user}', action.user.char.name)
    }
  })
}

exports.transfer = function transfer(cmd, action) {
  let parts = action.properties.value.split(' ')
  let amount = parts[1].replace('[', '').replace(']', '')
  let transferTo = parts[2].replace('[', '').replace(']', '')

  if (!transferTo)
    cmd.addMessage(sGlobal, botMsgs.shop.trans.form.replace('{user}', action.user.char.name))
  else {
    cmd.addAction('transfer', {
      from: action.user.steamID,
      to: transferTo,
      amount: amount,
      messages: {
        notEnough: botMsgs.shop.trans.notEnough.replace('{user}', action.user.char.name),
        notFound: botMsgs.shop.trans.notFound.replace('{user}', action.user.char.name),
        success: botMsgs.shop.trans.success.replace('{user}', action.user.char.name),
        started: botMsgs.shop.trans.started.replace('{user}', action.user.char.name),
        somethingWrong: botMsgs.shop.trans.somethingWrong.replace('{user}', action.user.char.name)
      }
    })
  }
}

async function getItemList() {
  let url = process.env.SETTING_DATA_URL + 'shop_data/items.json'
  return await fetch(url, {
    method: 'Get'
  })
    .then(res => res.json())
    .then(json => {
      return json
    })
}

exports.shop_item = async function shop_item(cmd, action) {
  let items = await getItemList()
  let itemKey = action.properties.value.split(' ')[1]

  if (!itemKey || !itemKey.trim()) {
    cmd.addMessage(sGlobal, botMsgs.shop.noItem.replace('{user}', action.user.char.name))
    return
  }

  let item = false
  itemKey = itemKey.trim().toLowerCase()
  for (const el of items)
    if (itemKey == el.keyword.toLowerCase()) {
      item = el
      break
    }

  if (!item || !item.spawn_command) {
    cmd.addMessage(sGlobal, botMsgs.shop.unknownItem.replace('{user}', action.user.char.name))
    return
  }

  let teleport = botMsgs.pos.idle
  let teleportUser = botMsgs.pPos.inside.replace('{userID}', action.user.steamID)
  if (item.spawn_location == 'outside') {
    teleport = botMsgs.pos.outside
    teleportUser = botMsgs.pPos.outside.replace('{userID}', action.user.steamID)
  }

  cmd.addAction('sale', {
    userID: action.user.steamID,
    userName: action.user.char.name,
    shop: [-116688, -66384, 1000, 1000],
    item: item,
    teleport: teleport,
    teleportUser: teleportUser,
    messages: {
      pleaseWait: botMsgs.shop.pleaseWait.replace('{user}', action.user.char.name),
      notNearShop: botMsgs.shop.notNearShop.replace('{user}', action.user.char.name),
      notEnoughMoney: botMsgs.shop.notEnoughMoney
        .replace('{user}', action.user.char.name)
        .replace('{fame}', item.price_fame),
      startSale: botMsgs.shop.startSale
        .replace('{user}', action.user.char.name)
        .replace('{fame}', item.price_fame)
        .replace('{item}', item.name),
      endSale: botMsgs.shop.endSale
        .replace('{user}', action.user.char.name)
        .replace('{fame}', item.price_fame)
        .replace('{item}', item.name),
      somethingWrong: botMsgs.shop.somethingWrong
    }
  })

  cmd.addMessage(sGlobal, botMsgs.pos.idle)
}
