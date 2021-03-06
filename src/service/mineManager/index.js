const fs = require('fs')
const Mine = require('./mine')
const mapLocation = require('../../service/mapLocation/')

module.exports = class MineManager {
  #_SN = '[SERVICE][MINEMANAGER] -> '
  #run = true

  imagePath = './data/tmp/mapLocation/mine/'
  mines = {}

  constructor() {
    if (!fs.existsSync('./data/mineManager/'))
      fs.mkdirSync('./data/mineManager/', { recursive: true })
    this.loadCached()
    this.iterateSave()
  }

  getFullImagePath(mine) {
    return this.imagePath + mine.image
  }

  loadCached() {
    if (!fs.existsSync('./data/mineManager/mines.json')) {
      this.mines = {}
      return
    }

    this.#run = false

    let minesCache = JSON.parse(fs.readFileSync('./data/mineManager/mines.json'))
    for (const u in minesCache)
      this.mines[minesCache[u].key] = Object.assign(
        new Mine(minesCache[u], minesCache[u].created, minesCache[u].image),
        minesCache[u]
      )

    this.#run = true
  }

  async iterateSave() {
    do {
      while (!this.#run) await global.time.sleep(0.05)
      this.saveChanges()
      await global.time.sleep(60)
    } while (true)
  }

  saveChanges() {
    this.#run = false
    fs.writeFileSync('./data/mineManager/mines.json', JSON.stringify(this.mines))
    this.#run = true
  }

  locationToKey(loc) {
    let kX = Math.round(loc.x).toString().slice(0, -2)
    let kY = Math.round(loc.y).toString().slice(0, -2)
    let kZ = Math.round(loc.z).toString().slice(0, -1)
    if (loc.x >= 0) kX = kX.slice(0, -1)
    if (loc.y >= 0) kY = kY.slice(0, -1)
    if (loc.z >= 0) kZ = kZ.slice(0, -1)
    let key = '_x' + kX + 'y' + kY + 'z' + kZ + '_'
    return key
  }

  getActiveMines() {
    let list = []
    for (const m in this.mines) if (this.mines[m].active) list.push(this.mines[m])
    return list
  }

  getInactiveMines() {
    let list = []
    for (const m in this.mines) if (!this.mines[m].active) list.push(this.mines[m])
    return list
  }

  getMineByKey(key) {
    key = key.toString()
    let mine = this.mines[key]
    if (!mine) return false
    return this.mines[key]
  }

  findMineByLocation(loc, type) {
    let key = this.locationToKey(loc)
    if (type) type = type.split(' ')[0].trim()
    for (const m in this.mines) {
      if (this.mines[m].locationKey.trim() == key)
        if (type && this.mines[m].type.startsWith(type)) return this.mines[m]
        else if (!type) return this.mines[m]
    }
    return false
  }

  findTriggeredMine(timestamp, user) {
    let after = timestamp - 5 * 1000
    let before = timestamp + 5 * 1000
    for (const m in this.mines) {
      if (this.mines[m].active == true) continue
      for (const e in this.mines[m].events) {
        let tmpEvent = this.mines[m].events[e]
        if (
          tmpEvent.action == 'triggered' &&
          tmpEvent.causer.steamID == user.steamID &&
          tmpEvent.timestamp > after &&
          tmpEvent.timestamp < before
        )
          return {
            event: this.mines[m].events[e],
            mine: this.mines[m]
          }
      }
    }
    return false
  }

  findMine(mProps) {
    let needActive = ['triggered', 'disarmed'].includes(mProps.action)
    let typeKey = mProps.type.split(' ')[0]

    for (const m in this.mines) {
      let tmpMine = this.mines[m]
      if (mProps.owner.steamID == tmpMine.owner.steamID) {
        if (tmpMine.locationKey.trim() == mProps.locationKey.trim()) {
          if (tmpMine.type.startsWith(typeKey)) {
            if (!needActive) return this.mines[m]
            else if (tmpMine.active) return this.mines[m]
          }
        }
      }
    }
    return false
  }

  createMine(mProps, createdTimestamp) {
    let key = mProps.key.toString()
    let image = createdTimestamp + '.' + mProps.owner.steamID + '.jpg'

    mapLocation.generate(mProps.location.x, mProps.location.y, image, this.imagePath)

    if (!this.mines[key]) this.mines[key] = new Mine(mProps, createdTimestamp, image)
    return this.mines[key]
  }

  /**
   *
   * Events:
   * triggered / armed / crafted / disarmed
   *
   * Mines (prop.type):
   *
   * |NAME|               \TRIGGERS\  \LETHAL\    |ACTIVE ON| |INACTIVE ON|
   * Barbed Spike Trap    MULTIPLE    NO          crafted     "destroying" (no log event)
   * Fireworks Trap       ONCE        NO          armed       disarmed / triggered
   * Silent Alarm         ONCE        NO          armed       disarmed / triggered
   * Flare trap           ONCE        NO          armed       disarmed / triggered
   * Stake Pit            ONCE        YES         armed       disarmed / triggered
   * Anti-personnel mine  ONCE        YES         armed       disarmed / triggered
   * Everything else      ONCE        YES         armed       disarmed / triggered
   *
   */
}
