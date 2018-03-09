const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class StartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'start',
      group: 'game',
      memberName: 'start',
      description: 'Starts the game',
      examples: ['start'],
      aliases: ['begin', 'startgame']
    })
  }
  run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (database.users[message.author.id]) {
      return message.reply(
        `You already started the game! Try \`@${this.client.user.tag} reset\`.`
      )
    } else {
      database.users[message.author.id] = {
        balance: 20,
        heroes: [],
        inventory: []
      }
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.reply('Successfully started the game!')
    }
  }
}
