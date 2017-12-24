
export const makePos = () => {
  return {
    p: { x: 0, y: 0, z: 0 },
    s: { x: 1, y: 1, z: 1 },
    r: { x: 0, y: 0, z: 0 }
  }
}

export const ElementType = {
  points: 'Points',
  mesh: 'Mesh'
}

export const GeoType = {
  Ball: 'SphereBufferGeometry',
  Box: 'BoxBufferGeometry'
}

export const makeBall = () => {
  return {
    elementType: ElementType.points,
    // geometry: 'SphereBufferGeometry',
    geometry: GeoType.Ball,

    ...makePos(),
    p: { x: 1.5, y: 0, z: 0 },

    shader: {
      doc: JSON.parse(JSON.stringify(require('./SampleShaderGraph-2.json'))),
      uniforms: {
        time: { value: 0 }
      },
      vs: undefined,
      fs: undefined,
      updateFn:
`uniforms.time.value = window.performance.now() / 1000;
element.rotation.y += 0.1;`

    }
  }
}

export const makeBox = () => {
  return {
    elementType: ElementType.points,
    // geometry: 'SphereBufferGeometry',
    geometry: GeoType.Box,

    ...makePos(),
    p: { x: -1.5, y: 0, z: 0 },

    shader: {
      doc: JSON.parse(JSON.stringify(require('./SampleShaderGraph-1.json'))),
      uniforms: {
        time: { value: 0 }
      },
      vs: undefined,
      fs: undefined,
      updateFn:
`uniforms.time.value = window.performance.now() / 1000;
element.rotation.y += 0.01;`

    }
  }
}
