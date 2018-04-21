const { Command } = require('discord.js-commando')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')

module.exports = class InventoryCommand extends Command {
  constructor (client) {
    super(client, {
      name: 'inventory',
      group: 'heroes',
      memberName: 'inventory',
      description: "Views a person's inventory of heroes",
      details: 'If no user is provided, the command displays your inventory',
      examples: ['inventory', 'inventory 1 Leif', 'inventory 2'],
      aliases: [
        'hero-inventory',
        'heroinventory',
        'hero-inv',
        'heroinv',
        'inv'
      ],
      args: [
        {
          key: 'page',
          default: 1,
          type: 'integer',
          prompt: 'What page would you like to view?',
          min: 1
        },
        {
          key: 'user',
          default: 'no',
          type: 'user',
          prompt: "What user's inventory would you like to view?"
        }
      ]
    })
  }
  run (message, { page, user }) {
    if (user === 'no') user = message.author
    const data = JSON.parse(fs.readFileSync('data.json', { encoding: 'utf-8' }))
    if (!data.users[user.id]) {
      return message.reply(
        `${
          user.id === message.author.id || user.id === message.author.id
            ? 'You'
            : user.username
        } didn't start the game! ${
          user.id === message.author.id || user.id === message.author.id
            ? 'Try'
            : 'They need to type'
        } \`@${this.client.user.tag} start\`.`
      )
    }
    const { heroes } = data.users[user.id]
    message.channel.send(
      new MessageEmbed()
        .setTitle(`${user.username}'s Inventory`)
        .setDescription(
          (() => {
            let string = ''
            for (let i = (page - 1) * 20; i < heroes.length; i++) {
              let hero = heroes[i]
              if (!hero) {
                return string
              }
              string += `${hero.rarity}\u2605 ${hero.name.replace(
                / \(.*\)/,
                ''
              )}: ${hero.title} #${i + 1}\n`
              if (i === 19 + (page - 1) * 20) break
            }
            return string || '🚫 There are no heroes on this page!'
          })``
        )
    )
  }
}
