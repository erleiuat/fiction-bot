const _SN = '[MODULE][GAMEBOT][ROUTINES] -> '

const cp = require('child_process')
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

function stampToDateTime(timestamp) {
  let date = new Date(timestamp)
  let day = global.nZero.form(date.getDate())
  let month = global.nZero.form(date.getMonth() + 1)
  let year = global.nZero.form(date.getFullYear())
  let hour = global.nZero.form(date.getHours())
  let minute = global.nZero.form(date.getMinutes())
  let second = global.nZero.form(date.getSeconds())
  return {
    date: year + '/' + month + '/' + day,
    time: hour + ':' + minute + ':' + second
  }
}

function getDuration(milli) {
  let minutes = milli / 60000
  let hours = minutes / 60
  let days = Math.floor(Math.floor(hours) / 24)
  minutes = (hours - Math.floor(hours)) * 60
  hours = Math.floor(hours) - days * 24
  return {
    d: Math.floor(days),
    h: Math.floor(hours),
    m: Math.floor(minutes)
  }
}

exports.reset_starterkit = function reset_starterkit(cmd, action) {
  let scope = sLocal
  if (action.properties.scope == 'global') scope = sGlobal

  let charName = action.properties.value.split(' ')[1]
  let sUser = global.userManager.getUserByCharName(charName)
  if (!sUser) cmd.addMessage(scope, botMsgs.unknownUser.replace('{user}', charName))
  else {
    sUser.info.starterkit = null
    global.userManager.saveChanges()
    cmd.addMessage(
      scope,
      botMsgs.resetStarter.replace('{user}', sUser.char.name + '(' + sUser.char.id + ')')
    )
  }
}

exports.forbiddenCommand = function forbiddenCommand(cmd, action) {
  let msg =
    '@ADMIN: USER "' +
    action.user.char.name +
    '" WITH ROLE "' +
    action.user.group +
    '" HAS BEEN KICKED FOR USING "' +
    action.properties.command +
    ' ' +
    action.properties.value +
    '"'
  global.log.info(_SN + msg)
  global.log.warn(_SN + msg)
  global.log.error(_SN + msg)
  cmd.addMessage(sLocal, '#Kick ' + action.user.steamID)
  cmd.addMessage(sLocal, msg)
  //cmd.addMessage(sGlobal, msg)
}

function addStats(cmd, sUser) {
  let jD = stampToDateTime(sUser.stats.firstJoin)
  let pTime = getDuration(sUser.stats.totalPlaytime)
  cmd.addMessage(
    sGlobal,
    botMsgs.whoami.m1
      .replace('{user}', sUser.char.name)
      .replace('{group}', sUser.group)
      .replace('{date}', jD.date)
      .replace('{time}', jD.time)
  )
  cmd.addMessage(
    sGlobal,
    botMsgs.whoami.m2
      .replace('{logins}', sUser.stats.totalLogins)
      .replace('{playtime}', parseInt(pTime.d) * 24 + parseInt(pTime.h))
  )
  cmd.addMessage(
    sGlobal,
    botMsgs.whoami.m3
      .replace('{local}', sUser.stats.totalMessages.local)
      .replace('{global}', sUser.stats.totalMessages.global)
      .replace('{squad}', sUser.stats.totalMessages.squad)
  )
  cmd.addMessage(sGlobal, botMsgs.whoami.m4.replace('{kills}', Object.keys(sUser.kills).length))
}

exports.whois_stats = function whois_stats(cmd, action) {
  let scope = sLocal
  if (action.properties.scope == 'global') scope = sGlobal

  let charName = action.properties.value.split(' ')[1]
  let sUser = global.userManager.getUserByCharName(charName)
  if (!sUser) cmd.addMessage(scope, botMsgs.unknownUser.replace('{user}', charName))
  else addStats(cmd, sUser)
}

exports.whoami_stats = function whoami_stats(cmd, action) {
  addStats(cmd, action.user)
}

exports.manual_welcome = function manual_welcome(cmd, action) {
  let scope = sLocal
  if (action.properties.scope == 'global') scope = sGlobal

  let user = action.properties.value.split(' ')[1]
  cmd.addMessage(scope, botMsgs.pPos.firstJoin.replace('{userID}', user))
  cmd.addMessage(scope, botMsgs.in.firstJoin.welcome1.replace('{user}', user))
  cmd.addMessage(scope, botMsgs.in.firstJoin.welcome2)
  cmd.addMessage(scope, botMsgs.in.firstJoin.welcome3)
  cmd.addMessage(scope, botMsgs.in.firstJoin.welcome4)
}

exports.show_rule = function show_rule(cmd, action) {
  let scope = sLocal
  if (action.properties.scope == 'global') scope = sGlobal

  let ruleKey = parseInt(action.properties.value.split(' ')[1])
  let rule = botMsgs.rules.rules[ruleKey - 1]
  if (!rule) rule = botMsgs.rules.notFound.replace('{number}', ruleKey)
  cmd.addMessage(scope, rule)
}

