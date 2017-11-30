export function makeStyle ({ style }) {
  return {
    ...style
  }
}

const uuidv4 = require('uuid/v4')

export function makeBall ({ symbol = '', label, style = {} }) {
  var uuid = uuidv4()
  return {
    id: uuid,
    symbol,
    style,
    label,
    items: [
      { id: uuid, label }
    ]
  }
}

export function makeFuncCode ({ cntr }) {
  return `
${cntr.code}
`
}

export function makeGroup ({ returnType = 'void', shaderType = 'common', root = false, type = 'unknown', style = {}, ballsIn = [], ballsOut = [], codeHeader, codeReturn, codeFooter = '\n}', code = '', execID = 'e404', funcName = '', args = [] }) {
  var gpID = uuidv4()
  var ans = {
    shaderType,
    root,
    type,
    id: gpID,
    style: makeStyle({ style }),
    execID,
    funcName,
    code,
    args,
    returnType,
    ballsIn: [
      ...ballsIn.map((item, key) => {
        item.gpID = gpID
        item.items.forEach((baller) => {
          baller.gpID = gpID
        })
        return item
      })
    ],
    ballsOut: [
      ...ballsOut.map((item, key) => {
        item.gpID = gpID
        item.items.forEach((baller) => {
          baller.gpID = gpID
        })
        return item
      })
    ]
  }

  return ans
}

export function getStyle () {
  return {
    top: (window.scrollY + 30) + 'px',
    left: (window.scrollX + 30) + 'px'
  }
}

export function makeTemplate ({ type }) {
  var newObj
  var execID = '__' + (Math.random() * 10000).toFixed(0)
  switch (type) {
    case 'time':
      newObj = makeGroup({
        type: 'time',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
        ],
        funcName: `getTime${execID}`,
        code:
`float getTime${execID} () {
  return time;
}`,
        returnType: `float`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
        ],
        ballsOut: [
          makeBall({ symbol: '', label: 'float', style: { 'margin-right': '25px' } })
        ]
      })
      break
    case 'sin':
      newObj = makeGroup({
        type: 'sin',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'float', name: 'iV' }
        ],
        funcName: `getSine${execID}`,
        code:
`float getSine${execID} (float iV) {
  return sin(iV + time);
}`,
        returnType: `float`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'float', label: 'iV', style: { 'margin-right': '25px' } })
        ],
        ballsOut: [
          makeBall({ symbol: '', label: 'float', style: { 'margin-right': '25px' } })
        ]
      })
      break
    case 'vec3Adder':
      newObj = makeGroup({
        type: 'vec3Adder',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'vec3', name: 'v3' },
          { type: 'float', name: 'iX' },
          { type: 'float', name: 'iY' },
          { type: 'float', name: 'iZ' }
        ],
        funcName: `vec3Adder${execID}`,
        code:
`vec3 vec3Adder${execID} (vec3 v3, float iX, float iY, float iZ) {
  v3.xyz = v3.xyz + vec3(iX, iY, iZ);
  return v3;
}`,
        returnType: `vec3`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'vec3', label: 'vec3', style: { 'margin-right': '25px' } }),
          makeBall({ symbol: 'float', label: 'iX' }),
          makeBall({ symbol: 'float', label: 'iY' }),
          makeBall({ symbol: 'float', label: 'iZ' })
        ],
        ballsOut: [
          makeBall({ symbol: 'vec3', label: 'vec3' })
        ]
      })
      break
    case 'outputPosition':
      newObj = makeGroup({
        root: true,
        shaderType: 'vertex',
        type: 'outputPosition',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'vec3', name: 'position' }
        ],
        funcName: `outputPosition${execID}`,
        code:
`void outputPosition${execID} (vec3 position) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`,
        returnType: `void`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'position', label: 'vec3', style: { 'margin-right': '25px' } })
        ],
        ballsOut: [
        ]
      })
      break
    case 'getPosition':
      newObj = makeGroup({
        type: 'getPosition',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
        ],
        funcName: `getPosition${execID}`,
        code:
`vec3 getPosition${execID} () {
  return position;
}`,
        returnType: `vec3`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
        ],
        ballsOut: [
          makeBall({ symbol: 'vec3', label: 'vec3' })
        ]
      })
      break
    default:
      break
  }

  return newObj
}
