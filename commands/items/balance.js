const { Command } = require('discord.js-commando')

module.exports = class BalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'balance',
      group: 'items',
      memberName: 'balance',
      description: 'Shows your balance of orbs',
      examples: ['balance'],
      aliases: ['bal', 'orbs']
    })
  }
  run (message) {
    return message.say("oof i didn't make that yet")
  }
}
