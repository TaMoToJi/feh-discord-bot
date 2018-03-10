const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class BalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'balance',
      group: 'items',
      memberName: 'balance',
      description: 'Shows your balance of orbs',
      examples: ['balance', 'balance MegaNoob123'],
      aliases: ['bal', 'orbs'],
      args: [
        {
          key: 'user',
          type: 'user',
          default: true,
          prompt: 'What user?'
        }
      ]
    })
  }
  run (message, args) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (
      !database.users[args.user === true ? message.author.id : args.user.id]
    ) {
      return message.reply(
        `${
          args.user === true || args.user.id === message.author.id
            ? 'You'
            : args.user.username
        } didn't start the game! ${
          args.user === true || args.user.id === message.author.id
            ? 'Try'
            : 'They need to type'
        } \`@${this.client.user.tag} start\`.`
      )
    } else {
      return message.reply(
        `${
          args.user === true || args.user.id === message.author.id
            ? 'You have'
            : `${args.user.username} has`
        } a balance of ${
          database.users[args.user === true ? message.author.id : args.user.id]
            .balance
        } orbs`
      )
    }
  }
}
