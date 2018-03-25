const { exec } = require('child_process')
const { WebhookClient, RichEmbed } = require('discord.js')

const hook = new WebhookClient()

setInterval(() => {
  exec('git pull', (error, stdout) => {
    if (error) console.log(error)
    if (/Already up to date\./.test(stdout)) return
    hook.send(
      new RichEmbed()
        .setTitle('Pulled changes via git')
        .setDescription(`\`\`\`${stdout}\`\`\``)
        .setColor('ORANGE')
    )
  })
}, 15e3)
