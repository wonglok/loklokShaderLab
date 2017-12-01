export const vsHeader = ({ uniforms, varying }) => {
  return `#include <common>
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
`
}

export const fsHeader = ({ uniforms }) => {
  return `#include <common>
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;
`
}

export const main = ({ execution = '' }) => {
  return `
void main () {
${execution}
}
`
}

let getConnectedArgs = ({ ball, gpID, connectorGroups }) => {
  var dependency = ball.items.filter((baller) => {
    return baller.gpID !== gpID
  })[0]

  var funcName = connectorGroups.filter((gp, gpIdx) => {
    return gp.id === dependency.gpID
  })[0].funcName

  // console.log(funcName, dependency.gpID)
  return 'res_' + funcName
}

let getArgs = ({ line, inputSide, outputSide, connectorGroups }) => {
  // console.log(outputSide.funcName, outputSide.args)
  return outputSide.ballsIn.filter((ball) => {
    return ball.gpID === outputSide.id
  }).reduce((accu, ball, ballKey, ballsIn) => {
    if (ball.items.length >= 2) {
      accu += getConnectedArgs({ ball, gpID: ball.gpID, connectorGroups })
    } else {
      accu += '0.0'
    }
    if (ballKey < (ballsIn.length - 1)) {
      accu += ','
    }
    return accu
  }, '')
}

let getReturnTypePart = ({ gp, key }) => {
  if (gp.returnType !== 'void') {
    return `  ${gp.returnType} res_${key} = `
  } else {
    return ''
  }
}

let resovleEquation = ({ gp, connections, connectorGroups, resolution }) => {
  return connections.filter((conn) => {
    return conn.gpID === gp.id
  }).reduce((accu, line) => {
    if (!line) {
      return resolution
    }

    var outputSideGPID = line.items.filter((baller) => {
      return baller.gpID !== gp.id
    })[0].gpID

    var outputSide = connectorGroups.filter((connector) => {
      return connector.id === outputSideGPID
    })[0]

    var inputSide = connectorGroups.filter((connector) => {
      return connector.id === gp.id
    })[0]

    if (!outputSide || !outputSideGPID || !line || !inputSide) {
      return resolution
    }

    var code =
`
${getReturnTypePart({ gp: outputSide, key: outputSide.funcName })}${outputSide.funcName}(${getArgs({ line, inputSide, outputSide, connectorGroups })});
`
    var newObj = {
      line,
      inputSide,
      outputSide,
      code
    }

    resolution.unshift(newObj)

    // console.log(newObj)

    if (outputSide.ballsIn.length > 0 && outputSide.args.length > 0) {
      resovleEquation({ gp: outputSide, connections, resolution, connectorGroups })
      return resolution
    } else {
      return resolution
    }
  }, resolution)
  // console.log(gp, arg)
}

export const getExecs = ({ connectorGroups, shaderType, connections }) => {
  var result = (connectorGroups || []).filter((item, array) => {
    return item.root === true && item.shaderType === shaderType
  }).reduce((accu, gp, key) => {
    var shaderResolves = resovleEquation({ gp, connections, connectorGroups, resolution: [] })
    // console.log(shaderResolves)

    var dep = shaderResolves.reduce((accu, res) => {
      accu += res.code
      return accu
    }, '')

    var last = shaderResolves.slice().pop()
    var lastOutput = ''
    if (last) {
      lastOutput = last.outputSide.funcName

      accu = dep + '' +
      `
  ${getReturnTypePart({ gp, key })}${gp.funcName}(res_${lastOutput});
      ` + accu
      return accu
    } else {
      accu = dep + '' +
      `
  ${getReturnTypePart({ gp, key })}${gp.funcName}();
      ` + accu
      return accu
    }
  }, '')

  return main({ execution: result }) || ''
}

export const getFuncs = ({ connectorGroups, connections, shaderType }) => {
  // var gpRoot = connectorGroups.filter((gpItem, key) => {
  //   return gpItem.root === true && gpItem.shaderType === shaderType
  // })[0]
  // if (!gpRoot) {
  //   return ''
  // }

  // var resolvedAns = resovleEquation({ gp: gpRoot, connections, connectorGroups, resolution: [] })

  // function checkUsed ({ resolution, gpItem }) {
  //   console.log(resolution)
  //   var gpID = gpItem.id

  //   return resolution.filter((res) => {
  //     return (res.outputSide.id === gpID || res.inputSide.id === gpID)
  //   }).length >= 1
  // }

  return connectorGroups.reduce((accu, gpItem, key, arr) => {
    if (
      (gpItem.shaderType === shaderType || gpItem.shaderType === 'common')
      // checkUsed({ resolution: resolvedAns, gpItem })
    ) {
      accu += '\n'
      accu += '\n'
      accu += gpItem.code
    }
    return accu
  }, '')
}

export const getCode = ({ connectorGroups, connections, shaderType }) => {
  return `${shaderType === 'vertex' ? vsHeader({}) : fsHeader({})}
${getFuncs({ connectorGroups, connections, shaderType })}
${getExecs({ connectorGroups, connections, shaderType })}`
}

/*

vec3 getOriginalPosition () {
  return position;
}

void addDisplacement (inout vec3 position) {
  position.y += sin(position.y + time * 0.3);
}

void outputPosition (vec3 position) {
  gl_Position = processCoord(position);
}

void main () {
  vec3 newPos = getOriginalPosition();

  addDisplacement(newPos);

  outputPosition(newPos);
  outputPointSize();
  outputUV();
}

*/
