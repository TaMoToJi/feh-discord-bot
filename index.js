const Commando = require('discord.js-commando')
const sqlite = require('sqlite')
const path = require('path')
const config = require('./config')

const client = new Commando.Client({
  owner: config.owner,
  commandPrefix: config.prefix || '!fe',
  invite: config.invite
})

client
  .setProvider(
    sqlite
      .open(path.join(__dirname, 'settings.sqlite3'))
      .then(db => new Commando.SQLiteProvider(db))
  )
  .catch(console.error)

client.registry
  .registerGroups([
    ['items', 'Your inventory/balance'],
    ['game', 'General game commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
  client.user.setActivity(`@${client.user.username} help`)
})

client.login(config.token)
