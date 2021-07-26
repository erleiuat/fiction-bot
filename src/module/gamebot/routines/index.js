const _SN = '[MODULE][GAMEBOT][ROUTINES] -> '

let bms = null
let sGlobal = null
let sLocal = null

module.exports = {
  init: function (msgs, scopeLocal, scopeGlobal) {
    sGlobal = scopeGlobal
    sLocal = scopeLocal
    bms = msgs
  },
  chat: require('./chat'),
  botStart: function (cmd, action = null) {
    cmd.addMessage(sLocal, bms['en'].fName)
    cmd.addMessage(sLocal, '#ListAnimals')
    cmd.addMessage(sLocal, '#ShowOtherPlayerInfo true')
    cmd.addMessage(sLocal, '#ShowFlagLocations true')
    cmd.addMessage(sLocal, bms['en'].pos.idle)
    cmd.addMessage(sGlobal, bms['en'].start.ready)
  },
  playerReport: function (cmd, action = null) {
    cmd.addAction('playerReport', true)
  },
  forbiddenCommand: function (cmd, action) {
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
  },
  mapShot: function (cmd, action) {
    cmd.addAction('mapShot', { path: action.path })
  },
  dcMessage: function (cmd, action) {
    cmd.addMessage(sGlobal, '#SetFakeName ' + action.properties.useName)
    cmd.addMessage(sGlobal, action.properties.message)
    cmd.addMessage(sGlobal, bms['en'].fName)
  }
}
