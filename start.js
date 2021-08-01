const _SN = '[START] -> '

/**
 *
 * Possible args:
 *
 * -discord     -> Post stuff on discord
 * -gamebot     -> Use gamebot
 * -noHandle    -> Don't use actionHandler (don't process events)
 * -authOnly    -> Only process auth-events (create/handle users with userManager)
 * -test        -> Output gamebot & discord events to console without executing them
 * -scumlog     -> Only start Log-Processing functions
 *
 */

require('dotenv').config()
global.args = process.argv.slice(2).map(el => el.replace('-', '').trim())

require('./src/main')
