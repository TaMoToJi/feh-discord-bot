const { RichEmbed } = require('discord.js')
const { Command } = require('discord.js-commando')
const { heroes } = require('fire-emblem-heroes-stats').default
const fs = require('fs')

module.exports = class SummonCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'summon',
      group: 'heroes',
      memberName: 'summon',
      description: 'Summons a hero using orbs.',
      examples: ['summon'],
      aliases: ['summonhero']
    })
  }

  async run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    const emotes = ['🇦', '🇧', '🇨', '🇩', '🇪']
    const colors = ['Red', 'Green', 'Blue', 'Colorless']
    var availableColors = []
    var embed = new RichEmbed()
      .setTitle('Summoning')
      .setDescription('React with the letter of the hero you want to summon')
    async function performSummon (available, msg) {
      if (database.users[message.author.id].balance < 5) {
        message.reply("You don't have enough orbs to summon a hero!")
        return null
      }
      const reactions = await msg.awaitReactions(
        (reaction, user) => user.id === message.author.id,
        {
          max: 1,
          time: 30e3
        }
      )
      if (reactions.first() == null || reactions.first().emoji.name === '🚫') {
        return null
      } else if (
        available.indexOf(emotes.indexOf(reactions.first().emoji.name)) === -1
      ) {
        message
          .reply('That is not a valid selection!')
          .then(m => setTimeout(() => m.delete(), 5e3))
        return performSummon(available, msg)
      } else {
        return emotes.indexOf(reactions.first().emoji.name)
      }
    }
    for (let i = 0; i < 5; i++) {
      let color = colors[Math.floor(Math.random() * 4)]
      embed.addField(`${emotes[i]}: ${color}`, '???', true)
      availableColors.push(color)
    }
    const msg = await message.reply('', { embed })
    for (let i = 0; i < emotes.length; i++) {
      await msg.react(emotes[i])
    }
    msg.react('🚫')
    var summoning = true
    var available = [0, 1, 2, 3, 4]
    while (summoning !== null) {
      summoning = await performSummon(available, msg)
      if (summoning === null) break
      let heroList = heroes.filter(e =>
        e.weaponType.startsWith(availableColors[summoning])
      )
      let hero = heroList[Math.floor(Math.random() * heroList.length)]
      embed.fields[summoning].value = `${hero.name.replace(/ \(.*\)/, '')}: ${
        hero.title
      }`
      available[available.indexOf(summoning)] = undefined
      msg.edit(message.author, embed)
      if (available.length === 0) break
    }
    message.reply('Summoning session ended.')
  }
}