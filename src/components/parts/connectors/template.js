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
    top: (window.scrollY + 300) + 'px',
    left: (window.scrollX + 300) + 'px'
  }
}

export function makeTemplate ({ type, shaderType }) {
  var newObj
  var execID = '_' + (Math.random() * 10000).toFixed(0)
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
    case 'vec3Modifier':
      newObj = makeGroup({
        type: 'vec3Modifier',
        shaderType,
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'vec3', name: 'v3' },
          { type: 'float', name: 'iX' },
          { type: 'float', name: 'iY' },
          { type: 'float', name: 'iZ' }
        ],
        funcName: `vec3Modifier${execID}`,
        code:
`vec3 vec3Modifier${execID} (vec3 v3, float iX, float iY, float iZ) {
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
    case 'vec4Modifier':
      newObj = makeGroup({
        shaderType,
        type: 'vec4Modifier',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'vec4', name: 'v4' },
          { type: 'float', name: 'iX' },
          { type: 'float', name: 'iY' },
          { type: 'float', name: 'iZ' },
          { type: 'float', name: 'iW' }
        ],
        funcName: `vec4Modifier${execID}`,
        code:
`vec4 vec4Modifier${execID} (vec4 v4, float iX, float iY, float iZ, float iW) {
  v4.xyzw = v4.xyzw + vec4(iX, iY, iZ, iW);
  return v4;
}`,
        returnType: `vec4`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'vec4', label: 'vec4', style: { 'margin-right': '0px' } }),
          makeBall({ symbol: 'float', label: 'iX' }),
          makeBall({ symbol: 'float', label: 'iY' }),
          makeBall({ symbol: 'float', label: 'iZ' }),
          makeBall({ symbol: 'float', label: 'iW' })
        ],
        ballsOut: [
          makeBall({ symbol: 'vec4', label: 'vec4' })
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
    case 'outputPontSize':
      newObj = makeGroup({
        root: true,
        shaderType: 'vertex',
        type: 'outputPontSize',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'float', name: 'pointSize' }
        ],
        funcName: `outputPontSize${execID}`,
        code:
`void outputPontSize${execID} (float pointSize) {
  gl_PointSize = pointSize;
}`,
        returnType: `void`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'float', label: 'float', style: { 'margin-right': '25px' } })
        ],
        ballsOut: [
        ]
      })
      break
    case 'outputGLFragColor':
      newObj = makeGroup({
        root: true,
        shaderType: 'fragment',
        type: 'outputGLFragColor',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { type: 'vec4', name: 'color' }
        ],
        funcName: `outputGLFragColor${execID}`,
        code:
`void outputGLFragColor${execID} (vec4 color) {
  gl_FragColor = color;
}`,
        returnType: `void`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'vec4', label: 'color' })
        ],
        ballsOut: [
        ]
      })
      break
    case 'getConstant':
      newObj = makeGroup({
        type: 'getConstant',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
        ],
        funcName: `getConstant${execID}`,
        code:
`float getConstant${execID} () {
  return 1.0;
}`,
        returnType: `float`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
        ],
        ballsOut: [
          makeBall({ symbol: 'float', label: 'float' })
        ]
      })
      break
    case 'getPosition':
      newObj = makeGroup({
        type: 'getPosition',
        shaderType: 'vertex',
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
    case 'getVec4':
      newObj = makeGroup({
        type: 'getVec4',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
          { name: 'iX', type: 'float' },
          { name: 'iY', type: 'float' },
          { name: 'iZ', type: 'float' },
          { name: 'iW', type: 'float' }
        ],
        funcName: `getVec4${execID}`,
        code:
`vec4 getVec4${execID} (float iX, float iY, float iZ, float iW) {
  return vec4(iX, iY, iZ, iW);
}`,
        returnType: `vec4`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
          makeBall({ symbol: 'float', label: 'float' }),
          makeBall({ symbol: 'float', label: 'float' }),
          makeBall({ symbol: 'float', label: 'float' }),
          makeBall({ symbol: 'float', label: 'float' })
        ],
        ballsOut: [
          makeBall({ symbol: 'vec4', label: 'vec4' })
        ]
      })
      break
    case 'outputUV':
      newObj = makeGroup({
        root: true,
        shaderType: 'vertex',
        type: 'outputUV',
        style: getStyle(),
        // =-=-=-=-=-=-=-=-=-=
        execID,
        args: [
        ],
        funcName: `outputUV${execID}`,
        code:
`void outputUV${execID} () {
  vUv = uv;
}`,
        returnType: `void`,
        // =-=-=-=-=-=-=-=-=-=
        ballsIn: [
        ],
        ballsOut: [
          // makeBall({ symbol: 'vec3', label: 'vec3' })
        ]
      })
      break
    default:
      break
  }

  return newObj
}
