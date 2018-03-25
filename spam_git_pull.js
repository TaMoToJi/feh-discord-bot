const { exec } = require('child_process')
const { WebhookClient, RichEmbed } = require('discord.js')
const { webhook: config } = require('./config')

const hook = new WebhookClient(config.id, config.token)

setInterval(() => {
  exec(
    'git pull',
    {
      detached: true
    },
    (error, stdout) => {
      if (error) console.log(error)
      if (/Already up to date\./.test(stdout)) return
      hook.send(
        new RichEmbed()
          .setTitle('Pulled changes via git')
          .setDescription(`\`\`\`${stdout}\`\`\``)
          .setColor('ORANGE')
      )
    }
  )
}, 15e3)
