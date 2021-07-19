const _SN = '[SERVICE][WEAPONIMAGE] -> '

const fetch = require('node-fetch')
let weaponImages = null

exports.get = function get(weapon) {
  if (!weapon) return false
  if (weapon.includes('_C')) weapon = weapon.split('_C')[0].replace(/\s/g, '')
  if (weaponImages[weapon])
    return process.env.SETTING_DATA_URL + 'bot_data/weapon/' + weaponImages[weapon]
  else {
    global.log.error(_SN + 'Weapon image not found: ' + weapon)
    return false
  }
}

function loadWeapons() {
  let url = process.env.SETTING_DATA_URL + 'bot_data/weapon/_weaponlist.json'
  fetch(url, {
    method: 'Get'
  })
    .then(res => res.json())
    .then(json => {
      weaponImages = json
    })
}

loadWeapons()
