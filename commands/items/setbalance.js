const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class SetBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'setbalance',
      group: 'items',
      memberName: 'setbalance',
      description: "Adds orbs to a user's balance",
      examples: ['setbalance ev3commander 3', 'setbalance MegaNoob123 123'],
      aliases: ['setbal', 'set-balance', 'set-bal', 'setorbs', 'set-orbs'],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'Whose balance do you want to set?'
        },
        {
          key: 'amount',
          type: 'integer',
          prompt: 'How many orbs do you want them to have?'
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
      database.users[args.user.id].balance = args.amount
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.channel.send(
        `Successfully set ${args.user}'s orbs to ${args.amount}  `
      )
    }
  }
}
