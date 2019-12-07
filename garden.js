const xdg = require('xdg-basedir')
const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'what garden would you like the key to? '
})

const shs = garden => Buffer.alloc(32, garden).toString('base64')

const cache = [xdg.cache, 'ssb-gardens'].join('/')
fs.mkdir(cache, {recursive: true}, error => {
  if (error) console.error(error)
})

rl.prompt()

rl.on('line', line => {
  const garden = line.trim()

  console.log(`key to '${garden}': ${shs(garden)}`)
  fs.writeFile([cache, garden].join('/'), '', error => {
    if (error) console.error(error)
  })

  const seen = fs.readdirSync(cache)
  console.error(`\nseen gardens: `)
  console.table(
    seen.flatMap(garden => [{garden, key: shs(garden)}])
  )
})

