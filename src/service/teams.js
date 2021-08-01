const fs = require('fs')

module.exports = class Teams {
  #_SN = '[SERVICE][TEAMS] -> '
  #run = true

  teams = {}
  server = null

  constructor(server) {
    this.server = server
    if (!fs.existsSync('./data/teams/')) fs.mkdirSync('./data/teams/', { recursive: true })
    this.loadCached()
  }

  saveChanges() {
    this.#run = false
    fs.writeFileSync('./data/teams/list.json', JSON.stringify(this.teams))
    this.#run = true
  }

  loadCached() {
    this.#run = false
    if (fs.existsSync('./data/teams/list.json'))
      this.teams = JSON.parse(fs.readFileSync('./data/teams/list.json'))
    this.#run = true
  }

  async create(teamName) {
    /*    
    this.server.roles
      .create({
        data: {
          name: 'TEAM ' + teamName,
          color: '#000fff'
        }
      })
      .then()
      .catch()
    */
    let newCat = await this.server.channels.create('🔹 TEAM ' + teamName, {
      type: 'category',
      position: 7
    })

    newCat.overwritePermissions(this.server.roles.fetch(process.env.DC_ROLE_DEF), {
      // Disallow Everyone to see, join, invite, or speak
      CREATE_INSTANT_INVITE: false,
      VIEW_CHANNEL: false,
      CONNECT: false,
      SPEAK: false
    })

    let newText = await this.server.channels.create('text', {
      type: 'text',
      parent: newCat
    })

    let newVoice = await this.server.channels.create('Voice', {
      type: 'voice',
      parent: newCat
    })
  }
}
