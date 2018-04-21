const { Command } = require('discord.js-commando')
const fs = require('fs')
var awaitConfirm = []
var lastResets = {}

module.exports = class ResetCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'reset',
      group: 'game',
      memberName: 'reset',
      description: 'Resets the game',
      examples: ['reset'],
      aliases: ['resetgame'],
      throttling: {
        usages: 2,
        duration: 60 * 60 * 2
      }
    })
  }
  run (message) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${this.client.user.tag} start\`.`
      )
    } else if ((new Date() - (lastResets[message.author.id] || new Date(0))) < 1000 * 60 * 60 * 2) {
      let time = new Date(new Date() - lastResets[message.author.id])
      return message.reply(`You can only reset once every 2 hours. Try again in ${-time.getUTCHours() + 1} hours, ${-time.getUTCMinutes() + 59} minutes, and ${-time.getUTCSeconds() + 59} seconds`)
    } else {
      if (!awaitConfirm[message.author.id]) {
        awaitConfirm[message.author.id] = true
        setTimeout(() => {
          awaitConfirm[message.author.id] = false
        }, 30e3)
        return message.reply(
          'Are you sure? Type this command again to confirm (this times out in 30 seconds)'
        )
      } else {
        database.users[message.author.id] = void 0
        fs.writeFile('data.json', JSON.stringify(database), err => {
          if (err) throw err
        })
        lastResets[message.author.id] = new Date()
        awaitConfirm[message.author.id] = false
        return message.channel.send(
          `Successfully reset the game for ${message.author}.`
        )
      }
    }
  }
}
