const { StateManager, State, ask } = require('../');

(async function () {
  const stateManager = new StateManager([
    new State({
      name: 'main-menu',
      async run (data) {
        if (data.name) {
          console.log(`Hello ${data.name}`)
        }
        const state = await ask(`What would you like to do?
1. random number
2. exit`, /([1-2]+)/, '1')

        switch (parseInt(state)) {
          case 1:
            return State.transition('random-number')
          case 2:
          default:
            console.log('good bye 👋')
            return State.exit()
        }
      }
    }),
    new State({
      name: 'random-number',
      async run (data) {
        const upperBound = await ask('What is your upper bound value?', /([0-9]+)/, '23')
        console.log(`Your random number is ${Math.random(0, upperBound)}`)
        const cont = await ask('Would you like to continue?', /(y|n)$/, '(y|n)')
        if (cont === 'y') {
          return State.rerun(data)
        }
        return State.transition('main-menu')
      }
    })
  ])

  await stateManager.run()
  process.exit()
}())
