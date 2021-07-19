const _SN = '[SERVICE][TIME] -> '

function sleep(seconds) {
  //global.log.debug(_SN + 'Sleeping ' + seconds + ' seconds')
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000)
  })
}

global.time = {
  sleep: sleep
}
