const { Command } = require('discord.js-commando')
const fs = require('fs')

module.exports = class ResetCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'forcereset',
      group: 'game',
      memberName: 'forcereset',
      description: 'Force resets someone\'s game',
      examples: ['forcereset @SadNoob'],
      aliases: ['forceresetgame', 'force-resetgame', 'forcereset-game', 'force-reset-game', 'force-reset'],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'What user\'s game would you like to reset?'
        }
      ]
    })
  }
  run (message, { user }) {
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[user.id]) {
      return message.reply(
        `That user didn't start the game! They need to type \`@${this.client.user.tag} start\`.`
      )
    }
    database.users[user.id] = void 0
    fs.writeFile('data.json', JSON.stringify(database), err => {
      if (err) throw err
    })
    return message.channel.send(
      `Successfully reset the game for ${user}.`
    )
  }
}
