const _SN = '[MODULE][ACTIONHANDLER] -> '

exports.handle = async function handle(action) {
  global.log.info(_SN + 'Handling action from "' + action.origin)

  switch (action.origin) {
    case 'logHandler':
      if (global.dcWriter) global.dcWriter.sendFromLog(action)
      else if (global.gamebot) global.gamebot.sendFromLog(action)
      break

    case 'dcHandler':
      if (global.dcWriter) global.dcWriter.sendFromDC(action)
      else if (global.gamebot) global.gamebot.sendFromDC(action)
      break

    case 'schedule':
      if (global.gamebot) global.gamebot.sendFromSchedule(action)
      break

    default:
      global.log.warning(_SN + 'Unknown Origin')
  }
}
