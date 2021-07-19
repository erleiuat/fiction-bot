const _SN = '[MODULE][ACTIONHANDLER] -> '

exports.handle = async function handle(action) {
  global.log.info(
    _SN + 'Sending action from "' + action.origin + '" to "' + global.conf.execute + '"'
  )

  switch (action.origin) {
    case 'logHandler':
      if (global.conf.execute == 'discord') global.dcWriter.sendFromLog(action)
      else if (global.conf.execute == 'gamebot') global.gamebot.sendFromLog(action)
      break
    case 'dcHandler':
      if (global.conf.execute == 'discord') global.dcWriter.sendFromDC(action)
      else if (global.conf.execute == 'gamebot') global.gamebot.sendFromDC(action)
      break
    default:
      global.log.warning(_SN + 'Unknown Origin')
  }
}
