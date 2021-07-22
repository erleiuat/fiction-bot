const _SN = '[MODULE][GAMEBOT][PLAYERREPORTER] -> '

const Command = require('./command')
const Discord = require('discord.js')
//const mapLocation = require('../../service/mapLocation/')

exports.start = async function start(dcClient, routines) {
  let client = dcClient
  let channel = client.channels.cache.find(ch => ch.id === process.env.DC_CH_MAPSHOTS)

  do {
    let cmd = new Command()
    routines.mapShot(cmd, { path: './data/tmp/mapShots/' })
    let imgInfo = await global.gamebot.executeCommand(cmd)

    if (!imgInfo.data) {
      global.log.error(_SN + 'No image info received')
      await global.time.sleep(10)
      continue
    }

    try {
      let now = new Date()
      let attachment = new Discord.MessageAttachment(imgInfo.data.fullPath, imgInfo.data.fileName)
      await channel.send(
        new Discord.MessageEmbed({
          color: '73A832',
          type: 'image',
          files: [attachment],
          image: {
            url: 'attachment://' + imgInfo.data.fileName
          },
          footer: {
            text: now.toLocaleDateString() + ` - ` + now.toLocaleTimeString()
          }
        })
      )
    } catch (error) {
      global.log.error(_SN + error)
    }

    await global.time.sleep(60)
  } while (true)
}
/*
exports.start = async function start(dcClient, routines) {
  client = dcClient

  do {
    //await global.time.sleep(60)
    await global.time.sleep(5)

    let cmd = new Command()
    routines.playerReport(cmd, null)

    //let data = await global.gamebot.executeCommand(cmd)
    let data = tmpData()

    let mLocPath = './data/tmp/mapLocation/playerReport/'
    let mLocName = 'tmp.jpg'

    let xys = []
    for (const el in data.data.playerInfo) {
      let tmp = data.data.playerInfo[el]
      xys.push([tmp.location.x, tmp.location.y])
    }

    mapLocation.generateMulti(xys, mLocName, mLocPath)
  } while (false)
}

function tmpData() {
  return JSON.parse(
    '{"status": "success", "command": "ACTION", "input": {"input": [{"type": "playerReport", "properties": true}]}, "data": {"playerInfo": {"76561199166410611": {"steamID": "76561199166410611", "charName": "ScumFiction", "steamName": "ScumFiction", "fame": "50", "location": {"x": "-117145.000", "y": "-66735.000", "z": "37125.000"}}, "76561198000483188": {"steamID": "76561198000483188", "charName": ".TucLance", "steamName": ".", "fame": "67", "location": {"x": "-851645.500", "y": "375400.438", "z": "60459.777"}}, "76561198316166198": {"steamID": "76561198316166198", "charName": "Keyfu79", "steamName": "Keyfu79", "fame": "406", "location": {"x": "-784108.750", "y": "-405309.625", "z": "8644.062"}}, "76561198289331970": {"steamID": "76561198289331970", "charName": "Eismann_79", "steamName": "Eismann_79", "fame": "225", "location": {"x": "-139467.344", "y": "-555165.750", "z": "348.310"}}, "76561198058320009": {"steamID": "76561198058320009", "charName": "Joppala", "steamName": "Chris P. Bacon", "fame": "50", "location": {"x": "-117089.008", "y": "-66735.000", "z": "37125.000"}}}}}'
  )
}
*/
