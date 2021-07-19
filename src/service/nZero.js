const _SN = '[SERVICE][NZERO] -> '

function form(val) {
  if (val < 10) return '0' + val
  else return val
}

global.nZero = {
  form: form
}
