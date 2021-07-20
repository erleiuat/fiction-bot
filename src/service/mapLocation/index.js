const fs = require('fs')
const Jimp = require('jimp')
const imgs = {}

function getImgPoint(mapPoint, imgDistance = '5000') {
  return (mapPoint - 620000) / (-1524000 / imgDistance)
}

function imageProps(cX, cY, dimensions, bW, bH) {
  let pX = cX - dimensions[0] / 2
  let pY = cY - dimensions[1] / 2
  if (pX < 0) pX = 0
  if (pY < 0) pY = 0
  if (pX + dimensions[0] > bW) pX = bW - dimensions[0]
  if (pY + dimensions[1] > bH) pY = bH - dimensions[1]
  return [pX, pY, dimensions[0], dimensions[1]]
}

function init(base) {
  if (!imgs['map'] || imgs['base'] != base)
    Jimp.read(base).then(img => {
      imgs['map'] = {
        file: img,
        width: img.getWidth(),
        height: img.getHeight()
      }
    })
  if (!imgs['marker'] || imgs['base'] != base)
    Jimp.read('./src/service/mapLocation/marker.png').then(img => {
      imgs['marker'] = {
        file: img,
        width: img.getWidth(),
        height: img.getHeight()
      }
    })
  imgs['base'] = base
}

exports.generateMulti = function generateFull(
  xys,
  name,
  path = './data/tmp/mapLocation/',
  base = './src/service/mapLocation/map.png'
) {
  init(base)

  map = imgs['map'].file.clone()
  marker = imgs['marker'].file.clone()

  for (const el of xys) {
    cX = getImgPoint(el[0], imgs['map'].width)
    cY = getImgPoint(el[1], imgs['map'].height)
    map.composite(marker, cX - imgs['marker'].width / 2, cY - imgs['marker'].height + 20)
  }

  if (!fs.existsSync(path)) fs.mkdirSync(path)
  map.write(path + name)
  return {
    path: path,
    name: name
  }
}

exports.generate = function generate(
  x,
  y,
  name,
  path = './data/tmp/mapLocation/',
  base = './src/service/mapLocation/map.png',
  imgDimensions = [400, 400]
) {
  init(base)

  map = imgs['map'].file.clone()
  marker = imgs['marker'].file.clone()
  cX = getImgPoint(x, imgs['map'].width)
  cY = getImgPoint(y, imgs['map'].height)
  map.composite(marker, cX - imgs['marker'].width / 2, cY - imgs['marker'].height + 20)
  cProp = imageProps(cX, cY, imgDimensions, imgs['map'].width, imgs['map'].height)
  map.crop(cProp[0], cProp[1], cProp[2], cProp[3])
  if (!fs.existsSync(path)) fs.mkdirSync(path)
  map.write(path + name)
  return {
    path: path,
    name: name
  }
}

init('./src/service/mapLocation/map.png')
