const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AddBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'daily',
      group: 'items',
      memberName: 'daily',
      description: 'Claims daily orbs',
      examples: ['daily'],
      aliases: ['dailyorbs', 'daily-orbs']
    })
  }
  run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${
          this.client.user.tag
        } start\`.`
      )
    } else if ((new Date() - (new Date(database.users[message.author.id].lastDaily) || new Date(0))) < 1000 * 60 * 60 * 24) {
      let time = new Date(new Date() - new Date(database.users[message.author.id].lastDaily))
      return message.reply(`You can only claim once every 24 hours. Try again in ${-time.getUTCHours() + 23} hours, ${-time.getUTCMinutes() + 59} minutes, and ${-time.getUTCSeconds() + 59} seconds`)
    } else {
      database.users[message.author.id].balance += 3
      database.users[message.author.id].lastDaily = new Date()
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.reply(
        'Claimed 3 orbs. You can claim again in 24 hours.'
      )
    }
  }
}
