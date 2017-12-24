export const tempVSHeader = () => {
  return `#include <common>
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
`
}

export const tempFSHeader = () => {
  return `#include <common>
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
`
}

export const getRightCode = ({ boxes = [], type = 'common' }) => {
  return boxes.filter((box) => {
    if (type === 'common') {
      return true
    } else if (type === 'vertex') {
      return box.type === 'vertex' || box.type === 'common'
    } else if (type === 'fragment') {
      return box.type === 'fragment' || box.type === 'common'
    }
  })
}

export const getFuncs = ({ boxes = [], type }) => {
  var ans = getRightCode({ boxes, type }).reduce((accu, box, boxIdx, boxArr) => {
    accu = accu + `
${box.code}
    `
    return accu
  }, '')

  // console.log(ans)
  return ans
}

export const getRootCode = ({ boxes = [], type }) => {
  return getRightCode({ boxes, type }).filter((box) => {
    return box.isRoot
  })
}

export const getArgsReducer = ({ box, boxes }) => {
  return (accu, ball, ballIdx, balls) => {
    var toBox = boxes.filter((box) => {
      return box.boxID === ball.toBox
    })[0]
    if (ballIdx > 0) {
      accu += `, `
    }
    if (toBox) {
      toBox.ballsOut.forEach((ballOut) => {
        accu += `ans_${ballOut.name}`
      })
    } else {
      accu += ball.defaultValue
    }
    return accu
  }
}

export const buildDeps = ({ box, boxes }) => {
  var resolution = []
  var boxCursor = box
  return function continueResolve () {
    var collected = []
    boxCursor.type = box.type
    boxCursor.ballsIn.filter((ball) => {
      return ball.toBox && ball.toBall
    }).forEach((ball) => {
      var toBox = boxes.filter((eBox) => {
        return eBox.boxID === ball.toBox
      })[0]

      if (toBox) {
        boxCursor = toBox
        collected.push(toBox)
        resolution = [
          ...collected,
          ...resolution
        ]
      }
    })

    if (collected.length === 0) {
      resolution = resolution.filter((dep, index, self) =>
        index === self.findIndex((t) => (
          t.boxID === dep.boxID
        ))
      )
      return resolution
    } else {
      return continueResolve()
    }
  }
}

export const elaborateDeps = ({ boxes }) => {
  return boxes.reduce((accu, box) => {
    var funcName = box.ballsOut[0].name
    var typeCast = box.ballsOut[0].label
    var depArgs = box.ballsIn.reduce(getArgsReducer({ box, boxes }), '')
    accu +=
`
  ${typeCast} ans_${funcName} = ${funcName}(${depArgs});`

    return accu
  }, '')
}

export const getExecCode = ({ boxes = [], type }) => {
  return getRootCode({ boxes, type }).reduce((accu, box, boxIdx) => {
    var funcName = box.ballsOut[0].name
    var rootArgs = box.ballsIn.reduce(getArgsReducer({ box, boxIdx, boxes }), '')
    var deps = buildDeps({ box,
      boxes: boxes
    })()

    accu += `${elaborateDeps({
      boxes: deps
    })}
`

    accu +=
`  ${funcName}(${rootArgs});`

    return accu
  }, '')
}

export const getVS = ({ doc }) => {
  var funcs = getFuncs({ boxes: doc.funcBoxes, type: 'vertex' })
  var vsHeader = tempVSHeader()
  var vsExecCode = getExecCode({ boxes: doc.funcBoxes, type: 'vertex' })
  var vsMain =
`
void main () {
  ${vsExecCode}

}
`
  return `${vsHeader}
${funcs}
${vsMain}`
}

export const getFS = ({ doc }) => {
  var funcs = getFuncs({ boxes: doc.funcBoxes, type: 'fragment' })
  var vsHeader = tempVSHeader()
  var vsExecCode = getExecCode({ boxes: doc.funcBoxes, type: 'fragment' })
  var vsMain =
  `
void main () {
  ${vsExecCode}

}
  `
  return `${vsHeader}
${funcs}
${vsMain}`
}

export const generateVSFS = ({ doc }) => {
  return {
    vs: getVS({ doc }),
    fs: getFS({ doc })
  }
}
