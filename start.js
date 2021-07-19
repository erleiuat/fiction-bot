const _SN = '[START] -> '
const args = process.argv.slice(2).map(el => el.replace('-', '').trim())

require('dotenv').config()
require('./src/service/time')
require('./src/service/nZero')
require('./src/service/log')
const UserManager = require('./src/service/userManager/')
global.userManager = new UserManager()

if (args.includes('gamebot')) global.runType = 'gamebot'
else if (args.includes('discord')) global.runType = 'discord'
else if (args.includes('full')) global.runType = 'full'
else throw new Error(_SN + 'No runType provided')

require('./src/main')
