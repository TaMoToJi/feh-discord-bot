const { Command } = require('discord.js-commando')

module.exports = class YouSuckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'invite',
      group: 'misc',
      memberName: 'invite',
      description: 'Invite the bot to your invite!',
      examples: ['invite']
    })
  }
  run (message) {
    message.reply('https://discordapp.com/api/oauth2/authorize?client_id=436295083244126208&permissions=35904&scope=bot')
  }
}
