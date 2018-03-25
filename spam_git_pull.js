const { execSync } = require('child_process')
const { WebhookClient, RichEmbed } = require('discord.js')
const { webhook: config } = require('./config')

const hook = new WebhookClient(config.id, config.token)

setInterval(() => {
  try {
    const stdout = execSync('git pull')

    if (/Already up to date\./.test(stdout)) return
    hook.send(
      new RichEmbed()
        .setTitle('Pulled changes via git')
        .setDescription(`\`\`\`${stdout}\`\`\``)
        .setColor('ORANGE')
    )
  } catch (error) {
    console.error(error)
  }
}, 15e3)
