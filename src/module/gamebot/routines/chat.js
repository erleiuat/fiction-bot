const _SN = '[MODULE][GAMEBOT][ROUTINES][CHAT] -> '

const fetch = require('node-fetch')
const request = require('request')

let bms = null
let sGlobal = null
let sLocal = null
let voteBanCache = {}

const languages = [
  'english',
  'german',
  'russian',
  'bulgarian',
  'spanish',
  'french',
  'italian',
  'japanese',
  'polish',
  'chinese',
  'dutch'
]

module.exports = {
  init: function (botMessages, scopeLocal, scopeGlobal) {
    bms = botMessages
    sLocal = scopeLocal
    sGlobal = scopeGlobal
    getItemList()
  },
  exec_cmd: async function (cmd, action) {
    let coms = action.properties.value.toLowerCase().replace('!exec', '').trim()
    coms = coms.split(';')
    for (const c of coms) cmd.addMessage(sLocal, c.trim())
  },
  translate_chat: async function (cmd, action) {
    let parts = action.properties.value.split(' ')
    let lang = parts[1].toLowerCase().trim()

    if (lang.startsWith('ger')) lang = 'DE'
    else if (lang.startsWith('eng')) lang = 'EN'
    else if (lang.startsWith('rus')) lang = 'RU'
    else if (lang.startsWith('bul')) lang = 'BG'
    else if (lang.startsWith('spa')) lang = 'ES'
    else if (lang.startsWith('fre')) lang = 'FR'
    else if (lang.startsWith('ita')) lang = 'IT'
    else if (lang.startsWith('jap')) lang = 'JA'
    else if (lang.startsWith('pol')) lang = 'PL'
    else if (lang.startsWith('chi')) lang = 'ZH'
    else if (lang.startsWith('dut')) lang = 'NL'

    delete parts[0]
    delete parts[1]
    let txt = parts.join(' ').trim()

    global.log.info(_SN + 'Translating to ' + lang + ': ' + txt)
    let translated = await bms.translate(txt, lang)
    cmd.addMessage(sGlobal, '#SetFakeName [Translated] ' + action.user.char.name)
    cmd.addMessage(sGlobal, translated)
    cmd.addMessage(sGlobal, await bms.get('fName', 'def'))
  },
  set_lang: async function (cmd, action) {
    let lang = action.properties.value.split(' ')[1]
    if (lang) lang = lang.toLowerCase().trim()
    if (!lang) {
      cmd.addMessage(
        sGlobal,
        await bms.get('lang.list.1', action.user.lang, { '{user}': action.user.char.name })
      )
      cmd.addMessage(
        sGlobal,
        await bms.get('lang.list.2', 'en', { '{user}': action.user.char.name })
      )
      return
    }
    if (!languages.includes(lang)) {
      cmd.addMessage(
        sGlobal,
        await bms.get('lang.unknown', action.user.lang, { '{user}': action.user.char.name })
      )
      return
    }

    if (lang == 'english') action.user.lang = 'en'
    else if (lang == 'german') action.user.lang = 'de'
    else if (lang == 'russian') action.user.lang = 'ru'
    else if (lang == 'bulgarian') action.user.lang = 'bg'
    else if (lang == 'spanish') action.user.lang = 'es'
    else if (lang == 'french') action.user.lang = 'fr'
    else if (lang == 'italian') action.user.lang = 'it'
    else if (lang == 'japanese') action.user.lang = 'ja'
    else if (lang == 'polish') action.user.lang = 'pl'
    else if (lang == 'chinese') action.user.lang = 'zh'
    else if (lang == 'dutch') action.user.lang = 'nl'

    global.userManager.saveChanges()
    cmd.addMessage(
      sGlobal,
      await bms.get('lang.set', action.user.lang, {
        '{user}': action.user.char.name,
        '{language}': lang
      })
    )
    return
  },
  discord_link: async function (cmd, action = null) {
    cmd.addMessage(sGlobal, await bms.get('discordLink', 'def'))
  },
  deactivate_mine: async function (cmd, action) {
    let mineKey = action.properties.value.split(' ')[1]
    global.log.debug(_SN + 'Deactivating Mine: ' + mineKey)
    let mine = global.mineManager.getMineByKey(mineKey)
    if (!mine) {
      cmd.addMessage(sLocal, await bms.get('mine.notFound', 'def'))
      return
    }
    if (mine.deactivate(action.user, action.timestamp))
      cmd.addMessage(sLocal, await bms.get('mine.deact', 'def'))
    global.mineManager.saveChanges()
  },
  new_player: async function (cmd, action) {
    cmd.addMessage(
      sLocal,
      await bms.get('newP.m1', action.user.lang, { '{user}': action.user.char.name })
    )
    cmd.addMessage(sLocal, await bms.get('newP.m2', action.user.lang))
    cmd.addMessage(sLocal, await bms.get('newP.m3', action.user.lang))
    cmd.addMessage(sLocal, await bms.get('newP.m4', action.user.lang))
    cmd.addMessage(sLocal, await bms.get('newP.m5', action.user.lang))
  },
  ping: async function (cmd, action) {
    cmd.addMessage(
      sGlobal,
      await bms.get('ping', action.user.lang, { '{user}': action.user.char.name })
    )
  },
  joke: async function (cmd, action) {
    let joke = await getJoke()
    while (joke.length > 195) joke = await getJoke()
    cmd.addMessage(sGlobal, await bms.get('joke', 'def', { '{joke}': joke }))
  },
  list_rules: async function (cmd, action = null) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal
    cmd.addMessage(scope, await bms.get('rules.intro', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r1', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r2', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r3', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r4', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r5', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r6', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r7', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r8', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r9', action.user.lang))
    cmd.addMessage(scope, await bms.get('rules.r10', action.user.lang))
  },
  show_rule: async function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let ruleKey = parseInt(action.properties.value.split(' ')[1])
    let rule = await bms.get('rules.r' + ruleKey, action.user.lang)
    if (!rule) rule = await bms.get('rules.notFound', action.user.lang, { '{number}': ruleKey })
    cmd.addMessage(scope, rule)
  },
  what_is_going_on: async function (cmd, action = null) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal
    cmd.addMessage(scope, ':[Wot]: ・ ...is going on here')
    cmd.addMessage(scope, ':[Wot]: ・ BREKFEST')
  },
  vote_night: async function (cmd, action = null) {
    cmd.addMessage(sGlobal, await bms.get('vote.night', 'def'))
    cmd.addMessage(sGlobal, '#vote SetTimeOfDay 22')
  },
  vote_weather_sun: async function (cmd, action = null) {
    cmd.addMessage(sGlobal, await bms.get('vote.sun', 'def'))
    cmd.addMessage(sGlobal, '#vote SetWeather 0')
  },
  vote_weather_rain: async function (cmd, action = null) {
    cmd.addMessage(sGlobal, await bms.get('vote.rain', 'def'))
    cmd.addMessage(sGlobal, '#vote SetWeather 1')
  },
  vote_day: async function (cmd, action = null) {
    if (global.state.time) {
      let hour = parseInt(global.state.time.slice(0, -6))
      if (hour > 7) {
        cmd.addMessage(
          sGlobal,
          await bms.get('vote.day.nope', 'def', { '{time}': global.state.time })
        )
        return
      }
    }
    cmd.addMessage(sGlobal, await bms.get('vote.day', 'def'))
    cmd.addMessage(sGlobal, '#vote SetTimeOfDay 7')
  },
  online: async function (cmd, action = null) {
    cmd.addMessage(
      sGlobal,
      await bms.get('online', action.user.lang, { '{players}': global.state.players })
    )
  },
  time: async function (cmd, action = null) {
    let time = '<unavailable>'
    if (global.state.time) time = global.state.time
    cmd.addMessage(sGlobal, await bms.get('time', action.user.lang, { '{time}': time }))
  },
  restart_countdown: async function (cmd, action = null) {
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
      await bms.get('restart', action.user.lang, { '{minutes}': minutes, '{hours}': hours })
    )
  },
  reset_starterkit: async function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let charName = action.properties.value.split(' ')
    delete charName[0]
    charName = charName.join(' ')
    let sUser = global.userManager.getUserByCharName(charName)
    if (!sUser)
      cmd.addMessage(scope, await bms.get('unknownUser', action.user.lang, { '{user}': charName }))
    else {
      sUser.info.starterkit = null
      global.userManager.saveChanges()
      cmd.addMessage(
        scope,
        await bms.get('resetStarter', 'def', {
          '{user}': sUser.char.name + '(' + sUser.char.id + ')'
        })
      )
    }
  },
  whois_stats: async function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let charName = action.properties.value.split(' ')
    delete charName[0]
    charName = charName.join(' ')

    let sUser = global.userManager.getUserByCharName(charName)
    if (!sUser)
      cmd.addMessage(scope, await bms.get('unknownUser', action.user.lang, { '{user}': charName }))
    else await addStats(cmd, sUser, scope)
  },
  whoami_stats: async function (cmd, action) {
    await addStats(cmd, action.user, sGlobal)
  },
  manual_welcome: async function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    let charName = action.properties.value.split(' ')
    delete charName[0]
    charName = charName.join(' ')
    cmd.addMessage(scope, await bms.get('pPos.firstJoin', 'def', { '{userID}': charName }))
    cmd.addMessage(sGlobal, await bms.get('firstJoin.m1', 'def', { '{user}': charName }))
    cmd.addMessage(sGlobal, await bms.get('firstJoin.m2', 'def'))
  },
  anonymize_login: async function (cmd, action) {
    let userProps = global.userManager.getUserProperties(action.user)
    let msg = null
    let setTo = null
    if (userProps.loginAnonym) {
      msg = await bms.get('anonymize.off', action.user.lang, { '{user}': action.user.char.name })
      setTo = false
    } else {
      msg = await bms.get('anonymize.on', action.user.lang, { '{user}': action.user.char.name })
      setTo = true
    }
    action.user.overwrite['loginAnonym'] = setTo
    global.userManager.saveChanges()
    global.userManager.getUserProperties(action.user, true)
    cmd.addMessage(sGlobal, msg)
  },
  starterkit: async function (cmd, action) {
    if (action.user.info.starterkit) {
      cmd.addMessage(
        sGlobal,
        await bms.get('sKit.illegal', action.user.lang, { '{user}': action.user.char.name })
      )
      return
    }
    cmd.addMessage(
      sGlobal,
      await bms.get('sKit.start1', action.user.lang, { '{user}': action.user.char.name })
    )
    cmd.addMessage(
      sGlobal,
      await bms.get('sKit.start2', action.user.lang, { '{user}': action.user.char.name })
    )
    cmd.addMessage(
      sGlobal,
      await bms.get('pPos.inside', 'def', { '{userID}': action.user.steamID })
    )
    cmd.addMessage(sGlobal, await bms.get('pos.idle', 'def'))
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
    cmd.addMessage(sGlobal, await bms.get('pos.outside', 'def'))
    cmd.addMessage(sGlobal, '#SpawnVehicle BP_Quad_01_A')
    cmd.addMessage(
      sLocal,
      await bms.get('sKit.done', action.user.lang, { '{user}': action.user.char.name })
    )
    cmd.addMessage(sGlobal, await bms.get('pos.idle', 'def'))

    let stamp = new Date().getTime()
    action.user.info.starterkit = stamp
  },
  connectDC: async function (cmd, action) {
    let code = action.properties.value.split(' ')[1]

    if (!code) {
      cmd.addMessage(sGlobal, await bms.get('connect.help', action.user.lang))
      return
    }

    if (global.userManager.redeemConnectionCode(action.user, code))
      cmd.addMessage(sGlobal, await bms.get('connect.yap', action.user.lang))
    else cmd.addMessage(sGlobal, await bms.get('connect.nope', action.user.lang))
  },
  shop_info: async function (cmd, action) {
    let scope = sLocal
    if (action.properties.scope == 'global') scope = sGlobal

    cmd.addMessage(
      scope,
      await bms.get('shop.info', action.user.lang, { '{user}': action.user.char.name })
    )
  },
  help: async function (cmd, action) {
    cmd.addMessage(
      sGlobal,
      await bms.get('help.m1', action.user.lang, { '{user}': action.user.char.name })
    )
    cmd.addMessage(sGlobal, await bms.get('help.m2', 'en'))
    cmd.addMessage(sGlobal, await bms.get('help.m3', action.user.lang))
    cmd.addMessage(sGlobal, await bms.get('help.m4', action.user.lang))
  },
  travel: async function (cmd, action) {
    let target = false
    let station = action.properties.value
      .toLowerCase()
      .replace('!travel', '')
      .replace('!fasttravel', '')
      .trim()
    if (station == 'd0') target = '#Teleport -669327 387796 72675'
    else if (station == 'b2') target = '#Teleport -116775 -66744 37065'
    else if (station == 'z0') target = '#Teleport -829491 -837658 5690'
    else if (station == 'a3') target = '#Teleport 101034 -492350 9982'
    else if (station == 'd4') target = '#Teleport 430079 477843 10546'
    else if (station == 'info' || station == 'infos') {
      cmd.addMessage(
        sGlobal,
        await bms.get('travel.info', action.user.lang, { '{user}': action.user.char.name })
      )
      return
    } else {
      cmd.addMessage(
        sGlobal,
        await bms.get('travel.unknownLoc', action.user.lang, { '{user}': action.user.char.name })
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
        notEnough: await bms.get('travel.notEnough', action.user.lang, {
          '{user}': action.user.char.name
        }),
        noStation: await bms.get('travel.noStation', action.user.lang, {
          '{user}': action.user.char.name
        }),
        start: await bms.get('travel.start', action.user.lang, { '{user}': action.user.char.name }),
        somethingWrong: await bms.get('travel.somethingWrong', action.user.lang, {
          '{user}': action.user.char.name
        })
      }
    })
  },
  transfer: async function (cmd, action) {
    let parts = action.properties.value.split(' ')
    let amount = parts[1].replace('[', '').replace(']', '').trim()

    delete parts[0]
    delete parts[1]
    let transferTo = parts.join(' ').trim()

    if (!transferTo)
      cmd.addMessage(
        sGlobal,
        await bms.get('trans.form', action.user.lang, { '{user}': action.user.char.name })
      )
    else {
      await transferFame(
        cmd,
        action.user.lang,
        action.user.char.name,
        action.user.steamID,
        transferTo,
        amount
      )
    }
  },
  shop_item: async function (cmd, action) {
    let parts = action.properties.value.split(' ')
    let itemKey = parts[1]
    let itemAmount = parts[2] ? (parseInt(parts[2]) > 10 ? 10 : parseInt(parts[2])) : 1

    if (!itemKey || !itemKey.trim()) {
      cmd.addMessage(
        sGlobal,
        await bms.get('shop.noItem', action.user.lang, { '{user}': action.user.char.name })
      )
      return
    }

    let items = await getItemList()
    let item = items[itemKey.trim().toLowerCase()]
    if (!item || !item.spawn_command) {
      cmd.addMessage(
        sGlobal,
        await bms.get('shop.unknownItem', action.user.lang, { '{user}': action.user.char.name })
      )
      return
    }

    let discount = 0
    switch (action.user.rank) {
      case 'Expert':
        discount = 0.1
        break
      case 'Veteran':
        discount = 0.15
        break
      case 'Professional':
        discount = 0.2
        break
      case 'Master':
        discount = 0.25
        break
      case 'Legend':
        discount = 0.3
        break
      case 'Immortal':
        discount = 0.6
        break
    }

    let teleport = await bms.get('pos.idle', 'def')
    let teleportUser = await bms.get('pPos.inside', 'def', { '{userID}': action.user.steamID })
    if (item.spawn_location == 'outside') {
      teleport = await bms.get('pos.outside', 'def')
      teleportUser = await bms.get('pPos.outside', 'def', { '{userID}': action.user.steamID })
    }

    cmd.addAction('sale', {
      userID: action.user.steamID,
      userName: action.user.char.name,
      shop: [-117504, -67171, 1000, 1000],
      item: item,
      teleport: teleport,
      teleportUser: teleportUser,
      messages: {
        pleaseWait: await bms.get('shop.pleaseWait', action.user.lang, {
          '{user}': action.user.char.name
        }),
        notNearShop: await bms.get('shop.notNearShop', action.user.lang, {
          '{user}': action.user.char.name
        }),
        notEnoughMoney: await bms.get('shop.notEnoughMoney', action.user.lang, {
          '{user}': action.user.char.name,
          '{fame}': item.price_fame
        }),
        startSale: await bms.get('shop.startSale', action.user.lang, {
          '{user}': action.user.char.name,
          '{fame}': item.price_fame + (discount > 0 ? ' (-' + discount * 100 + '%)' : ''),
          '{amount}': itemAmount,
          '{item}': item.name
        }),
        endSale: await bms.get('shop.endSale', action.user.lang, {
          '{user}': action.user.char.name,
          '{fame}': item.price_fame,
          '{amount}': itemAmount,
          '{item}': item.name
        }),
        somethingWrong: await bms.get('shop.somethingWrong', action.user.lang)
      }
    })

    cmd.addMessage(sGlobal, await bms.get('pos.idle', 'def'))
  },
  reload_bot: async function (cmd, action = null) {
    let scope = sLocal
    if (action && action.properties && action.properties.scope == 'global') scope = sGlobal
    global.log.info(_SN + 'RELOAD: STARTED')
    if (!global.args.includes('test')) global.sysControl.reload()
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    global.log.info(_SN + 'RELOAD: Saved mngr data')
    cmd.addMessage(scope, await bms.get('start.reload', 'def'))
  },
  reboot_bot: async function (cmd, action = null) {
    let scope = sLocal
    if (action && action.properties && action.properties.scope == 'global') scope = sGlobal
    global.log.info(_SN + 'REBOOT: STARTED')
    if (!global.args.includes('test')) global.sysControl.reboot()
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    global.log.info(_SN + 'REBOOT: Saved mngr data')
    cmd.addMessage(scope, await bms.get('start.reboot', 'def'))
  },
  restart_bot: async function (cmd, action = null) {
    let scope = sLocal
    if (action && action.properties && action.properties.scope == 'global') scope = sGlobal
    global.log.info(_SN + 'REBOOT: STARTED')
    if (!global.args.includes('test')) global.sysControl.restart()
    global.userManager.saveChanges()
    global.mineManager.saveChanges()
    global.log.info(_SN + 'REBOOT: Saved mngr data')
    cmd.addMessage(scope, await bms.get('start.reboot', 'def'))
  },
  lottery_draw: async function (cmd, action = null) {
    let winner = global.lottery.draw()
    cmd.addMessage(sGlobal, await bms.get('lottery.drawcount1', 'en'))
    cmd.addMessage(sGlobal, await bms.get('lottery.drawcount2', 'en'))
    cmd.addMessage(sGlobal, await bms.get('lottery.drawcount3', 'en'))
    cmd.addMessage(sGlobal, await bms.get('lottery.drawcount4', 'en'))
    cmd.addMessage(
      sGlobal,
      await bms.get('lottery.draw1', 'en', {
        '{user}': winner.charName,
        '{ticketamount}': winner.ticketAmount,
        '{amount}': winner.amount
      })
    )
    cmd.addMessage(sGlobal, await bms.get('lottery.draw2', 'en'))
    global.lottery.cleanUp()
  },
  lottery: async function (cmd, action) {
    let parts = action.properties.value.split(' ')
    let type = parts[1] ? parts[1].toLowerCase().trim() : ''

    if (type == 'buy') {
      let userInfo = await global.gamebot.getOnlinePlayerStats()
      if (userInfo[action.user.steamID]) {
        let fp = userInfo[action.user.steamID].fame
        if (fp && fp >= 100) {
          let ticket = global.lottery.newTicket(action.user.steamID, action.user.char.name)
          if (!ticket) {
            cmd.addMessage(
              sGlobal,
              await bms.get('lottery.already', action.user.lang, {
                '{user}': action.user.char.name
              })
            )
            return
          }
          /*
          cmd.addMessage(
            sGlobal,
            await bms.get('lottery.buying', action.user.lang, { '{user}': action.user.char.name })
          )
          */
          await transferFame(
            cmd,
            action.user.lang,
            action.user.char.name,
            action.user.steamID,
            'scumfiction',
            60,
            'LotteryBank'
          )
          cmd.addMessage(
            sGlobal,
            await bms.get('lottery.bought', action.user.lang, {
              '{user}': action.user.char.name
            })
          )
        } else {
          cmd.addMessage(
            sGlobal,
            await bms.get('lottery.noMoney', action.user.lang, { '{user}': action.user.char.name })
          )
        }
      }
    } else if (type == 'collect') {
      let amount = global.lottery.getWinnings(action.user.steamID)
      cmd.addMessage(
        sGlobal,
        await bms.get('lottery.collect', 'en', {
          '{user}': action.user.char.name,
          '{amount}': amount
        })
      )

      await transferFame(
        cmd,
        action.user.lang,
        'LotteryBank',
        process.env.BOT_STEAMID,
        action.user.char.name,
        amount
      )

      global.lottery.clearWinnings(action.user.steamID)
    } else {
      let info = global.lottery.getInfo()

      cmd.addMessage(
        sGlobal,
        await bms.get('lottery.info', 'en', {
          '{ticketamount}': info.ticketAmount,
          '{amount}': info.amount
        })
      )
    }
  },
  bounty: async function (cmd, action) {
    let parts = action.properties.value.split(' ')
    let type = parts[1] ? parts[1].toLowerCase().trim() : ''

    if (type == 'add') {
      let userInfo = await global.gamebot.getOnlinePlayerStats()
      if (!userInfo[action.user.steamID]) return

      let amount = parts[2] ? parseInt(parts[2]) : 0
      if (amount <= 0) {
        cmd.addMessage(sGlobal, await bms.get('bounty.noAmount', action.user.lang))
        return
      }

      let userfp = userInfo[action.user.steamID].fame
      if (!userfp || userfp < amount) {
        cmd.addMessage(sGlobal, await bms.get('bounty.noFame', action.user.lang))
        return
      }

      let target = parts[3] ? parts[3].trim() : false
      target = global.userManager.getUserByCharName(target)
      if (!target) {
        cmd.addMessage(sGlobal, await bms.get('bounty.noVictim', action.user.lang))
        return
      }

      await transferFame(
        cmd,
        action.user.lang,
        action.user.char.name,
        action.user.steamID,
        'scumfiction',
        amount,
        'BountyBank'
      )

      target.addBounty(action.user.steamID, amount)
      global.userManager.saveChanges()

      cmd.addMessage(sGlobal, await bms.get('bounty.addSuccess', action.user.lang))
    } else if (type == 'remove') {
      let target = parts[2] ? parts[2].trim() : false
      target = global.userManager.getUserByCharName(target)
      if (!target) {
        cmd.addMessage(sGlobal, await bms.get('bounty.noVictim', action.user.lang))
        return
      }

      let amount = target.removeBounty(action.user.steamID)

      await transferFame(
        cmd,
        action.user.lang,
        'BountyBank',
        process.env.BOT_STEAMID,
        action.user.char.name,
        amount
      )

      cmd.addMessage(
        sGlobal,
        await bms.get('bounty.removed', action.user.lang, { '{amount}': amount })
      )

      global.userManager.saveChanges()
    } else if (type == 'collect') {
      let amount = action.user.bountyEarned

      if (amount <= 0) {
        cmd.addMessage(sGlobal, await bms.get('bounty.noneEarned', action.user.lang))
        return
      }

      await transferFame(
        cmd,
        action.user.lang,
        'BountyBank',
        process.env.BOT_STEAMID,
        action.user.char.name,
        amount
      )

      cmd.addMessage(
        sGlobal,
        await bms.get('bounty.transferEarned', action.user.lang, { '{amount}': amount })
      )

      action.user.bountyEarned = 0
      global.userManager.saveChanges()
    } else if (type == 'help' || type == 'info') {
      cmd.addMessage(sGlobal, await bms.get('bounty.help', action.user.lang))
    } else {
      let list = global.userManager.getBountyList()
      if (!list.length) {
        cmd.addMessage(sGlobal, await bms.get('bounty.noBounties', action.user.lang))
        return
      }

      cmd.addMessage(sGlobal, await bms.get('bounty.listCurrent', action.user.lang))
      for (const e in list) {
        cmd.addMessage(
          sGlobal,
          await bms.get('bounty.listEntry', action.user.lang, {
            '{victim}': list[e].charName,
            '{total}': list[e].totalAmount
          })
        )
      }
      cmd.addMessage(sGlobal, await bms.get('bounty.help', action.user.lang))
    }
  },
  voteban: async function (cmd, action) {
    let parts = action.properties.value.split(' ')

    delete parts[0]
    let banUser = parts.join(' ').trim()

    if (!banUser || !banUser.length) {
      cmd.addMessage(sGlobal, 'Please provide Username')
      return
    }

    let toBeBanned = null
    const userInfo = await global.gamebot.getOnlinePlayerStats()

    for (const key in userInfo) {
      if (userInfo[key].charName.toLowerCase().trim() == banUser.toLowerCase()) {
        toBeBanned = userInfo[key]
        break
      }
    }

    if (!toBeBanned) {
      cmd.addMessage(sGlobal, 'User ' + banUser + ' not found')
      return
    }

    if (!voteBanCache[toBeBanned.steamID]) voteBanCache[toBeBanned.steamID] = []
    if (voteBanCache[toBeBanned.steamID].includes(action.user.steamID)) {
      cmd.addMessage(sGlobal, 'Already voted')
      return
    }

    voteBanCache[toBeBanned.steamID].push(action.user.steamID)
    if (voteBanCache[toBeBanned.steamID].length >= process.env.SETTING_VOTEBAN_AMOUNT) {
      cmd.addMessage(sGlobal, 'Vote successful.')
      return
    }

    let voteLeft = process.env.SETTING_VOTEBAN_AMOUNT - voteBanCache[toBeBanned.steamID].length

    cmd.addMessage(sGlobal, 'Vote added. ' + voteLeft + ' votes left.')
    return
  }
}

