const _SN = '[MODULE][ACTIONHANDLER] -> '

exports.handle = async function handle(action) {
  global.log.info(_SN + 'Handling action from "' + action.origin + '"')

  switch (action.origin) {
    case 'logHandler':
      if (global.gamebot) global.gamebot.sendFromLog(action)
      if (global.dcWriter) global.dcWriter.sendFromLog(action)
      break

    case 'dcHandler':
      if (global.gamebot) global.gamebot.sendFromDC(action)
      break

    case 'schedule':
      if (global.gamebot) global.gamebot.sendFromSchedule(action)
      break

    default:
      global.log.error(_SN + 'Unknown Origin')
  }
}
