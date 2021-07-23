let lastDone = {}

module.exports = class Command {
  clearQueue = false
  commands = []

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
      this.addMessage('global', 'Sorry, you are too fast. Please wait ' + waitFor + ' minutes.')
      return true
    }
    lastDone[action] = now
    return false
  }
}
