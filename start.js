const _SN = '[START] -> '
const args = process.argv.slice(2).map(el => el.replace('-', '').trim())

require('dotenv').config()
require('./src/service/log')
require('./src/service/nZero')
require('./src/service/time')
const UserManager = require('./src/service/userManager/')
global.userManager = new UserManager()

if (args.includes('gamebot')) global.conf = require('./settings/gamebot').settings
else if (args.includes('discord')) global.conf = require('./settings/discord').settings
else throw new Error(_SN + 'No config selected')

require('./src/main')
