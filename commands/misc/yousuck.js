const { Command } = require('discord.js-commando')

module.exports = class YouSuckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'yousuck',
      group: 'misc',
      memberName: 'yousuck',
      description: 'Give the bot creators some feedback',
      examples: ['yousuck'],
      aliases: ['usuk', 'usuck', 'yousuk', 'u-suk', 'u-suck', 'you-suck']
    })
  }
  run (message) {
    message.reply('no u')
  }
}
