const Commando = require('discord.js-commando')
const { WebhookClient, MessageEmbed } = require('discord.js')
const DBL = require('dblapi.js')
const sqlite = require('sqlite')
const path = require('path')
const config = require('./config')

const client = new Commando.Client({
  owner: config.owner,
  commandPrefix: config.prefix || '!fe',
  invite: config.invite,
  unknownCommandResponse: false
})

client.dbl = new DBL(config.dblToken, { webhookPort: 5000 }, client)

if (!config.webhook) config.webhook = {} // Because who cares

const hook = new WebhookClient(config.webhook.id, config.webhook.token)

client
  .setProvider(
    sqlite
      .open(path.join(__dirname, 'settings.sqlite3'))
      .then(db => new Commando.SQLiteProvider(db))
  )
  .catch(console.error)

client.registry
  .registerGroups([
    ['owner', 'Owner-only commands'],
    ['items', 'Your inventory/balance'],
    ['heroes', 'Your heroes/skills'],
    ['game', 'General game commands'],
    ['feh', 'General FEH commands'],
    ['misc', 'Other random commands']
  ])
  .registerDefaults()
  .registerTypesIn(path.join(__dirname, 'types'))
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.on('ready', () => {
  console.log('Connected')
  console.log('Logged in as:')
  console.log(`${client.user.tag} - (${client.user.id})`)
  client.user.setActivity(`@${client.user.username} help`)
  hook.send(
    new MessageEmbed()
      .setTitle('Bot ready!')
      .addField('Logged in as', `${client.user.tag} - (${client.user.id})`)
      .setColor('GREEN')
  )
})

client.login(config.token)