async function transferFame(cmd, language, username, from, to, amount, altTo = false) {
  cmd.addAction('transfer', {
    from: from,
    to: to,
    amount: amount,
    messages: {
      notEnough: await bms.get('trans.notEnough', language, {
        '{user}': username
      }),
      notFound: await bms.get('trans.notFound', language, {
        '{user}': username
      }),
      success: await bms.get('trans.success', language, {
        '{user}': username
      }),
      started: await bms.get('trans.started', language, {
        '{user1}': username,
        '{user2}': altTo ? altTo : to
      }),
      somethingWrong: await bms.get('trans.somethingWrong', language, {
        '{user}': username
      })
    }
  })
}

let itemListCache = null

async function getItemList() {
  if (itemListCache) return itemListCache

  let url = process.env.SETTING_SHOPITEMS_URL
  let iList = await fetch(url, {
    method: 'Get'
  })
    .then(res => res.json())
    .then(json => {
      return json
    })

  let iListNew = {}
  for (let i of iList) iListNew[i.keyword] = i
  itemListCache = iListNew
  return itemListCache
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

async function addStats(cmd, sUser, scope) {
  let jD = stampToDateTime(sUser.stats.firstJoin)
  let pTime = getDuration(sUser.stats.totalPlaytime)
  cmd.addMessage(
    scope,
    await bms.get('whoami.m1', 'def', {
      '{user}': sUser.char.name,
      '{group}': global.userManager.groups[sUser.group].name,
      '{date}': jD.date,
      '{time}': jD.time
    })
  )
  cmd.addMessage(
    scope,
    await bms.get('whoami.m2', 'def', {
      '{logins}': sUser.stats.totalLogins,
      '{playtime}': parseInt(pTime.d) * 24 + parseInt(pTime.h),
      '{rank}': sUser.rank
    })
  )
  cmd.addMessage(
    scope,
    await bms.get('whoami.m3', 'def', {
      '{local}': sUser.stats.totalMessages.local,
      '{global}': sUser.stats.totalMessages.global,
      '{squad}': sUser.stats.totalMessages.squad
    })
  )
  cmd.addMessage(scope, await bms.get('whoami.m4', 'def', { '{caps}': sUser.warning.capslock }))
  cmd.addMessage(
    scope,
    await bms.get('whoami.m5', 'def', { '{kills}': Object.keys(sUser.kills).length })
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
