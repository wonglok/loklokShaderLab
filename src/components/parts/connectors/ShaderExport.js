export const vsHeader = ({ uniforms, varying }) => {
  return `#include <common>
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void outputPointSize () {
  gl_PointSize = 2.0;
}

void outputUV () {
  vUv = uv;
}
  `
}

export const fsHeader = ({ uniforms }) => {
  return ``
}

export const main = ({ execution = '' }) => {
  return `
void main () {
${execution}
}
  `
}

export const getExecs = ({ connectorGroups, shaderType, connections }) => {
  let getReturnTypePart = ({ gp, key }) => {
    if (gp.returnType !== 'void') {
      return `${gp.returnType} res_${key} = `
    } else {
      return ''
    }
  }

  let resolution = []

  let getArgs = ({ line, inputSide, outputSide }) => {
    //
    console.log(line)
    return ''
  }

  let resovleEquation = ({ gp }) => {
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
  ${getReturnTypePart({ gp: outputSide, key: outputSide.funcName })}${outputSide.funcName}(${getArgs({ line, inputSide, outputSide })});
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
        resovleEquation({ gp: outputSide })
        return resolution
      } else {
        return resolution
      }
    }, resolution)
    // console.log(gp, arg)
  }

  var result = (connectorGroups || []).filter((item, array) => {
    return item.root === true && item.shaderType === shaderType
  }).reduce((accu, gp, key) => {
    var resolution = resovleEquation({ gp })
    console.log(resolution)

    var dep = resolution.reduce((accu, res) => {
      accu += res.code + '\n'
      return accu
    }, '')

    var last = resolution.slice().pop()
    var lastOutput = ''
    if (last) {
      lastOutput = last.outputSide.funcName
    }

    accu = dep + '' +
`
  ${getReturnTypePart({ gp, key })}${gp.funcName}(res_${lastOutput});
` + accu

    return accu
  }, '')

  return main({ execution: result }) || ''
}

export const getFuncs = ({ connectorGroups, shaderType }) => {
  return connectorGroups.reduce((accu, item, key, arr) => {
    if (item.shaderType === shaderType || item.shaderType === 'common') {
      accu += '\n'
      accu += '\n'
      accu += item.code
    }
    return accu
  }, '')
}

export const getCode = ({ connectorGroups, connections, shaderType }) => {
  return `${shaderType === 'vertex' ? vsHeader({}) : fsHeader({})}
${getFuncs({ connectorGroups, shaderType })}
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
