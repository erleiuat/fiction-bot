let lastDone = {}

let botMsgs = null
let sGlobal = null
let sLocal = null

module.exports = class Command {
  clearQueue = false
  commands = []

  init(msgs, scopeLocal, scopeGlobal) {
    sGlobal = scopeGlobal
    sLocal = scopeLocal
    botMsgs = msgs
  }

  constructor(clearQueue = false) {
    this.clearQueue = clearQueue
  }

  addMessage(scope, msg) {
    if (
      this.commands[this.commands.length - 1] &&
      this.commands[this.commands.length - 1]['messages']
    )
      this.commands[this.commands.length - 1]['messages'].push({
        scope: scope,
        content: msg
      })
    else
      this.commands.push({
        messages: [
          {
            scope: scope,
            content: msg
          }
        ]
      })
  }

  addAction(action, acteurs = true) {
    if (
      this.commands[this.commands.length - 1] &&
      this.commands[this.commands.length - 1]['actions']
    )
      this.commands[this.commands.length - 1]['actions'].push({
        type: action,
        properties: acteurs
      })
    else
      this.commands.push({
        actions: [
          {
            type: action,
            properties: acteurs
          }
        ]
      })
  }

  tooEarly(action, waitMins) {
    let now = new Date().getTime()
    waitMins = waitMins * 60 * 1000
    console.log(lastDone)
    if (lastDone[action] && lastDone[action] > now - waitMins) {
      let waitFor = Math.round((waitMins - (now - lastDone[action])) / 1000 / 60)
      this.addMessage(sGlobal, botMsgs.tooEarly.replace('{minutes}', waitFor))
      return true
    }
    lastDone[action] = now
    return false
  }
}
