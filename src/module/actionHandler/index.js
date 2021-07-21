const _SN = '[MODULE][ACTIONHANDLER] -> '

exports.handle = async function handle(action) {
  if (global.args.includes('noHandle')) return
  global.log.info(_SN + 'Handling action from "' + action.origin + '"')

  switch (action.origin) {
    case 'logHandler':
      if (global.dcWriter) global.dcWriter.sendFromLog(action)
      if (global.gamebot) await global.gamebot.sendFromLog(action)
      break

    case 'dcHandler':
      if (global.gamebot) await global.gamebot.sendFromDC(action)
      break

    case 'schedule':
      if (global.gamebot) await global.gamebot.sendFromSchedule(action)
      break

    default:
      global.log.error(_SN + 'Unknown Origin')
  }
}
