const _SN = '[MODULE][GAMEBOT][MESSAGES] -> '
const fetch = require('node-fetch')
const botMsgs = require('./_messages/')

exports.translate = async function translate(text, target = 'DE', source = false) {
  let requestOptions = {
    method: 'POST',
    redirect: 'follow'
  }

  let resp = await fetch(
    encodeURI(
      'https://api-free.deepl.com/v2/translate?auth_key=' +
        process.env.DEEPL_TOKEN +
        '&text=' +
        text +
        '&target_lang=' +
        target +
        (source ? '&source_lang=' + source : '')
    ),
    requestOptions
  )
    .then(response => response.json())
    .then(result => {
      return result.translations[0].text
    })
    .catch(error => {
      global.log.error(_SN + 'Failed to translate with deepl: ' + error)
    })

  return resp
}

function txtReplace(text, replacements) {
  for (const key in replacements) {
    text = text.replace(key, replacements[key])
  }
  return text
}

exports.get = async function get(key, lang = false, replacements = false) {
  if (!lang) lang = 'en'

  if (botMsgs[lang] && botMsgs[lang][key]) {
    let txt = botMsgs[lang][key]
    if (replacements) txt = txtReplace(txt, replacements)
    return txt
  }

  if (botMsgs['en'][key] && lang != 'en') {
    let prefix = ''
    let txt = botMsgs['en'][key]

    if (replacements) txt = txtReplace(txt, replacements)

    if (txt.includes('・')) {
      prefix = txt.split('・')[0] + ' ・ '
      txt = txt.split('・')[1]
    }

    try {
      txt = await this.translate(txt, lang.toUpperCase())
    } catch (error) {
      global.log.error(_SN + 'Unable to translate: ' + error)
    }

    txt = prefix + txt
    return txt
  }
}
