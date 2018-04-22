const { ArgumentType } = require('discord.js-commando')
const fs = require('fs')

module.exports = class HeroArgumentType extends ArgumentType {
  constructor (client) {
    super(client, 'invnumber')
  }

  validate (value, { author }) {
    var database = JSON.parse(fs.readFileSync('data.json', { encoding: 'utf-8' }))
    if (value <= 0) return 'Please enter a number greater than zero'
    else if (database.users[author.id].heroes.length < value) return 'You do not have this many heroes!'
    else return true 
  }

  parse (value) {
    return Number(value)
  }
}
