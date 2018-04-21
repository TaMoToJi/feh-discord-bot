const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AddBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'addhero',
      group: 'heroes',
      memberName: 'addhero',
      description: "Adds a hero to a user's inventory",
      examples: ['addhero ev3commander 5 Fjorm'],
      aliases: ['addunit', 'add-unit', 'add-hero'],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'What user would you like to add a hero to?'
        },
        {
          key: 'stars',
          type: 'integer',
          prompt: 'How many stars should the hero have?'
        },
        {
          key: 'hero',
          type: 'hero',
          prompt: 'What hero would you like to add?'
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
      database.users[args.user.id].inventory.push({name: args.hero.name, title: args.hero.title, rarity: args.stars})
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.channel.send(
        `Successfully added ${args.amount} orbs to ${args.user}`
      )
    }
  }
}
