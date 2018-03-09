const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class BalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'balance',
      group: 'items',
      memberName: 'balance',
      description: 'Shows your balance of orbs',
      examples: ['balance'],
      aliases: ['bal', 'orbs']
    })
  }
  run (message) {
    var database = JSON.parse(fs.readFileSync('data.json', { encoding: 'utf-8' }))
    if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${this.client.user.tag} start\`.`
      )
    } else {
      return message.reply(
        `You have a balance of ${database.users[message.author.id].balance}`
      )
    }
  }
}
