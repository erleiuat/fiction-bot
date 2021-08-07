const fs = require('fs')

module.exports = class Lottery {
  #_SN = '[SERVICE][LOTTERY] -> '
  #run = true

  tickets = {}
  winnings = {}

  constructor() {
    if (!fs.existsSync('./data/lottery/')) fs.mkdirSync('./data/lottery/', { recursive: true })
    this.loadCached()
  }

  makeid(steamID, length = 12) {
    var result = ''
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length - 4; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    return steamID.slice(0, 4) + result
  }

  draw() {
    let ticketAmount = Object.keys(this.tickets).length
    let keys = Object.keys(this.tickets)
    let winner = keys[(keys.length * Math.random()) << 0]
    let amount = Math.round(ticketAmount * 10 * 0.9)

    if (!this.winnings[this.tickets[winner].steamID])
      this.winnings[this.tickets[winner].steamID] = 0
    this.winnings[this.tickets[winner].steamID] += amount

    this.saveChanges()

    return {
      ticket: winner,
      steamID: this.tickets[winner].steamID,
      charName: this.tickets[winner].charName,
      ticketAmount: ticketAmount,
      amount: amount
    }
  }

  cleanUp() {
    this.tickets = {}
    this.saveChanges()
  }

  getInfo() {
    let ticketAmount = Object.keys(this.tickets).length
    let amount = Math.round(ticketAmount * 10 * 0.9)

    return {
      ticketAmount: ticketAmount,
      amount: amount
    }
  }

  getWinnings(steamID) {
    if (!this.winnings[steamID]) return 0
    else return this.winnings[steamID]
  }

  clearWinnings(steamID) {
    this.winnings[steamID] = 0
    this.saveChanges()
  }

  newTicket(steamID, charName) {
    let ticketID = this.makeid(steamID)
    this.tickets[ticketID] = {
      steamID: steamID,
      charName: charName
    }
    this.saveChanges()
    return ticketID
  }

  saveChanges() {
    this.#run = false
    fs.writeFileSync('./data/lottery/tickets.json', JSON.stringify(this.tickets))
    fs.writeFileSync('./data/lottery/winnings.json', JSON.stringify(this.winnings))
    this.#run = true
  }

  loadCached() {
    this.#run = false

    if (fs.existsSync('./data/lottery/tickets.json'))
      this.tickets = JSON.parse(fs.readFileSync('./data/lottery/tickets.json'))
    if (fs.existsSync('./data/lottery/winnings.json'))
      this.winnings = JSON.parse(fs.readFileSync('./data/lottery/winnings.json'))

    this.#run = true
  }
}
