const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class ResetBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'resetbalance',
      group: 'items',
      memberName: 'resetbalance',
      description: "Resets a user's balance",
      examples: ['resetbalance ev3commander', 'resetbalance MegaNoob123'],
      aliases: [
        'resetbal',
        'reset-balance',
        'reset-bal',
        'resetorbs',
        'reset-orbs',
        'clearbal',
        'clear-balance',
        'clearbalance',
        'clear-bal',
        'clearorbs',
        'clear-orbs'
      ],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'Whose orbs do you want to reset?'
        }
      ],
      ownerOnly: true
    })
  }
  run (message, args) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[args.user.id]) {
      return message.reply(
        `That user didn't start the game! They need to type \`@${
          this.client.user.tag
        } start\`.`
      )
    } else {
      let orbs = database.users[args.user.id].balance
      database.users[args.user.id].balance = 20
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.channel.send(
        `Successfully reset ${args.user}'s balance of ${orbs} orbs.`
      )
    }
  }
}
