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
    ['game', 'General game commands'],
    ['misc', 'Other random commands']
  ])
  .registerDefaults()
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
  console.log('Connected')
  console.log('Logged in as:')
  console.log(`${client.user.tag} - (${client.user.id})`)
  client.user.setActivity(`@${client.user.username} help`)
})

client.login(config.token)
