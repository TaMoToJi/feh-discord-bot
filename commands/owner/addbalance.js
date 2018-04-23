const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AddBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'addbalance',
      group: 'owner',
      memberName: 'addbalance',
      description: "Adds orbs to a user's balance",
      examples: ['addbalance ev3commander 700', 'addbalance MegaNoob123 -200'],
      aliases: ['addbal', 'add-balance', 'add-bal', 'addorbs', 'add-orbs'],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'What user would you like to add orbs to?'
        },
        {
          key: 'amount',
          type: 'integer',
          prompt: 'How many orbs would you like to add?'
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
      database.users[args.user.id].balance += args.amount
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.channel.send(
        `Successfully added ${args.amount} orbs to ${args.user}`
      )
    }
  }
}
