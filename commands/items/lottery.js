const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class AddBalanceCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'lottery',
      group: 'items',
      memberName: 'lottery',
      description: 'Participates in the orb lottery for 1 orb',
      details: 'You have a 0.1% chance to win 500 orbs, a 0.2% chance to win 100 orbs, a 1% chance to win 20 orbs, a 5% chance to win 5 orbs, and a 10% chance to win 1 orb',
      examples: ['lottery'],
      aliases: ['orblottery', 'orb-lottery']
    })
  }
  run (message) {
    const rates = [0.001, 0.003, 0.013, 0.033, 0.133]
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${
          this.client.user.tag
        } start\`.`
      )
    } else if (database.users[message.author.id].balance < 1) {
      return message.reply('You need at least one orb to participate!')
    } else {
      const rand = Math.random()
      let win
      if (rand < rates[0]) {
        win = 500
      } else if (rand < rates[1]) {
        win = 100
      } else if (rand < rates[2]) {
        win = 20
      } else if (rand < rates[3]) {
        win = 5
      } else if (rand < rates[4]) {
        win = 1
      } else {
        win = 0
      }
      database.users[message.author.id].balance += win - 1
      fs.writeFile('data.json', JSON.stringify(database), err => {
        if (err) throw err
      })
      return message.reply(`You won ${win} orb(s).`)
    }
  }
}
