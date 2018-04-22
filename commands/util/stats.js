const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = class StatsCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'botstats',
      group: 'util',
      memberName: 'stats',
      description: 'View the stats of the bot',
      examples: ['stats'],
      aliases: ['bot-stats']
    })
  }
  async run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    message.reply('', new MessageEmbed().setTitle('FEH Bot Stats').addField('Server Count', this.client.guilds.size).addField('Player Count', Object.keys(database.users).length).addField('Upvote Count', await this.client.dbl.getBot(this.client.user.id).points))
  }
}
