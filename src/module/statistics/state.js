const _SN = '[MODULE][STATISTICS][STATE] -> '

const request = require('request')

exports.check = async function check() {
  return new Promise(resolve => {
    request(
      {
        url: process.env.BATTLEMETRICS_URL
      },
      (error, response) => {
        if (error) global.log.error(_SN + 'Error: ' + error)
        else {
          try {
            let data = JSON.parse(response.body)
            if (data.data) {
              inf = data.data
              global.log.info(_SN + 'State updated')
              resolve({
                players: inf.attributes.players,
                time: inf.attributes.details.time
              })
            }
          } catch (e) {
            global.log.error(_SN + 'Unable to read Server-Status: ' + e)
            resolve({
              players: null,
              time: null
            })
          }
        }
      }
    )
  })
}
