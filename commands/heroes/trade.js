const { Command } = require('discord.js-commando')
const { MessageCollector } = require('discord.js')
const fs = require('fs')
var currentTrades = {}

module.exports = class ResetCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'trade',
      group: 'heroes',
      memberName: 'trade',
      description: 'Trades units with another user',
      examples: ['trade ev3commander'],
      args: [
        {
          key: 'user',
          type: 'user',
          prompt: 'What user would you like to trade with?'
        }
      ],
      guildOnly: true
    })
  }
  async run (message, { user }) {
    function confirm (choices) {
      if (choices[0][1] === 'orbs') {
        database = JSON.parse(
          fs.readFileSync('data.json', { encoding: 'utf-8' })
        )
        database.users[user.id].balance += choices[0][0]
        database.users[message.author.id].balance -= choices[0][0]
        fs.writeFileSync('data.json', JSON.stringify(database))
      } else {
        database = JSON.parse(
          fs.readFileSync('data.json', { encoding: 'utf-8' })
        )
        database.users[user.id].heroes.push(
          database.users[message.author.id].heroes[choices[0][0] - 1]
        )
        delete database.users[message.author.id].heroes[choices[0][0] - 1]
        database.users[message.author.id].heroes = database.users[
          message.author.id
        ].heroes.filter(e => e !== null)
        fs.writeFileSync('data.json', JSON.stringify(database))
      }
      if (choices[1][1] === 'orbs') {
        database = JSON.parse(
          fs.readFileSync('data.json', { encoding: 'utf-8' })
        )
        database.users[message.author.id].balance += choices[1][0]
        database.users[user.id].balance -= choices[1][0]
        fs.writeFileSync('data.json', JSON.stringify(database))
      } else {
        database = JSON.parse(
          fs.readFileSync('data.json', { encoding: 'utf-8' })
        )
        database.users[message.author.id].heroes.push(
          database.users[user.id].heroes[choices[1][0] - 1]
        )
        delete database.users[user.id].heroes[choices[1][0] - 1]
        database.users[user.id].heroes = database.users[user.id].heroes.filter(
          e => e !== null
        )
        fs.writeFileSync('data.json', JSON.stringify(database))
      }
    }
    if (user.id === message.author.id) {
      return message.reply('Why trade with yourself? Get some friends 🅱oi')
    } else if (currentTrades[message.author.id] || currentTrades[user.id]) {
      return message.reply('One of you is already trading! (If you\'re not, wait around 20 seconds and try again)')
    }
    var database = JSON.parse(
      fs.readFileSync('data.json', { encoding: 'utf-8' })
    )
    if (!database.users[message.author.id]) {
      return message.reply(
        `You didn't start the game! Try \`@${this.client.user.tag} start\`.`
      )
    } else if (!database.users[user.id]) {
      return message.reply(
        `That user didn't start the game! They need to type \`@${
          this.client.user.tag
        } start\`.`
      )
    } else {
      const msg = await message.channel.send(
        `${user}! ${
          message.author.username
        } has invited you to trade! React with ✅ to accept or ❎ to deny. This times out in 30 seconds.`
      )
      ;(async () => {
        await msg.react('✅')
        await msg.react('❎')
      })()
      const reactions = await msg.awaitReactions(
        (reaction, usr) => usr.id === user.id,
        {
          max: 1,
          time: 30e3
        }
      )
      if (reactions.first() == null || reactions.first().emoji.name !== '✅') {
        return message.reply('Request declined')
      }
      currentTrades[user.id] = message.author.id
      currentTrades[message.author.id] = user.id
      const msg2 = await message.channel.send(
        'React with 🇦 to trade a unit, or 🇧 to trade orbs. This times out in 30 seconds.'
      )
      ;(async () => {
        await msg2.react('🇦')
        await msg2.react('🇧')
      })()
      let choices = []
      msg2
        .awaitReactions((reaction, usr) => usr.id === message.author.id, {
          max: 1,
          time: 30e3
        })
        .then(async reactions => {
          if (!reactions) return message.channel.send('Trade timed out')
          switch (reactions.first().emoji.name) {
            case '🇦':
              message.channel.send(
                'Please enter the number of the unit, found using the `inv` command. This times out in 30 seconds.'
              )
              const selectionA = new MessageCollector(
                message.channel,
                m =>
                  m.author.id === message.author.id &&
                  !isNaN(Number(m.content)),
                { time: 30e3, max: 1 }
              )
              selectionA.on('collect', m => {
                database = JSON.parse(
                  fs.readFileSync('data.json', { encoding: 'utf-8' })
                )
                if (
                  Number(m.content) < 1 ||
                  Number(m.content) >
                    database.users[message.author.id].heroes.length
                ) {
                  return m.reply(
                    'That is not a valid selection! Trade terminated.'
                  )
                }
                choices[0] = [Number(m.content), 'hero']
              })
              break
            case '🇧':
              message.channel.send(
                'Please enter the number of orbs. This times out in 30 seconds.'
              )
              const selectionB = new MessageCollector(
                message.channel,
                m =>
                  m.author.id === message.author.id &&
                  !isNaN(Number(m.content)),
                { time: 30e3, max: 1 }
              )
              selectionB.on('collect', m => {
                database = JSON.parse(
                  fs.readFileSync('data.json', { encoding: 'utf-8' })
                )
                if (
                  Number(m.content) < 1 ||
                  Number(m.content) > database.users[message.author.id].balance
                ) {
                  return m.reply(
                    'That is not a valid orb amount! Trade terminated.'
                  )
                }
                choices[0] = [Number(m.content), 'orbs']
              })
              break
            default:
              message.channel.send('Invalid reaction - ending trade')
          }
        })
      msg2
        .awaitReactions((reaction, usr) => usr.id === user.id, {
          max: 1,
          time: 30e3
        })
        .then(async reactions => {
          if (!reactions) return message.channel.send('Trade timed out')
          switch (reactions.first().emoji.name) {
            case '🇦':
              message.channel.send(
                'Please enter the number of the unit, found using the `inv` command. This times out in 30 seconds.'
              )
              const selectionA = new MessageCollector(
                message.channel,
                m => m.author.id === user.id && !isNaN(Number(m.content)),
                { time: 30e3, max: 1 }
              )
              selectionA.on('collect', m => {
                database = JSON.parse(
                  fs.readFileSync('data.json', { encoding: 'utf-8' })
                )
                if (
                  Number(m.content) < 1 ||
                  Number(m.content) > database.users[user.id].heroes.length
                ) {
                  return m.reply(
                    'That is not a valid selection! Trade terminated.'
                  )
                }
                choices[1] = [Number(m.content), 'hero']
              })
              break
            case '🇧':
              message.channel.send(
                'Please enter the number of orbs. This times out in 30 seconds.'
              )
              const selectionB = new MessageCollector(
                message.channel,
                m => m.author.id === user.id && !isNaN(Number(m.content)),
                { time: 30e3, max: 1 }
              )
              selectionB.on('collect', m => {
                database = JSON.parse(
                  fs.readFileSync('data.json', { encoding: 'utf-8' })
                )
                if (
                  Number(m.content) < 1 ||
                  Number(m.content) > database.users[user.id].balance
                ) {
                  return m.reply(
                    'That is not a valid orb amount! Trade terminated.'
                  )
                }
                choices[1] = [Number(m.content), 'orbs']
              })
              break
            default:
              message.channel.send('Invalid reaction - ending trade')
          }
        })
      const interval = setInterval(async () => {
        if (choices[0] && choices[1]) {
          clearInterval(interval)
          database = JSON.parse(
            fs.readFileSync('data.json', { encoding: 'utf-8' })
          )
          let readableChoices = []
          let oneConfirm = false
          if (choices[0][1] === 'orbs') {
            readableChoices.push(`${choices[0][0]} orbs`)
          } else {
            let hero = database.users[message.author.id].heroes[choices[0][0] - 1]
            readableChoices.push(
              `${hero.rarity}\u2605 ${hero.name}: ${hero.title}`
            )
          }
          if (choices[1][1] === 'orbs') {
            readableChoices.push(`${choices[1][0]} orbs`)
          } else {
            let hero = database.users[user.id].heroes[choices[1][0] - 1]
            readableChoices.push(
              `${hero.rarity}\u2605 ${hero.name}: ${hero.title}`
            )
          }
          const msg = await message.channel.send(
            `${message.author} is offering their ${
              readableChoices[0]
            } and ${user} is offering their ${
              readableChoices[1]
            }. React with ✅ to confirm. This times out in 30 seconds`
          )
          ;(async () => {
            await msg.react('✅')
          })()
          msg
            .awaitReactions(
              (reaction, usr) =>
                usr.id === message.author.id && reaction.emoji.name === '✅',
              {
                max: 1,
                time: 30e3
              }
            )
            .then(() => {
              oneConfirm ? confirm(choices).then(message.channel.send('Trade confirmed!')) : (oneConfirm = true)
            })
          msg
            .awaitReactions(
              (reaction, usr) =>
                usr.id === user.id && reaction.emoji.name === '✅',
              {
                max: 1,
                time: 30e3
              }
            )
            .then(() => {
              oneConfirm ? confirm(choices).then(message.channel.send('Trade confirmed!')) : (oneConfirm = true)
            })
        }
      }, 100)

      setTimeout(() => {
        clearInterval(interval)
        delete currentTrades[message.author.id]
        delete currentTrades[user.id]
      }, 30e3)
    }
  }
}
