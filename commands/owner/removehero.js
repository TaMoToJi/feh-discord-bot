const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AddBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'removehero',
      group: 'owner',
      memberName: 'removehero',
      description: "Removes a hero from a user's inventory",
      examples: ['removehero SadNoob 22'],
      aliases: ['removeunit', 'remove-unit', 'remove-hero'],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'What user would you like to remove a hero from?'
        },
        {
          key: 'hero',
          type: 'integer',
          prompt: 'What hero would you like to remove?',
          min: 1
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
      delete database.users[args.user.id].heroes[args.hero - 1]
      database.users[args.user.id].heroes = database.users[args.user.id].heroes.filter(
        e => e !== null
      )
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.channel.send(
        `Successfully removed a hero from ${args.user}`
      )
    }
  }
}
