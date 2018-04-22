const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AddBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'release',
      group: 'heroes',
      memberName: 'sendhome',
      description: 'Sends a hero home',
      details: 'Gives 2 orbs for 5 stars, 1 orb for anything else',
      examples: ['release 23'],
      aliases: ['release'],
      args: [
        {
          key: 'number',
          type: 'invnumber',
          prompt: 'What hero would you like to send home?'
        }
      ]
    })
  }
  run (message, args) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${this.client.user.tag} start\`.`
      )
    } else {
      let hero = database.users[message.author.id].heroes[args.number - 1]
      database.users[message.author.id].balance += hero.rarity > 4 ? 2 : 1
      delete database.users[message.author.id].heroes[args.number - 1]
      database.users[message.author.id].heroes = database.users[
        message.author.id
      ].heroes.filter(e => e !== null)
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      message.reply(`Released your ${hero.rarity}\u2605 ${hero.name}: ${hero.title}`)
    }
  }
}
