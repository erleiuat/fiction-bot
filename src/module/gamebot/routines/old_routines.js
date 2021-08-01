const _SN = '[MODULE][GAMEBOT][ROUTINES] -> '

const cp = require('child_process')
const fetch = require('node-fetch')
const request = require('request')

let bms = null
let sGlobal = null
let sLocal = null

exports.init = function init(msgs, scopeLocal, scopeGlobal) {
  sGlobal = scopeGlobal
  sLocal = scopeLocal
  bms = msgs
}

exports.team_channel = async function team_channel(cmd, action) {
  let parts = action.properties.value.split(' ')
  let stmt = parts[1].trim().toLowerCase()
  switch (stmt) {
    case 'create':
      let name = parts[2] ? parts[2].trim().toLowerCase() : false
      if (!name) {
        cmd.addMessage(sLocal, bms['en'].tChnl.needName)
        return
      }

      await global.teams.create(name)

      break
    case 'addmember':
      break
    case 'removemember':
      break
  }
}
