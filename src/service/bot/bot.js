const sn = '[GAMEBOT] -> '
const cp = require('child_process')

let bot = false

exports.execute = async function execute(cmd) {
  if (!cmd || !cmd.commands || !cmd.commands.length) return

  let resp = {
    error: false
  }

  for (const command of cmd.commands) {
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
        if (resp.errorMessage)
          global.log.debug(sn + 'Error: ' + resp.errorMessage)
        else global.log.debug(sn + 'Error while executing (no message)')
      }
    }
  }

  global.commands = {}
  return resp
}

async function resOutput(resolve, logTxt) {
  bot.stdout.once('data', data => {
    data = `${data}`
    global.log.debug(sn + data)
    global.log.debug(sn + logTxt)
    try {
      resolve(JSON.parse(data))
    } catch (err) {
      if (err.message.includes('JSON')) resolve(JSON.stringify(data))
      else {
        global.log.debug(err)
        resolve(false)
      }
    }
  })
}

exports.start = async function start() {
  return new Promise(resolve => {
    bot = cp.spawn('py', ['./app/gamebot/scripts/gamebot.py'])
    global.log.debug(sn + 'Starting Bot')
    resOutput(resolve, 'Bot running')
    bot.stderr.on('data', data => {
      global.log.debug(sn + 'Error: ' + `${data}`)
    })
  })
}

exports.messages = async function messages(msgs) {
  return new Promise(resolve => {
    global.log.debug(sn + 'Sending messages')
    resOutput(resolve, 'Messages sent')
    bot.stdin.write(encodeURI('MESSAGES') + '\n')
    bot.stdin.write(encodeURI(JSON.stringify(msgs)) + '\n')
  })
}

exports.actions = async function actions(action) {
  return new Promise(resolve => {
    global.log.debug(sn + 'Doing actions')
    resOutput(resolve, 'Actions done')
    bot.stdin.write(encodeURI('ACTION') + '\n')
    bot.stdin.write(encodeURI(JSON.stringify(action)) + '\n')
  })
}
