const { Command } = require('discord.js-commando')
const { webhook: config } = require('../../config')
const { WebhookClient, RichEmbed } = require('discord.js')

module.exports = class RestartCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'restart',
      group: 'util',
      memberName: 'restart',
      description: 'Restarts the bot',
      examples: ['restart'],
      aliases: ['restartbot', 'restart-bot'],
      ownerOnly: true
    })
  }

  run (message) {
    message.reply('Exiting process with exit code 0')
    const hook = new WebhookClient(config.id, config.token)
    hook
      .send(
        new RichEmbed()
          .setTitle('Process exited')
          .setDescription(
            `${message.author} used the \`!fe restart\` command in ${
              message.channel
            }`
          )
          .setColor('RED')
      )
      .then(() => process.exit())
  }
}
