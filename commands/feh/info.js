const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

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
          type: 'hero',
          prompt: 'What hero?'
        }
      ],
      argsType: 'single'
    })
  }

  run (message, args) {
    let hero = args.hero
    message.reply('', {
      embed: new RichEmbed()
        .setThumbnail(encodeURI(hero.assets.portrait['113px']))
        .setTitle(`Hero Info: ${hero.name}`)
        .addField('Rarities', hero.rarities)
    })
  }
}
