const { exec } = require('child_process')
const { webhook: config } = require('./config') || {webhook: {}} // Because who cares
const { WebhookClient, MessageEmbed: RichEmbed } = require('discord.js')

const hook = new WebhookClient(config.id, config.token)

function spawnMainProcess () {
  return new Promise((resolve, reject) => {
    exec('node index.js', (error, stdout, stderr) => {
      if (error) reject(error)
      else resolve({ stdout, stderr })
    })
  })
}
hook.send(
  new RichEmbed()
    .setTitle('Starting git synchronization process')
    .setDescription(
      `\`\`\`bash
$ node spam_git_pull.js
\`\`\``
    )
    .setColor('BLUE')
)
exec('node spam_git_pull.js')

function mainCycle () {
  hook.send(
    new RichEmbed()
      .setTitle('Spawning main process')
      .setDescription(
        `\`\`\`bash
$ node index.js
\`\`\``
      )
      .setColor('BLUE')
  )
  spawnMainProcess().catch(error => {
    hook
      .send(
        new RichEmbed()
          .setTitle('Main process exited with this error')
          .setDescription(
            `\`\`\`js
${error}
\`\`\``
          )
          .setColor('RED')
      )
  }).then(() => mainCycle())
}

mainCycle()
