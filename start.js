const _SN = '[START] -> '
global.args = process.argv.slice(2).map(el => el.replace('-', '').trim())

require('dotenv').config()
require('./src/service/time')
require('./src/service/nZero')
require('./src/service/log')
const UserManager = require('./src/service/userManager/')
global.userManager = new UserManager()

require('./src/main')
