const { Command } = require('discord.js-commando')

module.exports = class YouSuckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'patreon',
      group: 'misc',
      memberName: 'patreon',
      description: 'Support the bot on Patreon!',
      examples: ['patreon']
    })
  }
  run (message) {
    message.reply('https://www.patreon.com/FEHbot')
  }
}
