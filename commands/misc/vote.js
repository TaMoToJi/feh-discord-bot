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
      aliases: [
        'votereward',
        'voterewards',
        'vote-reward',
        'vote-rewards',
        'upvote',
        'upvotereward',
        'upvoterewards',
        'upvote-reward',
        'upvote-rewards'
      ],
      examples: ['vote']
    })
  }
  async run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (
      database.users[message.author.id] &&
      new Date() -
        (new Date(database.users[message.author.id].voted || new Date(0))) >
        1000 * 60 * 60 * 24 &&
      (await this.client.dbl.hasVoted(message.author.id))
    ) {
      database.users[message.author.id].balance += 3
      database.users[message.author.id].voted = new Date()
      fs.writeFileSync('data.json', JSON.stringify(database))
      return message.reply('Claimed 3 orbs.')
    } else if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${this.client.user.tag} start\`.`
      )
    } else if (await this.client.dbl.hasVoted(message.author.id)) {
      return message.reply('You already claimed within the last 24 hours!')
    }
    database.users[message.author.id].voted = new Date(0)
    fs.writeFileSync('data.json', JSON.stringify(database))
    message.channel.send(
      new MessageEmbed()
        .setTitle('Vote to recieve three free orbs!')
        .setDescription(
          '[Click here to vote.](https://discordbots.org/bot/436295083244126208/vote) Then use this command again to claim your orbs.'
        )
        .setFooter('It may take a few minutes for your vote to process')
    )
  }
}
