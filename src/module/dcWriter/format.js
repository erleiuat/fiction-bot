const _SN = '[MODULE][DCWRITER][FORMAT] -> '

const mapLocation = require('../../service/mapLocation/')
const weaponImage = require('../../service/weaponImage')
const cloneDeep = require('lodash.clonedeep')
const Discord = require('discord.js')

exports.violation = function violation(action) {
  let msgDefault = {
    title: 'VIOLATION',
    color: 'FDDB00',
    description: action.properties.value,
    fields: [
      {
        name: '\u200b',
        value: ' <@&' + process.env.DC_ROLE_SUPPORT + '> '
      }
    ],
    footer: {
      text: formTime(action.date).txt
    }
  }

  return {
    default: false,
    extended: new Discord.MessageEmbed(msgDefault)
  }
}

exports.admin = function admin(action) {
  let userProps = global.userManager.getUserProperties(action.user)
  let display = getDisplayVals(action, userProps)

  let msgDefault = {
    color: display.color,
    author: {
      name: display.name
    },
    description: '```\n' + action.properties.command + ' ' + action.properties.value + '\n```',
    fields: [],
    footer: {
      text: formTime(action.date).txt
    }
  }

  let msgExtended = cloneDeep(msgDefault)
  extendedAddInfo(msgExtended, action)
  msgDefault = checkCommand(msgDefault, userProps, action.user.discordID, action.properties.command)

  return {
    default: msgDefault ? new Discord.MessageEmbed(msgDefault) : msgDefault,
    extended: new Discord.MessageEmbed(msgExtended)
  }
}

exports.mine = function mine(action) {
  let formedTime = formTime(action.date)

  let msgDefault = {
    title: 'MINE-ACTION -> ' + action.properties.action,
    color: 'F3EA5F',
    fields: [
      {
        name: 'Causer',
        value: action.user.char.name,
        inline: true
      },
      {
        name: 'Action',
        value: action.properties.action,
        inline: true
      },
      {
        name: 'Type',
        value: action.properties.mine.type,
        inline: true
      },
      {
        name: 'Owner',
        value:
          action.properties.mine.owner.char.name +
          ' (' +
          action.properties.mine.owner.steamID +
          ')',
        inline: true
      }
    ],
    footer: {
      text: formedTime.txt
    }
  }

  let fPath = global.mineManager.imagePath
  let fName = action.properties.mine.image

  let msgExtended = cloneDeep(msgDefault)
  msgExtended.files = [new Discord.MessageAttachment(fPath + fName, fName)]
  msgExtended.image = {
    url: 'attachment://' + fName
  }
  msgExtended.fields.push({
    name: 'Location',
    value:
      action.properties.mine.location.x +
      ' ' +
      action.properties.mine.location.y +
      ' ' +
      action.properties.mine.location.z
  })

  extendedAddInfo(msgExtended, action)

  return {
    default: false,
    extended: new Discord.MessageEmbed(msgExtended)
  }
}

exports.chat = function chat(action) {
  let color = 'ffffff'

  let userProps = global.userManager.getUserProperties(action.user)
  let display = getDisplayVals(action, userProps)
  if (action.properties.isCommand) display.color = 'FFCC00'

  let msgDefault = {
    color: display.color,
    title: display.name,
    description: '```\n' + action.properties.value + '\n```',
    fields: [],
    footer: {
      text: formTime(action.date).txt
    }
  }

  let msgExtended = cloneDeep(msgDefault)
  msgExtended.title += '_ - ' + action.properties.scope.toUpperCase() + '-CHAT_'
  if (action.properties.value.match(/(?:admin|support|abuse|abuze)/gim))
    msgExtended.fields.push({
      name: '\u200b',
      value: ' <@&' + process.env.DC_ROLE_SUPPORT + '> '
    })

  extendedAddInfo(msgExtended, action)

  return {
    default: action.properties.scope == 'global' ? new Discord.MessageEmbed(msgDefault) : false,
    extended: new Discord.MessageEmbed(msgExtended)
  }
}

exports.auth = function auth(action) {
  let msgDefault = {
    title: action.properties.authType == 'login' ? 'Login' : 'Logout',
    description: action.user.char.name + (action.user.auth.isDrone ? ' (Drone)' : ''),
    fields: [
      { name: 'IP', value: action.user.auth.ip, inline: true },
      { name: 'charID', value: action.user.char.id, inline: true },
      { name: 'SteamID', value: action.user.steamID }
    ],
    footer: {
      text: formTime(action.date).txt
    }
  }

  return {
    default: false,
    extended: new Discord.MessageEmbed(msgDefault)
  }
}

