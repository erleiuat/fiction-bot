const _SN = '[MODULE][GAMEBOT] -> '

let run = false

exports.start = async function start() {
  run = true
  global.log.info(_SN + 'Started')
}

exports.sendFromDC = async function sendFromDC(action) {}
