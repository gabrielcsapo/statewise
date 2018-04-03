# statewise

> 🐾 remember what state you're in

[![Npm Version](https://img.shields.io/npm/v/statewise.svg)](https://www.npmjs.com/package/statewise)
[![Build Status](https://travis-ci.org/gabrielcsapo/statewise.svg?branch=master)](https://travis-ci.org/gabrielcsapo/statewise)
[![Coverage Status](https://lcov-server.gabrielcsapo.com/badge/github%2Ecom/gabrielcsapo/statewise.svg)](https://lcov-server.gabrielcsapo.com/coverage/github%2Ecom/gabrielcsapo/statewise)
[![Dependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/statewise/status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/statewise)
[![devDependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/statewise/dev-status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/statewise#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/statewise.svg)]()
[![npm](https://img.shields.io/npm/dm/statewise.svg)]()

_statewise is a CLI helper that helps get you get things working without the stress of application state._

## TOC

<!-- TOC depthFrom:3 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)

<!-- /TOC -->

### Installation

```
npm install statewise --save
```

### Usage

```js
const { StateManager, State, ask } = require('statewise');

const stateManager = new StateManager([
  new State({
    name: 'main-menu',
    run: async (data) => {
      if(!data.name) return { action: 'transition', stateName: 'get-name' }  
      const answer = await ask(`
        hello ${data.name}
      ======================
        please select one
      ======================
      1. change name
      2. get a nick name
      3. exit
      `, /([1-3])/, '2')

      console.log(answer);

    }
  }),
  new State({
    name: 'get-name',
    run: async (data) => {
      data.name = await ask('What is your name?', /([a-zA-Z]+)$/, 'Bob')
      return { action: 'transition', stateName: 'main-menu' }
    }
  })
])
```


### Examples

> see the [/examples](./examples) directory to see some examples
>> if you have a cool example please open an PR!
