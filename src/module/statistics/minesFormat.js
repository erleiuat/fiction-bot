const _SN = '[MODULE][STATISTICS][MINESACTIVE] -> '

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
      title: 'MINE #' + i,
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

function formatTimestamp(timestamp) {
  let d = new Date(timestamp)
  return d.toLocaleDateString() + ' - ' + d.toLocaleTimeString()
}
