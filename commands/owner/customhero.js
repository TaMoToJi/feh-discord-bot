const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class CustomHeroCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'customhero',
      group: 'owner',
      memberName: 'customhero',
      description: "Adds a custom hero to a user's inventory",
      examples: ['customhero Leif Meme Dank'],
      aliases: ['customunit', 'custom-unit', 'custom-hero'],
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
          key: 'name',
          type: 'string',
          prompt: 'What name should it have?'
        },
        {
          key: 'title',
          type: 'string',
          prompt: 'What title should it have?'
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
      database.users[args.user.id].heroes.push({name: args.name, title: args.title, rarity: args.stars})
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.channel.send(
        `Successfully added a hero to ${args.user}`
      )
    }
  }
}
