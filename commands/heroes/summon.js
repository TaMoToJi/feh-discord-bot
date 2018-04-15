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
    const costs = [0, 4, 4, 4, 3]
    var availableColors = []
    var embed = new RichEmbed()
      .setTitle('Summoning')
      .setDescription('React with the letter of the hero you want to summon')
    async function performSummon (available, msg) {
      const count = available.filter(e => e === undefined).length
      if (database.users[message.author.id].balance < costs[count]) {
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
        database = JSON.parse(fs.readFileSync('data.json', { encoding: 'utf-8' }))
        database.users[message.author.id].balance -= costs[count]
        fs.writeFile('data.json', JSON.stringify(database), err => {
          if (err) throw err
        })
        if (costs[count] !== 3) {
          embed.fields[5].value = `${costs[count + 1]} orbs`
        } else {
          embed.fields[5].value = 'N/A'
        }
        return emotes.indexOf(reactions.first().emoji.name)
      }
    }
    for (let i = 0; i < 5; i++) {
      let color = colors[Math.floor(Math.random() * 4)]
      embed.addField(`${emotes[i]}: ${color}`, '???', true)
      availableColors.push(color)
    }
    embed.addField('Cost', '5 orbs')
    const msg = await message.channel.send(embed)
    ;(async () => {
      for (let i = 0; i < emotes.length; i++) {
        await msg.react(emotes[i])
      }
      msg.react('🚫')
    })()
    var summoning = true
    var available = [0, 1, 2, 3, 4]
    if (database.users[message.author.id].balance < 5) {
      message.reply("You don't have enough orbs to summon a hero!")
      summoning = null
    } else { 
      database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' }))
      database.users[message.author.id].balance -= 5
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
    }
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
      msg.edit(embed)
      if (available.filter(e => e === undefined).length === 5) break
    }
    message.reply('Summoning session ended.')
  }
}
