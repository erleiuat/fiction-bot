const _SN = '[MODULE][STATISTICS][MINESACTIVE] -> '

const spaces1 = ''
const spaces2 = '\u0020\u0020\u0020\u0020\u0020\u0020'
const spaces3 = '\u0020\u0020\u0020\u0020\u0020\u0020\u0020\u0020'
const divider = '\u200b\n--------------------------------------------------------------\n\n\u200b'

const Discord = require('discord.js')

exports.format = function format(list) {
  let tmpMsgs = []
  let i = 0

  for (const mine of list) {
    if (mine.type == 'Barbed Spike Trap' || mine.type == 'C4 Bomb' || mine.type == 'Silent Alarm')
      continue

    let fPath = global.mineManager.imagePath
    let fName = mine.image
    i++

    let events = ''
    for (const ev in mine.events)
      events +=
        formatTimestamp(mine.events[ev].timestamp) +
        ': ' +
        mine.events[ev].action +
        ' by ' +
        mine.events[ev].causer.char.name +
        '\n'

    let msg = new Discord.MessageEmbed({
      title: mine.key,
      color: 'F3EA5F',
      files: [new Discord.MessageAttachment(fPath + fName, fName)],
      image: {
        url: 'attachment://' + fName
      },
      fields: [
        {
          name: 'Type',
          value: mine.type
        },
        {
          name: 'Owner',
          value: mine.owner.char.name + ' (' + mine.owner.steamID + ')'
        },
        {
          name: 'Location',
          value: mine.location.x + ' ' + mine.location.y + ' ' + mine.location.z
        },
        {
          name: 'Created',
          value: formatTimestamp(mine.created)
        },
        {
          name: 'Events',
          value: events
        }
      ]
    })

    tmpMsgs.push(msg)
  }
  return tmpMsgs
}

exports.formatInactive = function formatInactive(listObj) {
  let tmpMsgs = []
  let total = 0

  let msgEntry = ''
  for (const key in listObj) {
    let mine = listObj[key]
    total++

    let mEvents = ''
    for (const key in mine.events) {
      mEvents +=
        '\n' +
        spaces3 +
        formatTimestamp(mine.events[key].timestamp) +
        ': ' +
        mine.events[key].action
    }

    let mEntry =
      spaces1 +
      '`' +
      mine.key +
      '`\n' +
      spaces2 +
      'Type: ' +
      mine.type +
      '\n' +
      spaces2 +
      'Created: ' +
      formatTimestamp(mine.created) +
      '\n' +
      spaces2 +
      'Owner: ' +
      mine.owner.char.name +
      '\n' +
      spaces2 +
      'Events: ' +
      mEvents +
      '\n' +
      divider

    if (msgEntry.length + mEntry.length >= 2000) {
      tmpMsgs.push(msgEntry)
      msgEntry = ''
    }

    msgEntry += mEntry
  }

  let totalMsg = '\u200b\n\n**TOTAL:** ' + total + '\n\u200b'
  if (msgEntry.length + totalMsg.length >= 2000) {
    tmpMsgs.push(msgEntry)
    msgEntry = ''
  }

  msgEntry += totalMsg
  tmpMsgs.push(msgEntry)

  return tmpMsgs
}

function formatTimestamp(timestamp) {
  let d = new Date(timestamp)
  return d.toLocaleDateString() + ' - ' + d.toLocaleTimeString()
}