exports.kill = function kill(action) {
  let formedTime = formTime(action.date)
  let mLocPath = './data/tmp/mapLocation/kill/'
  let mLocName = formedTime.key + '.' + action.user.steamID + '.' + action.properties.type + '.jpg'
  mapLocation.generate(
    action.properties.location.victim.x,
    action.properties.location.victim.y,
    mLocName,
    mLocPath
  )

  let weaponTxt = action.properties.weapon.includes('_C')
    ? action.properties.weapon.split('_C')[0].replace(/\s/g, '')
    : action.properties.weapon
  let msgDefault = {
    color: action.properties.event ? '00ffff' : 'ff0000',
    title:
      (action.properties.event ? 'Event-' : '') +
      (action.properties.type == 'died' ? 'Kill' : 'Coma'),
    fields: [
      {
        name: 'Attacker',
        value: action.properties.causer.char.name
      },
      {
        name: 'Victim',
        value: action.user.char.name
      },
      {
        name: 'Weapon',
        value: weaponTxt
      },
      {
        name: 'Distance',
        value: action.properties.distance + ' meters'
      }
    ],
    footer: {
      text: formedTime.txt
    }
  }

  let weaponImg = weaponImage.get(action.properties.weapon)
  if (weaponImg)
    msgDefault.thumbnail = {
      url: weaponImg
    }

  let msgExtended = cloneDeep(msgDefault)
  msgExtended.files = [new Discord.MessageAttachment(mLocPath + mLocName, mLocName)]
  msgExtended.image = {
    url: 'attachment://' + mLocName
  }
  msgExtended.fields.push({
    name: 'Victim Location',
    value: Object.values(action.properties.location.victim).join(' ')
  })
  if (action.properties.location.causer)
    msgExtended.fields.push({
      name: 'Perpetrator Location',
      value: Object.values(action.properties.location.causer).join(' ')
    })

  extendedAddInfo(msgExtended, action)

  return {
    default: new Discord.MessageEmbed(msgDefault),
    extended: new Discord.MessageEmbed(msgExtended)
  }
}

function extendedAddInfo(msgExtended, action) {
  if (!msgExtended.fields) msgExtended.fields = []
  msgExtended.fields.push(
    {
      name: 'SteamID',
      value: action.user.steamID,
      inline: true
    },
    {
      name: 'CharID',
      value: action.user.char.id,
      inline: true
    },
    {
      name: 'FakeName',
      value: action.fakeName ? action.fakeName : '_None_',
      inline: true
    }
  )
}

function formTime(actionDate) {
  let actD = actionDate
  let d = nZero.form(actD.getDate())
  let m = nZero.form(actD.getMonth() + 1)
  let y = actD.getFullYear()
  let h = nZero.form(actD.getHours())
  let min = nZero.form(actD.getMinutes())
  let s = nZero.form(actD.getSeconds())

  return {
    key: y + '_' + m + '_' + d + '.' + h + '_' + min + '_' + s,
    txt: d + '.' + m + '.' + y + ' - ' + h + ':' + min + ':' + s
  }
}

function checkCommand(msgDefault, userProps, discordID, command) {
  command = command.toLowerCase()
  if (
    !userProps.hideCommands.includes('#*') &&
    !userProps.hideCommands.includes(command.toLowerCase())
  ) {
    if (
      !userProps.hideCommandAlarms.includes('#*') &&
      !userProps.hideCommandAlarms.includes(command.toLowerCase())
    ) {
      msgDefault.color = 'dc122a'
      msgDefault.fields.push(
        {
          name: '\u200b',
          value:
            (discordID ? '<@' + discordID + '>' : '@' + msgDefault.author.name + ': ') +
            ' **__Please explain by replying to the message what you needed the command for__**'
        },
        {
          name: '\u200b',
          value:
            '_@here if you don\'t want to receive admin abuse notifications in the future, change the notification settings of this channel to "nothing"_'
        }
      )
      if (
        !userProps.allowCommands.includes('#*') &&
        !userProps.allowCommands.includes(command.toLowerCase())
      ) {
        msgDefault.color = 'FF3333'
        msgDefault.fields.push({
          name: '\u200b',
          value:
            '__**<@&' +
            process.env.DC_ROLE_SUPPORT +
            '> THIS USER IS NOT ALLOWED TO EXECUTE THIS COMMAND**__'
        })
      }
    }
  } else {
    msgDefault = false
  }
  return msgDefault
}

function getDisplayVals(action, userProps) {
  let vals = {
    name: action.user.char.name,
    color: 'ffffff'
  }

  if (action.fakeName && userProps.useFakeNames) vals.name = action.fakeName
  if (vals.name.startsWith('・ :[FiBo]')) {
    vals.color = '00FFFF'
    vals.name = '[FiBo] (FictionBot)'
  } else if (vals.name.startsWith(process.env.DC_HANDLER_CHAT_PREFIX)) vals.color = '7289DA'

  return vals
}
