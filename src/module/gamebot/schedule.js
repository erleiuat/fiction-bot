const _SN = '[MODULE][GAMEBOT][SCHEDULE] -> '

let schedules = null
let botMsgs = null
let sGlobal = 'local'
let sLocal = 'local'

function initSchedules() {
  schedules = {
    '5:50': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart1 }]
    },
    '5:52': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.backup }]
    },
    '5:53': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart2 }]
    },
    '5:54': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart3 }]
    },
    '5:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart3 }]
    },
    '11:55': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart1 }]
    },
    '11:57': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart2 }]
    },
    '11:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart3 }]
    },
    '17:55': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart1 }]
    },
    '17:57': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart2 }]
    },
    '17:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart3 }]
    },
    '23:55': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart1 }]
    },
    '23:57': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart2 }]
    },
    '23:59': {
      type: 'messages',
      values: [{ scope: sGlobal, content: botMsgs['en'].schedule.restart3 }]
    }
  }
}

exports.start = async function start(msgs, scopeLocal, scopeGlobal) {
  sGlobal = scopeGlobal
  sLocal = scopeLocal
  botMsgs = msgs
  initSchedules()

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
