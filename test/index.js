const test = require('tape')

const { StateManager, State } = require('../')

test('@statewise', (t) => {
  t.test('@State', (t) => {
    t.plan(4)

    t.test('@constructor', (t) => {
      t.plan(2)

      t.test('should throw an error when name isn\'t specified', (t) => {
        try {
          const state = new State({
            run: () => {}
          })
          t.fail(`${state} should throw an error when name isn't specified`)
        } catch (ex) {
          t.equal(ex.message, 'name and run are required')
          t.end()
        }
      })

      t.test('should throw an error when run isn\'t specified', (t) => {
        try {
          const state = new State({
            name: 'foo'
          })
          t.fail(`${state} should throw an error when run isn't specified`)
        } catch (ex) {
          t.equal(ex.message, 'name and run are required')
          t.end()
        }
      })
    })

    t.test('@transition', (t) => {
      t.plan(2)

      t.test('should be able to transition (w/ data)', (t) => {
        t.deepEqual(State.transition('bar'), { action: 'transition', stateName: 'bar', data: {} })
        t.end()
      })

      t.test('should be able to transition (w data)', (t) => {
        t.deepEqual(State.transition('bar', { planet: 'earth' }), { action: 'transition',
          stateName: 'bar',
          data: { planet: 'earth' } })
        t.end()
      })
    })

    t.test('@rerun', (t) => {
      t.plan(2)

      t.test('should be able to rerun (w/ data)', (t) => {
        t.deepEqual(State.rerun(), { action: 'rerun', data: {} })
        t.end()
      })

      t.test('should be able to rerun (w data)', (t) => {
        t.deepEqual(State.rerun({ planet: 'earth' }), { action: 'rerun', data: { planet: 'earth' } })
        t.end()
      })
    })

    t.test('@exit', (t) => {
      t.plan(1)

      t.test('should be able to exit', (t) => {
        t.deepEqual(State.exit(), { action: 'exit' })
        t.end()
      })
    })
  })

  t.test('@StateManager', (t) => {
    t.plan(2)

    t.test('@constructor', (t) => {
      t.plan(2)

      t.test('should fail to initialize because of bad state object', (t) => {
        try {
          const stateManager = new StateManager([
            new State({
              name: 'foo',
              run: () => {}
            }),
            {},
            new State({
              name: 'boo',
              run: () => {}
            })
          ])
          t.fail(stateManager, 'should not be initialized')
        } catch(ex) {
          t.equal(ex.message, 'state is not an instance of State')
          t.end()
        }
      })

      t.test('should be able to cycle through states correctly (next | previous)', (t) => {
        const stateManager = new StateManager([
          new State({
            name: 'foo',
            run: () => {}
          }),
          new State({
            name: 'bar',
            run: () => {}
          }),
          new State({
            name: 'boo',
            run: () => {}
          })
        ])
        t.deepEqual(stateManager.statesMap, {
          foo: 0,
          bar: 1,
          boo: 2
        })
        t.equal(stateManager.currentStateIndex, 0)
        stateManager.previous()
        t.equal(stateManager.currentStateIndex, 0)
        stateManager.next()
        t.equal(stateManager.currentStateIndex, 1)
        stateManager.next()
        t.equal(stateManager.currentStateIndex, 2)
        stateManager.next()
        t.equal(stateManager.currentStateIndex, 2)

        t.end()
      })
    })

    t.test('@run', (t) => {
      t.plan(1)

      t.test('should be able to cycle through states correctly (transition)', async (t) => {
        const stateManager = new StateManager([
          new State({
            name: 'foo',
            run: (data) => {
              data.foo = true
              return {
                action: 'transition',
                stateName: 'boo',
                data
              }
            }
          }),
          new State({
            name: 'bar',
            run: (data) => {
              data.bar = true
              return {
                action: 'transition',
                stateName: 'exit',
                data
              }
            }
          }),
          new State({
            name: 'boo',
            run: (data) => {
              data.boo = true
              return {
                action: 'transition',
                stateName: 'bar',
                data
              }
            }
          }),
          new State({
            name: 'exit',
            run: (data) => {
              data.exit = true
              return {
                action: 'exit',
                data
              }
            }
          })
        ])

        const data = await stateManager.run()
        t.deepEqual(data, {
          foo: true,
          boo: true,
          bar: true,
          exit: true
        })

        t.end()
      })
    })

  })
})
