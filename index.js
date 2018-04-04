class StateManager {
  constructor (states = []) {
    this.currentStateIndex = 0
    this.statesMap = {}
    this.states = states.map((state, index) => {
      if (state instanceof State) {
        // this is to be able to transition to states in constant time
        this.statesMap[state.name] = index
        return state
      } else {
        throw new Error('state is not an instance of State')
      }
    })
  }
  next () {
    this.currentStateIndex = (this.currentStateIndex + 1 > this.states.length - 1 ? this.currentStateIndex : this.currentStateIndex + 1)
  }
  previous () {
    this.currentStateIndex = (this.currentStateIndex - 1 < 0 ? this.currentStateIndex : this.currentStateIndex - 1)
  }
  currentState () {
    return this.states[this.currentStateIndex]
  }
  transition (stateName) {
    this.currentStateIndex = this.statesMap[stateName]
  }
  async run (data = {}) {
    const state = this.currentState()

    const { action, data: _data = {}, stateName } = await state.run(data)
    switch (action) {
      case 'rerun':
        await this.run(Object.assign(data, _data))
        break
      case 'next':
        this.next()
        await this.run(Object.assign(data, _data))
        break
      case 'previous':
        this.previous()
        await this.run(Object.assign(data, _data))
        break
      case 'transition':
        if (!stateName) throw new Error('state not defined')
        this.transition(stateName)
        await this.run(Object.assign(data, _data))
        break
      case 'error':
      case 'exit':
      default:
        break
    }
    return data
  }
}

class State {
  constructor ({ name, run }) {
    if (!name || typeof run !== 'function') {
      throw new Error('name and run are required')
    }

    this.run = run
    this.name = name
  }
  /**
   * Init is called by the StateManager instance that this state is a part of when it is being transitioned to.
   * Override this method to utilize state.
   * @method init
   * @param  {Object=} data - optional data that can be passed from the previous state to this one
   */
  async run (data = {}) {
    return { action: 'next', data }
  }
  static transition (stateName, data = {}) {
    return { action: 'transition', stateName, data }
  }
  static exit () {
    return { action: 'exit' }
  }
  static rerun (data = {}) {
    return { action: 'rerun', data }
  }
}

function ask (prompt, validate, exampleResponse, redo = false) {
  return new Promise(function (resolve, reject) {
    let question = prompt.trim()
    if (redo) question = `\u001B[31m${question}\u001B[39m`
    if (exampleResponse) {
      // we want to put the example response on the first line and the prompt might be multiline
      let parts = question.split('\n')
      parts[0] += ` \u001B[90m(${exampleResponse})\u001B[39m `
      question = parts.join('\n')
    }

    process.stdin.resume()
    process.stdout.write(`${question}\n`)

    process.stdin.once('data', function (data) {
      const answer = data.toString().trim()
      if (validate.exec(answer) == null) {
        resolve(ask(prompt, validate, exampleResponse, true))
      } else {
        resolve(answer)
      }
    })
  })
}

module.exports = {
  ask,
  State,
  StateManager
}
