const { ArgumentType } = require('discord.js-commando')
const { heroes } = require('fire-emblem-heroes-stats').default

module.exports = class HeroArgumentType extends ArgumentType {
  constructor (client) {
    super(client, 'hero')
  }

  validate (value) {
    let name = value.split(':')[0].trim().toLowerCase()
    let title = (value.split(':')[1] || '').trim().toLowerCase()
    let info = heroes.filter(hero => {
      let neededName = hero.name.replace(/ \(.*\)/, '').toLowerCase()
      if (!title) return neededName === name
      else return neededName === name && hero.title.toLowerCase() === title
    })
    if (info.length === 1) return true
    else if (info.length === 0) return 'You have provided an invalid hero. Please try again.'
    else {
      let possibilities = []
      for (let hero, i = 0; i < info.length; i++) {
        hero = info[i]
        possibilities.push(`"${hero.name.replace(/ (.*)/, '')}: ${hero.title}"`)
      }
      return `Multiple heroes found: ${possibilities.join(
        ', '
      )}. Please be more specific.`
    }
  }

  parse (value) {
    let name = value.split(':')[0].trim().toLowerCase()
    let title = (value.split(':')[1] || '').trim().toLowerCase()
    return heroes.find(hero => {
      let neededName = hero.name.replace(/ \(.*\)/, '').toLowerCase()
      if (!title) return neededName === name
      else return neededName === name && hero.title.toLowerCase() === title
    })
  }
}
