const { Command } = require('discord.js-commando')

module.exports = class YouSuckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'twitter',
      group: 'misc',
      memberName: 'twitter',
      description: 'Check out our twitter!',
      examples: ['twitter']
    })
  }
  run (message) {
    message.reply('https://twitter.com/FEHBotTeam')
  }
}
