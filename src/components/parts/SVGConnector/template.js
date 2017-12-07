const uuidv4 = require('uuid/v4')

export const getBall = ({ label, name, fromBox, fromBall, defaultValue }) => {
  return {
    label: label || '',
    name,
    fromBox,
    fromBall,
    defaultValue,
    toBox: false,
    toBall: false
  }
}

export const getFuncBox = ({ name, boxID, code, type, pos, size, ballsIn, ballsOut }) => {
  var bo = [
    ...ballsOut
  ]
  return {
    name,
    type,
    boxID: boxID,
    code,
    pos: { ...pos },
    size: { ...size },
    ballsIn: [
      ...ballsIn
    ],
    ballsOut: bo,
    isRoot: bo[0].label === 'void'
  }
}

export const getWinPos = () => {
  return {
    x: (window.scrollX + 100),
    y: (window.scrollY + 100)
  }
}

export const floatModifier = (config) => {
  var name = `floatModifier`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()
  var ballsIn = [
    getBall({ label: 'float', name: 'iV', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var code =
`float ${name}${execID} (float iV) {
  iV = iV + sin(time);
  return iV;
}`
  var ballsOut = [
    getBall({ label: 'float', name: name + execID, defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'common',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const vec3Modifier = (config) => {
  var name = `vec3Modifier`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()
  var ballsIn = [
    getBall({ label: 'vec3', name: 'v3', defaultValue: 'vec3(0.0)', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iX', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iY', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iZ', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var code =
`vec3 ${name}${execID} (vec3 v3, float iX, float iY, float iZ) {
  v3.xyz = v3.xyz + vec3(iX, iY, iZ);
  return v3;
}`
  var ballsOut = [
    getBall({ label: 'vec3', name: name + execID, defaultValue: 'vec3(0.0)', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'common',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const vec4Modifier = (config) => {
  var name = `vec4Modifier`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()
  var ballsIn = [
    getBall({ label: 'vec4', name: 'v4', defaultValue: 'vec4(0.0)', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iX', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iY', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iZ', defaultValue: '0.0', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', name: 'iW', defaultValue: '1.0', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var code =
`vec4 ${name}${execID} (vec4 v4, float iX, float iY, float iZ, float iW) {
  v4 = v4 + vec4(iX, iY, iZ, iW);
  return v4;
}`
  var ballsOut = [
    getBall({ label: 'vec4', name: name + execID, defaultValue: 'vec4(0.0)', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'common',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 400,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const outputVertex = (config) => {
  var name = `outputVertex`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()
  var ballsIn = [
    getBall({ label: 'vec3', name: 'position', defaultValue: 'vec3(0.0)', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var code =
`void ${name}${execID} (vec3 position) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`
  var ballsOut = [
    getBall({ label: 'void', name: name + execID, defaultValue: '', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'vertex',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const outputUV = (config) => {
  var name = `outputUV`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()
  var ballsIn = [
  ]
  var code =
`void ${name}${execID} () {
  vUv = uv;
}`
  var ballsOut = [
    getBall({ label: 'void', name: name + execID, defaultValue: '', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'vertex',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const outputFragment = (config) => {
  var name = `outputFragment`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()

  var ballsIn = [
    getBall({ label: 'vec4', name: 'color', defaultValue: 'vec4(0.5)', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var code =
`void ${name}${execID} (vec4 color) {
  gl_FragColor = color;
}`
  var ballsOut = [
    getBall({ label: 'void', name: name + execID, defaultValue: '', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'fragment',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const getPosition = (config) => {
  var name = `getPosition`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()

  var ballsIn = [
  ]
  var code =
`vec3 ${name}${execID} () {
  return position;
}`
  var ballsOut = [
    getBall({ label: 'vec3', name: name + execID, defaultValue: '', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'vertex',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const getUV = (config) => {
  var name = `getUV`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()

  var ballsIn = [
  ]
  var code =
`vec2 ${name}${execID} () {
  return vUv;
}`
  var ballsOut = [
    getBall({ label: 'vec2', name: name + execID, defaultValue: '', fromBox: funcBoxID, fromBall: uuidv4() })
  ]

  return getFuncBox({
    name,
    type: 'vertex',
    boxID: funcBoxID,
    code,
    pos: getWinPos(),
    size: {
      w: 380,
      h: 200
    },
    ballsIn,
    ballsOut,
    ...config
  })
}

export const getNewDoc = () => {
  var uid = uuidv4()
  return {
    date: new Date(),
    docID: uid,
    funcBoxes: [
    ]
  }
}
