const _SN = '[MODULE][LOGHANDLER] -> '

const ftp_pp = new (require('basic-ftp').Client)()
const iconv = require('iconv-lite')
const handle = require('./handle')
const fs = require('fs')
let run = false

exports.start = async function start() {
  run = true
  global.log.info(_SN + 'Started')
}

exports.pause = async function pause() {
  run = false
  global.log.info(_SN + 'Paused')
}

async function go() {
  while (!run) await global.time.sleep(0.0005)
}

async function writeCache(cache) {
  fs.writeFileSync('./data/tmp/logHandler/_cache.json', JSON.stringify(cache))
}

async function deleteFile(file) {
  fs.unlinkSync('./data/tmp/logHandler/' + file)
}

async function getFileContent(file) {
  await ftp_pp.downloadTo('./data/tmp/logHandler/' + file, file)
  let content = fs.readFileSync('./data/tmp/logHandler/' + file)
  deleteFile(file)
  return iconv.decode(new Buffer.from(content), 'utf16le')
}

async function getFileList() {
  let fileList = {}
  await (
    await ftp_pp.list()
  ).map(file => {
    fileList[file.name] = {
      size: file.size,
      type: file.name.split('_')[0],
      content: null
    }
    return
  })
  return fileList
}

async function logHandler() {
  try {
    await ftp_pp.access({
      host: process.env.FTP_HOST_PP,
      port: process.env.FTP_PORT_PP,
      user: process.env.FTP_USER_PP,
      password: process.env.FTP_PASSWORD_PP,
      secure: process.env.FTP_SECURE_PP
    })
    await ftp_pp.ensureDir(process.env.FTP_ROOT_PP)
  } catch (error) {
    throw new Error(_SN + error)
  }

  let cache = {}
  let types = {
    admin: '',
    chat: '',
    kill: '',
    login: '',
    mines: '',
    violations: ''
  }

  if (!fs.existsSync('./data/tmp/logHandler/'))
    fs.mkdirSync('./data/tmp/logHandler/', { recursive: true })

  if (!fs.existsSync('./data/scumLogs/')) fs.mkdirSync('./data/scumLogs/', { recursive: true })

  if (fs.existsSync('./data/tmp/logHandler/_cache.json')) {
    cache = JSON.parse(fs.readFileSync('./data/tmp/logHandler/_cache.json'))
  } else {
    cache = await getFileList()
    global.log.info(_SN + 'Downloading current logfiles')
    for (const file in cache) {
      global.log.debug(_SN + 'Downloading: ' + file)
      cache[file].content = await getFileContent(file)
    }
    global.log.info(_SN + 'Logfiles downloaded')
  }

  let i = 0
  do {
    i++
    await go()
    global.log.debug(_SN + 'RUN: ' + i)
    if (i % 10 == 0) global.log.info(_SN + 'Checking for new updates (#' + i + ')')

    let updates = { ...types }
    let fileList = await getFileList()

    for (const file in fileList) {
      if (global.args.includes('authOnly') && fileList[file].type != 'login') continue
      if (global.args.includes('mineOnly') && fileList[file].type != 'mines') continue
      if (global.args.includes('killOnly') && fileList[file].type != 'kill') continue
      if (!cache[file]) {
        global.log.debug(_SN + 'Downloading: ' + file)
        fileList[file].content = await getFileContent(file)
        updates[fileList[file].type] += fileList[file].content
        cache[file] = { ...fileList[file] }
        continue
      }

      if (cache[file].size < fileList[file].size) {
        fileList[file].content = await getFileContent(file)
        updates[fileList[file].type] += fileList[file].content.replace(cache[file].content, '')
        cache[file] = { ...fileList[file] }
        continue
      }
    }

    if (i % 10 == 0) writeCache(cache)
    handle.updates(updates)
  } while (true)
}

logHandler()
global.log.info(_SN + 'READY')
