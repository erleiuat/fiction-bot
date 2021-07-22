const _SN = '[MODULE][STATISTICS][MINESACTIVE] -> '

exports.format = function format(list) {
  let tmpMsgs = []

  for (const item of list) {
    if (item.type == 'Barbed Spike Trap' || item.type == 'C4 Bomb' || item.type == 'Silent Alarm')
      continue
    //TODO
    let msg = null
    tmpMsgs.push(msg)
  }
}