exports.list_rules = function list_rules(cmd, action = null) {
  let scope = sLocal
  if (action.properties.scope == 'global') scope = sGlobal
  cmd.addMessage(scope, botMsgs.rules.intro)
  for (const rule of botMsgs.rules.rules) cmd.addMessage(scope, rule)
}

exports.anonymize_login = function anonymize_login(cmd, action) {
  let userProps = global.userManager.getUserProperties(action.user)
  let msg = null
  let setTo = null
  if (userProps.loginAnonym) {
    msg = botMsgs.anonymize.off.replace('{user}', action.user.char.name)
    setTo = false
  } else {
    msg = botMsgs.anonymize.on.replace('{user}', action.user.char.name)
    setTo = true
  }
  action.user.overwrite['loginAnonym'] = setTo
  global.userManager.saveChanges()
  global.userManager.getUserProperties(action.user, true)
  cmd.addMessage(sGlobal, msg)
}

exports.mapShot = function mapShot(cmd, action) {
  cmd.addAction('mapShot', { path: action.path })
}

exports.playerReport = function playerReport(cmd, action = null) {
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

exports.joke = async function joke(cmd, action = null) {
  let joke = await getJoke()
  while (joke.length > 195) joke = await getJoke()
  cmd.addMessage(sGlobal, botMsgs.pub.joke.replace('{joke}', joke))
}

exports.botStart = function botStart(cmd, action = null) {
  cmd.addMessage(sLocal, botMsgs.fName)
  cmd.addMessage(sLocal, '#ListAnimals')
  cmd.addMessage(sLocal, '#ShowOtherPlayerInfo true')
  cmd.addMessage(sLocal, '#ShowFlagLocations true')
  cmd.addMessage(sLocal, botMsgs.pos.idle)
  cmd.addMessage(sGlobal, botMsgs.start.ready)
}

exports.connectDC = function connectDC(cmd, action) {
  let code = action.properties.value.split(' ')[1]

  if (!code) {
    cmd.addMessage(sGlobal, botMsgs.connect.help)
    return
  }

  if (global.userManager.redeemConnectionCode(action.user, code))
    cmd.addMessage(sGlobal, botMsgs.connect.yap)
  else cmd.addMessage(sGlobal, botMsgs.connect.nope)
}

async function execScript(scriptName) {
  try {
    global.log.info(_SN + 'EXECSCRIPT: Waiting 10sec before executing')
    await global.time.sleep(5)
    global.log.info(_SN + 'EXECSCRIPT: EXECUTING')
    const child = cp.spawn('cmd.exe', ['/c', scriptName], { detached: true })
    child.on('data', data => console.log(data))
    child.on('error', error => console.log(error))
    child.on('close', code => console.log(code))
  } catch (error) {
    console.log(error)
  }
}

exports.reload_bot = function reload_bot(cmd, action = null) {
  global.log.info(_SN + 'RELOAD: STARTED')
  execScript('.\\src\\scripts\\reload.bat')
  global.userManager.saveChanges()
  global.mineManager.saveChanges()
  global.log.info(_SN + 'RELOAD: Saved mngr data')
  cmd.addMessage(sGlobal, botMsgs.start.reload)
}

exports.reboot_bot = function reload_bot(cmd, action = null) {
  global.log.info(_SN + 'REBOOT: STARTED')
  if (!global.args.includes('test')) execScript('.\\src\\scripts\\reboot.bat')
  global.userManager.saveChanges()
  global.mineManager.saveChanges()
  global.log.info(_SN + 'REBOOT: Saved mngr data')
  cmd.addMessage(sGlobal, botMsgs.start.reboot)
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

exports.what_is_going_on = function what_is_going_on(cmd, action = null) {
  let scope = sLocal
  if (action.properties.scope == 'global') scope = sGlobal
  cmd.addMessage(scope, ':[Wot]: ・ ...is going on here')
  cmd.addMessage(scope, ':[Wot]: ・ BREKFEST')
}

exports.vote_weather_sun = function vote_weather_sun(cmd, action = null) {
  cmd.addMessage(sGlobal, botMsgs.pub.vote.sun)
  cmd.addMessage(sGlobal, '#vote SetWeather 0')
}

exports.vote_day = function vote_day(cmd, action = null) {
  cmd.addMessage(sGlobal, botMsgs.pub.vote.day)
  cmd.addMessage(sGlobal, '#vote SetTimeOfDay 7')
}

exports.online = function online(cmd, action = null) {
  cmd.addMessage(sGlobal, botMsgs.pub.online.replace('{players}', global.state.players))
}

exports.time = function time(cmd, action = null) {
  let time = '<unavailable>'
  if (global.state.time) time = global.state.time
  cmd.addMessage(sGlobal, botMsgs.pub.time.replace('{time}', time))
}

exports.restart_countdown = function restart_countdown(cmd, action = null) {
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
  let url = process.env.SETTING_SHOPITEMS_URL
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
