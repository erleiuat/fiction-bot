const _SN = '[SERVICE][NZERO] -> '

function form(val) {
  return ('0' + val).slice(-2)
}

global.nZero = {
  form: form
}
