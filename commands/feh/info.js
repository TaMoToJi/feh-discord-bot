const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')
const { heroes } = require('fire-emblem-heroes-stats').default

module.exports = class InfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      group: 'feh',
      memberName: 'info',
      description: 'Shows info about a certain hero',
      examples: ['info Ike'],
      aliases: ['lookup', 'stats'],
      args: [
        {
          key: 'hero',
          type: 'string',
          prompt: 'What hero?'
        }
      ],
      argsType: 'single'
    })
  }

  run (message, args) {
    let hero = heroes.find(
      element => element.name.toLowerCase() === args.hero.toLowerCase()
    )
    if (!hero) message.reply(`Could not find the hero "${args.hero}"`)
    else {
      message.reply('', {
        embed: new RichEmbed()
          .setThumbnail(hero.assets.portrait['113px'])
          .setTitle(`Hero Info: ${hero.name}`)
          .addField('Rarities', hero.rarities)
      })
    }
  }
}
