const { StateManager, State, ask } = require('../');

(async function () {
  const stateManager = new StateManager([
    new State({
      name: 'main-menu',
      run: async (data) => {
        if (!data.name) return State.transition('get-name')
        const choice = await ask(`
  hello ${data.name}
======================
  please select one
======================
1. change name
2. exit
`, /([1-2])/, '1|2')

        switch (parseInt(choice)) {
          case 1:
            return State.transition('get-name')
          case 2:
            console.log('Good bye 👋')
            return State.exit()
          default:
            return State.exit()
        }
      }
    }),
    new State({
      name: 'get-name',
      run: async (data) => {
        data.name = await ask('What is your name?', /([a-zA-Z]+)$/, 'Bob')
        return State.transition('main-menu')
      }
    })
  ])

  await stateManager.run()
  process.exit()
}())
