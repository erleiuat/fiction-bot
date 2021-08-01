async function execScript(scriptName) {
  try {
    global.log.info(_SN + 'EXECSCRIPT: Waiting 5 seconds before executing')
    await global.time.sleep(5)
    global.log.info(_SN + 'EXECSCRIPT: EXECUTING')
    if (global.args.includes('test')) return
    let child = cp.spawn('cmd.exe', ['/c', scriptName], { detached: true })
    child.on('data', data => console.log(data))
    child.on('error', error => console.log(error))
    child.on('close', code => console.log(code))
  } catch (error) {
    console.log(error)
  }
}

global.sysControl = {
  reboot: reboot,
  reload: reload,
  restart: restart
}

async function reboot() {
  execScript('.\\src\\scripts\\reboot.bat')
}

async function reload() {
  execScript('.\\src\\scripts\\reload.bat')
}

async function restart() {
  execScript('.\\src\\scripts\\restart.bat')
}
