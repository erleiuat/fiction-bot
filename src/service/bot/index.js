const _SN = '[SERVICE][BOT] -> '
const cp = require('child_process')

let bot = false

exports.execute = async function execute(cmdObj) {
  if (!cmdObj || !cmdObj.commands || !cmdObj.commands.length) return

  let resp = {
    error: false,
    status: 'success'
  }

  for (const command of cmdObj.commands) {
    for (const cmdType in command) {
      if (cmdType == 'messages')
        resp = {
          ...resp,
          ...(await this.messages(command[cmdType]))
        }
      else if (cmdType == 'actions')
        resp = {
          ...resp,
          ...(await this.actions(command[cmdType]))
        }
      else continue

      if (resp.error) {
        if (resp.errorMessage) global.log.error(sn + 'Error: ' + resp.errorMessage)
        else global.log.error(sn + 'Error while executing (no message)')
      }
    }
  }

  return resp
}

async function resOutput(resolve, logTxt) {
  bot.stdout.once('data', data => {
    data = `${data}`
    global.log.debug(_SN + data.trim())
    try {
      resolve(JSON.parse(data))
      global.log.info(_SN + logTxt)
    } catch (err) {
      if (err.message.includes('JSON')) resolve(JSON.stringify(data))
      else {
        global.log.error(_SN + err)
        resolve(false)
      }
    }
  })
}

exports.start = async function start() {
  return new Promise(resolve => {
    if (!bot) {
      bot = cp.spawn('py', ['./src/service/bot/scripts/gamebot.py'])
      global.log.info(_SN + 'Starting Bot')
      resOutput(resolve, 'Bot running')
      bot.stderr.on('data', data => {
        global.log.error(_SN + 'Error: ' + `${data}`.trim())
      })
    } else resolve({ status: 'success', command: 'START', info: 'Already running' })
  })
}

exports.messages = async function messages(msgs) {
  return new Promise(resolve => {
    global.log.info(_SN + 'Sending messages:' + JSON.stringify(msgs))
    resOutput(resolve, 'Messages sent')
    bot.stdin.write(encodeURI('MESSAGES') + '\n')
    bot.stdin.write(encodeURI(JSON.stringify(msgs)) + '\n')
  })
}

exports.actions = async function actions(action) {
  return new Promise(resolve => {
    global.log.info(_SN + 'Doing actions: ' + JSON.stringify(action))
    resOutput(resolve, 'Actions done')
    bot.stdin.write(encodeURI('ACTION') + '\n')
    bot.stdin.write(encodeURI(JSON.stringify(action)) + '\n')
  })
}
