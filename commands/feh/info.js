const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js')

module.exports = class InfoCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'info',
      group: 'feh',
      memberName: 'info',
      description: 'Shows info about a certain hero',
      examples: ['info Ike: Vanguard Legend'],
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
    var hero = args.hero
    var embed = new RichEmbed()
    embed
      .setThumbnail(encodeURI(hero.assets.portrait['113px']))
      .setTitle(`Hero Info: ${hero.shortName || hero.name}`)
      .addField('Title', hero.title, true)
      .addField('Rarities', hero.rarities, true)
      .addField('Move Type', hero.moveType, true)
      .addField('Weapon Type', hero.weaponType, true)
      .setFooter(
        'Level 1 stats do not take variance into account; level 40 stats do.'
      )
    for (let stars in hero.stats[1]) {
      let stats = hero.stats[1][stars]
      embed.addField(
        `Level 1 / ${stars}\u2605`,
        `HP: ${stats.hp}, Atk: ${stats.atk}, Spd: ${stats.spd}, Def: ${
          stats.def
        }, Res: ${stats.res}`
      )
    }
    for (let stars in hero.stats[40]) {
      let stats = hero.stats[40][stars]
      let displayStats = []
      for (let i = 0; i < 5; i++) {
        let stat = stats[['hp', 'atk', 'spd', 'def', 'res'][i]]
        for (let i = 0; i < 3; i++) {
          let statNo = stat[i]
          if (statNo === '-') stat.splice(i, 1)
        }
        displayStats.push(`${stat[0]}-${stat[stat.length - 1]}`)
      }
      embed.addField(
        `Level 40 / ${stars}\u2605`,
        `HP: ${displayStats[0]}, Atk: ${displayStats[1]}, Spd: ${
          displayStats[2]
        }, Def: ${displayStats[3]}, Res: ${displayStats[4]}`
      )
    }
    if (hero.weaponType.startsWith('Blue')) embed.setColor('BLUE')
    else if (hero.weaponType.startsWith('Red')) embed.setColor('RED')
    else if (hero.weaponType.startsWith('Green')) embed.setColor('GREEN')
    else embed.setColor('#ffffff')
    message.reply('', { embed })
  }
}
