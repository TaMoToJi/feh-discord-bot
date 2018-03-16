const { Command } = require('discord.js-commando')
const config = require('../../config')

module.exports = class ServerCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'server',
      group: 'misc',
      memberName: 'server',
      description: 'Shows the official bot server',
      examples: ['server']
    })
  }
  run (message, args) {
    message.reply(config.invite)
  }
}
