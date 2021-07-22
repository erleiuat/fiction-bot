module.exports = class Mine {
  key = null
  locationKey = null

  created = null
  owner = null
  type = null
  active = false
  events = {}
  image = null

  location = {
    x: null,
    y: null,
    z: null
  }

  constructor(mProps, timestamp, image) {
    this.key = mProps.key
    this.locationKey = mProps.locationKey

    this.created = timestamp
    this.owner = mProps.owner
    this.type = mProps.type
    this.image = image

    this.location.x = mProps.location.x
    this.location.y = mProps.location.y
    this.location.z = mProps.location.z
  }

  handleEvent(mProps, user, timestamp) {
    let key = timestamp + '_' + mProps.action
    if (this.events[key]) return false

    let event = {
      timestamp: timestamp,
      action: mProps.action,
      causer: {
        steamID: user.steamID,
        char: {
          id: user.char.id,
          name: user.char.name
        }
      }
    }

    if (this.type.toLowerCase().includes('barbed')) {
      if (event.action == 'crafted') this.active = true
    } else {
      if (event.action == 'armed') this.active = true
      else if (event.action == 'disarmed' || event.action == 'triggered') this.active = false
    }

    this.events[key] = event
    return true
  }
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
