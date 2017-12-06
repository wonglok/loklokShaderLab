const uuidv4 = require('uuid/v4')

export const getBall = ({ label, fromBox, fromBall }) => {
  return {
    label: '',
    fromBox,
    fromBall,
    toBox: false,
    toBall: false
  }
}

export const getFuncBox = ({ name, boxID, type, pos, size, ballsIn, ballsOut }) => {
  var bo = [
    ...ballsOut
  ]
  return {
    name,
    type,
    boxID: boxID,
    pos: { ...pos },
    size: { ...size },
    ballsIn: [
      ...ballsIn
    ],
    ballsOut: bo,
    isVoid: bo.length === 0
  }
}

export const getWinPos = () => {
  return {
    x: (window.scrollX + 100),
    y: (window.scrollY + 100)
  }
}

export const getV3Modifier = (config) => {
  var name = `vec3Modifier`
  var execID = '_' + (Math.random() * 10000).toFixed(0)
  var funcBoxID = uuidv4()
  var ballsIn = [
    getBall({ label: 'vec3', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', fromBox: funcBoxID, fromBall: uuidv4() }),
    getBall({ label: 'float', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var ballsOut = [
    getBall({ label: 'vec3', fromBox: funcBoxID, fromBall: uuidv4() })
  ]
  var code =
`vec3 ${name}${execID} (vec3 v3, float iX, float iY, float iZ) {
  v3.xyz = v3.xyz + vec3(iX, iY, iZ);
  return v3;
}`
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

export const getNewDoc = () => {
  var uid = uuidv4()
  var vs = getV3Modifier({
    pos: {
      x: 100,
      y: 100
    }
  })
  var vs2 = getV3Modifier({
    pos: {
      x: 300,
      y: 455
    }
  })
  var vs3 = getV3Modifier({
    pos: {
      x: 600,
      y: 455
    }
  })

  // vs.ballsOut[0].toBall = vs2.ballsIn[0].fromBall
  // vs.ballsOut[0].toBox = vs2.ballsIn[0].fromBox

  // vs2.ballsIn[0].toBall = vs.ballsOut[0].fromBall
  // vs2.ballsIn[0].toBox = vs.ballsOut[0].toBox

  return {
    date: new Date(),
    docID: uid,
    funcBoxes: [
      vs, vs2, vs3
    ]
  }
}
