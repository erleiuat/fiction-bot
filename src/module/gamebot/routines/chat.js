const _SN = '[MODULE][GAMEBOT][ROUTINES][CHAT] -> '

let bms = null
let sGlobal = null
let sLocal = null

const languages = [
  'english',
  'englisch',
  'Английский',
  'german',
  'deutsch',
  'немецкий',
  'russian',
  'russisch',
  'русский'
]

module.exports = {
  init: function (msgs, scopeLocal, scopeGlobal) {
    sGlobal = scopeGlobal
    sLocal = scopeLocal
    bms = msgs
  },
  new_player: function (cmd, action) {
    cmd.addMessage(sLocal, bms[action.user.lang].new.ms1.replace('{user}', action.user.char.name))
  },
  ping: function (cmd, action) {
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.ping.replace('{user}', action.user.char.name))
  },
  joke: async function (cmd, action) {
    let joke = await getJoke()
    while (joke.length > 195) joke = await getJoke()
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.joke.replace('{joke}', joke))
  },
  list_rules: function (cmd, action = null) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal
    cmd.addMessage(scope, bms[action.user.lang].rules.intro)
    for (const rule of bms[action.user.lang].rules.rules) cmd.addMessage(scope, rule)
  },
  what_is_going_on: function (cmd, action = null) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal
    cmd.addMessage(scope, ':[Wot]: ・ ...is going on here')
    cmd.addMessage(scope, ':[Wot]: ・ BREKFEST')
  },
  vote_weather_sun: function (cmd, action = null) {
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.vote.sun)
    cmd.addMessage(sGlobal, '#vote SetWeather 0')
  },
  vote_day: function (cmd, action = null) {
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.vote.day)
    cmd.addMessage(sGlobal, '#vote SetTimeOfDay 7')
  },
  online: function (cmd, action = null) {
    cmd.addMessage(
      sGlobal,
      bms[action.user.lang].pub.online.replace('{players}', global.state.players)
    )
  },
  time: function (cmd, action = null) {
    let time = '<unavailable>'
    if (global.state.time) time = global.state.time
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.time.replace('{time}', time))
  },
  restart_countdown: function (cmd, action = null) {
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
      bms[action.user.lang].pub.restart.replace('{minutes}', minutes).replace('{hours}', hours)
    )
  },
  reset_starterkit: function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let charName = action.properties.value.split(' ')
    delete charName[0]
    charName = charName.join(' ')
    let sUser = global.userManager.getUserByCharName(charName)
    if (!sUser) cmd.addMessage(scope, bms[action.user.lang].unknownUser.replace('{user}', charName))
    else {
      sUser.info.starterkit = null
      global.userManager.saveChanges()
      cmd.addMessage(
        scope,
        bms[action.user.lang].resetStarter.replace(
          '{user}',
          sUser.char.name + '(' + sUser.char.id + ')'
        )
      )
    }
  },
  whois_stats: function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let charName = action.properties.value.split(' ')
    delete charName[0]
    charName = charName.join(' ')

    let sUser = global.userManager.getUserByCharName(charName)
    if (!sUser) cmd.addMessage(scope, bms[action.user.lang].unknownUser.replace('{user}', charName))
    else addStats(cmd, sUser, scope)
  },
  whoami_stats: function (cmd, action) {
    addStats(cmd, action.user, sGlobal)
  },
  manual_welcome: function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let charName = action.properties.value.split(' ')
    delete charName[0]
    charName = charName.join(' ')
    cmd.addMessage(scope, bms[action.user.lang].pPos.firstJoin.replace('{userID}', charName))
    cmd.addMessage(scope, bms[action.user.lang].in.firstJoin.welcome1.replace('{user}', charName))
    cmd.addMessage(scope, bms[action.user.lang].in.firstJoin.welcome2)
    cmd.addMessage(scope, bms[action.user.lang].in.firstJoin.welcome3)
    cmd.addMessage(scope, bms[action.user.lang].in.firstJoin.welcome4)
  },
  show_rule: function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let ruleKey = parseInt(action.properties.value.split(' ')[1])
    let rule = bms[action.user.lang].rules.rules[ruleKey - 1]
    if (!rule) rule = bms[action.user.lang].rules.notFound.replace('{number}', ruleKey)
    cmd.addMessage(scope, rule)
  },
  anonymize_login: function (cmd, action) {
    let userProps = global.userManager.getUserProperties(action.user)
    let msg = null
    let setTo = null
    if (userProps.loginAnonym) {
      msg = bms[action.user.lang].anonymize.off.replace('{user}', action.user.char.name)
      setTo = false
    } else {
      msg = bms[action.user.lang].anonymize.on.replace('{user}', action.user.char.name)
      setTo = true
    }
    action.user.overwrite['loginAnonym'] = setTo
    global.userManager.saveChanges()
    global.userManager.getUserProperties(action.user, true)
    cmd.addMessage(sGlobal, msg)
  },
  starterkit: function (cmd, action) {
    if (action.user.info.starterkit) {
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].in.sKit.illegal.replace('{user}', action.user.char.name)
      )
      return
    }
    cmd.addMessage(
      sGlobal,
      bms[action.user.lang].in.sKit.start1.replace('{user}', action.user.char.name)
    )
    cmd.addMessage(sGlobal, bms[action.user.lang].in.sKit.start2)
  },
  starterkit_ready: function (cmd, action) {
    if (action.user.info.starterkit) {
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].in.sKit.illegal.replace('{user}', action.user.char.name)
      )
      return
    }
    cmd.addMessage(
      sGlobal,
      bms[action.user.lang].in.sKit.start3.replace('{user}', action.user.char.name)
    )
    cmd.addMessage(
      sGlobal,
      bms[action.user.lang].pPos.inside.replace('{userID}', action.user.steamID)
    )
    cmd.addMessage(sGlobal, bms[action.user.lang].pos.idle)
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
    cmd.addMessage(sGlobal, bms[action.user.lang].pos.outside)
    cmd.addMessage(sGlobal, '#SpawnVehicle BP_Quad_01_A')
    cmd.addMessage(
      sLocal,
      bms[action.user.lang].in.sKit.done.replace('{user}', action.user.char.name)
    )
    cmd.addMessage(sGlobal, bms[action.user.lang].pos.idle)

    let stamp = new Date().getTime()
    action.user.info.starterkit = stamp
  },
  connectDC: function (cmd, action) {
    let code = action.properties.value.split(' ')[1]

    if (!code) {
      cmd.addMessage(sGlobal, bms[action.user.lang].connect.help)
      return
    }

    if (global.userManager.redeemConnectionCode(action.user, code))
      cmd.addMessage(sGlobal, bms[action.user.lang].connect.yap)
    else cmd.addMessage(sGlobal, bms[action.user.lang].connect.nope)
  },
  shop_info: function (cmd, action) {
    cmd.addMessage(
      sGlobal,
      bms[action.user.lang].shop.info.replace('{user}', action.user.char.name)
    )
  },
  help: function (cmd, action) {
    cmd.addMessage(
      sGlobal,
      bms[action.user.lang].pub.help.m1.replace('{user}', action.user.char.name)
    )
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.help.m2)
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.help.m3)
    cmd.addMessage(sGlobal, bms[action.user.lang].pub.help.m4)
  },
  set_lang: function (cmd, action) {
    let lang = action.properties.value.split(' ')[1]
    if (lang) lang = lang.toLowerCase().trim()
    if (!lang) {
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].lang.list.replace('{user}', action.user.char.name)
      )
      return
    }
    if (!languages.includes(lang)) {
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].lang.unknown.replace('{user}', action.user.char.name)
      )
      return
    }

    if (lang == 'english' || lang == 'englisch' || lang == 'Английский') {
      action.user.lang = 'en'
      global.userManager.saveChanges()
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].lang.eng.replace('{user}', action.user.char.name)
      )
      return
    }

    if (lang == 'german' || lang == 'deutsch' || lang == 'немецкий') {
      action.user.lang = 'de'
      global.userManager.saveChanges()
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].lang.ger.replace('{user}', action.user.char.name)
      )
      return
    }

    if (lang == 'russian' || lang == 'russisch' || lang == 'русский') {
      action.user.lang = 'ru'
      global.userManager.saveChanges()
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].lang.rus.replace('{user}', action.user.char.name)
      )
      return
    }
  },
  travel: function (cmd, action) {
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
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].pub.travel.info.replace('{user}', action.user.char.name)
      )
      return
    } else {
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].pub.travel.unknownLoc.replace('{user}', action.user.char.name)
      )
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
        notEnough: bms[action.user.lang].pub.travel.notEnough.replace(
          '{user}',
          action.user.char.name
        ),
        noStation: bms[action.user.lang].pub.travel.noStation.replace(
          '{user}',
          action.user.char.name
        ),
        start: bms[action.user.lang].pub.travel.start.replace('{user}', action.user.char.name),
        somethingWrong: bms[action.user.lang].pub.travel.somethingWrong.replace(
          '{user}',
          action.user.char.name
        )
      }
    })
  },
  transfer: function (cmd, action) {
    let parts = action.properties.value.split(' ')
    let amount = parts[1].replace('[', '').replace(']', '')
    let transferTo = parts[2].replace('[', '').replace(']', '')

    if (!transferTo)
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].shop.trans.form.replace('{user}', action.user.char.name)
      )
    else {
      cmd.addAction('transfer', {
        from: action.user.steamID,
        to: transferTo,
        amount: amount,
        messages: {
          notEnough: bms[action.user.lang].shop.trans.notEnough.replace(
            '{user}',
            action.user.char.name
          ),
          notFound: bms[action.user.lang].shop.trans.notFound.replace(
            '{user}',
            action.user.char.name
          ),
          success: bms[action.user.lang].shop.trans.success.replace(
            '{user}',
            action.user.char.name
          ),
          started: bms[action.user.lang].shop.trans.started.replace(
            '{user}',
            action.user.char.name
          ),
          somethingWrong: bms[action.user.lang].shop.trans.somethingWrong.replace(
            '{user}',
            action.user.char.name
          )
        }
      })
    }
  },
  shop_item: async function (cmd, action) {
    let items = await getItemList()
    let itemKey = action.properties.value.split(' ')[1]

    if (!itemKey || !itemKey.trim()) {
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].shop.noItem.replace('{user}', action.user.char.name)
      )
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
      cmd.addMessage(
        sGlobal,
        bms[action.user.lang].shop.unknownItem.replace('{user}', action.user.char.name)
      )
      return
    }

    let teleport = bms[action.user.lang].pos.idle
    let teleportUser = bms[action.user.lang].pPos.inside.replace('{userID}', action.user.steamID)
    if (item.spawn_location == 'outside') {
      teleport = bms[action.user.lang].pos.outside
      teleportUser = bms[action.user.lang].pPos.outside.replace('{userID}', action.user.steamID)
    }

    cmd.addAction('sale', {
      userID: action.user.steamID,
      userName: action.user.char.name,
      shop: [-116688, -66384, 1000, 1000],
      item: item,
      teleport: teleport,
      teleportUser: teleportUser,
      messages: {
        pleaseWait: bms[action.user.lang].shop.pleaseWait.replace('{user}', action.user.char.name),
        notNearShop: bms[action.user.lang].shop.notNearShop.replace(
          '{user}',
          action.user.char.name
        ),
        notEnoughMoney: bms[action.user.lang].shop.notEnoughMoney
          .replace('{user}', action.user.char.name)
          .replace('{fame}', item.price_fame),
        startSale: bms[action.user.lang].shop.startSale
          .replace('{user}', action.user.char.name)
          .replace('{fame}', item.price_fame)
          .replace('{item}', item.name),
        endSale: bms[action.user.lang].shop.endSale
          .replace('{user}', action.user.char.name)
          .replace('{fame}', item.price_fame)
          .replace('{item}', item.name),
        somethingWrong: bms[action.user.lang].shop.somethingWrong
      }
    })

    cmd.addMessage(sGlobal, bms[action.user.lang].pos.idle)
  },
  reload_bot: function (cmd, action = null) {
    let scope = sLocal
    if (action && action.properties && action.properties.scope == 'global') scope = sGlobal
    global.log.info(_SN + 'RELOAD: STARTED')
    execScript('.\\src\\scripts\\reload.bat')
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    global.log.info(_SN + 'RELOAD: Saved mngr data')
    cmd.addMessage(scope, bms[action.user.lang].start.reload)
  },
  reboot_bot: function (cmd, action = null) {
    let scope = sLocal
    if (action && action.properties && action.properties.scope == 'global') scope = sGlobal
    global.log.info(_SN + 'REBOOT: STARTED')
    if (!global.args.includes('test')) execScript('.\\src\\scripts\\reboot.bat')
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    global.log.info(_SN + 'REBOOT: Saved mngr data')
    cmd.addMessage(scope, bms[action.user.lang].start.reboot)
  }
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

function addStats(cmd, sUser, scope) {
  let jD = stampToDateTime(sUser.stats.firstJoin)
  let pTime = getDuration(sUser.stats.totalPlaytime)
  cmd.addMessage(
    scope,
    bms[action.user.lang].whoami.m1
      .replace('{user}', sUser.char.name)
      .replace('{group}', global.userManager.groups[sUser.group].name)
      .replace('{date}', jD.date)
      .replace('{time}', jD.time)
  )
  cmd.addMessage(
    scope,
    bms[action.user.lang].whoami.m2
      .replace('{logins}', sUser.stats.totalLogins)
      .replace('{playtime}', parseInt(pTime.d) * 24 + parseInt(pTime.h))
  )
  cmd.addMessage(
    scope,
    bms[action.user.lang].whoami.m3
      .replace('{local}', sUser.stats.totalMessages.local)
      .replace('{global}', sUser.stats.totalMessages.global)
      .replace('{squad}', sUser.stats.totalMessages.squad)
  )
  cmd.addMessage(
    scope,
    bms[action.user.lang].whoami.m4.replace('{kills}', Object.keys(sUser.kills).length)
  )
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
