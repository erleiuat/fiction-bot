const _SN = '[MODULE][GAMEBOT][ROUTINES] -> '

let bms = null
let sGlobal = null
let sLocal = null

module.exports = {
  chat: require('./chat'),
  init: function (botMessages, scopeLocal, scopeGlobal) {
    bms = botMessages
    sLocal = scopeLocal
    sGlobal = scopeGlobal
  },
  botStart: async function (cmd, action = null) {
    cmd.addMessage(sLocal, await bms.get('fName', 'def'))
    cmd.addMessage(sLocal, '#ListAnimals')
    cmd.addMessage(sLocal, '#ShowOtherPlayerInfo true')
    cmd.addMessage(sLocal, '#ShowFlagLocations true')
    cmd.addMessage(sLocal, await bms.get('pos.idle', 'def'))
    cmd.addMessage(sGlobal, await bms.get('start.ready', 'def'))
  },
  playerReport: async function (cmd, action = null) {
    cmd.addAction('playerReport', true)
  },
  forbiddenCommand: async function (cmd, action) {
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
  mapShot: async function (cmd, action) {
    cmd.addAction('mapShot', { path: action.path })
  },
  dcMessage: async function (cmd, action) {
    cmd.addMessage(sGlobal, '#SetFakeName ' + action.properties.useName)
    cmd.addMessage(sGlobal, action.properties.message)
    cmd.addMessage(sGlobal, await bms.get('fName', 'def'))
  }
}
