export function makeStyle ({ style }) {
  return {
    position: 'absolute',
    ...style
  }
}

const uuidv4 = require('uuid/v4')

export function makeBall () {
  var uuid = uuidv4()
  return {
    id: uuid,
    items: [
      { id: uuid }
    ]
  }
}

export function uuid () {
  return uuidv4()
}

export function makeGroup ({ style = {}, ballsIn = [], ballsOut = [] }) {
  var ans = {
    style: makeStyle({ style: style || {} }),
    id: uuid(),
    ballsIn: [
      ...ballsIn
    ],
    ballsOut: [
      ...ballsOut
    ]
  }
  return ans
}
