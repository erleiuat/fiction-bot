const _SN = '[MODULE][GAMEBOT][SCHEDULE] -> '

let schedules = null
let bms = null
let sGlobal = 'local'
let sLocal = 'local'

async function initSchedules() {
  schedules = {
    '5:50': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.1', 'def') }]
    },
    '5:52': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.backup', 'def') }]
    },
    '5:53': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.2', 'def') }]
    },
    '5:54': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.3', 'def') }]
    },
    '5:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.3', 'def') }]
    },
    '11:55': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.1', 'def') }]
    },
    '11:57': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.2', 'def') }]
    },
    '11:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.3', 'def') }]
    },
    '17:55': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.1', 'def') }]
    },
    '17:57': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.2', 'def') }]
    },
    '17:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart.3', 'def') }]
    },
    '23:58': {
      type: 'messages',
      values: [{ scope: sGlobal, content: '(Restart at 00:00 will be skipped)' }]
    }
    /*
    '23:55': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart1 }]
    },
    '23:57': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart2 }]
    },
    '23:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: await bms.get('schedule.restart3 }]
    }
    */
  }
}

exports.start = async function start(botMessages, scopeLocal, scopeGlobal) {
  bms = botMessages
  sLocal = scopeLocal
  sGlobal = scopeGlobal
  await initSchedules()

  do {
    let now = new Date()
    let key = global.nZero.form(now.getHours()) + ':' + global.nZero.form(now.getMinutes())

    if (!schedules[key]) {
      await global.time.sleep(5)
      continue
    }

    global.log.info(_SN + 'Sending scheduled command.')
    global.actionHandler.handle({
      origin: 'schedule',
      timestamp: now.getTime(),
      date: now,
      properties: { ...schedules[key] }
    })

    await global.time.sleep(70)
  } while (true)
}
