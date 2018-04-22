const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = class YouSuckCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'vote',
      group: 'misc',
      memberName: 'vote',
      description: 'Upvote the bot on discordbots.org!',
      aliases: ['votereward', 'voterewards', 'vote-reward', 'vote-rewards', 'upvote', 'upvotereward', 'upvoterewards', 'upvote-reward', 'upvote-rewards'],
      examples: ['vote']
    })
  }
  run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    message.channel.send(database.users[message.author.id] ? '' : `Warning: you have not yet started the game. If you want to claim your 3 orbs, do \`@${this.client.user.tag} start\` before voting.`, new MessageEmbed().setTitle('Vote to recieve three free orbs!').setDescription('[Vote](https://discordbots.org/bot/436295083244126208/vote)'))
  }
}
