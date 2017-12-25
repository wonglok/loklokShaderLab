
export const makePos = () => {
  return {
    p: { x: 0, y: 0, z: 0 },
    s: { x: 1, y: 1, z: 1 },
    r: { x: 0, y: 0, z: 0 }
  }
}

export const ElementType = {
  Points: 'Points',
  Mesh: 'Mesh',
  LineSegments: 'LineSegments'
}

export const GeoType = {
  Ball: 'SphereBufferGeometry',
  Box: 'BoxBufferGeometry'
}

export const MaterialType = {
  ShaderMaterial: 'ShaderMaterial',
  MeshPhongMaterial: 'MeshPhongMaterial',
  MeshLambertMaterial: 'MeshLambertMaterial',
  LineBasicMaterial: 'LineBasicMaterial'
}

export const LightType = {
  PointLight: 'PointLight'
}

export const makePointLight = () => {
  return {
    lightType: LightType.PointLight,
    ...makePos(),
    p: { x: 0, y: 0, z: 5 }
  }
}

export const makeBall = () => {
  return {
    elementType: ElementType.LineSegments,
    // geometry: 'SphereBufferGeometry',
    geometry: GeoType.Ball,
    material: MaterialType.ShaderMaterial,

    ...makePos(),
    p: { x: 3, y: 0, z: 0 },

    shader: {
      doc: JSON.parse(JSON.stringify(require('./SampleShaderGraph-ball.json'))),
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

export const makeBox = () => {
  return {
    elementType: ElementType.Points,
    // geometry: 'SphereBufferGeometry',
    geometry: GeoType.Box,
    material: MaterialType.ShaderMaterial,

    ...makePos(),
    p: { x: -3, y: 0, z: 0 },

    shader: {
      doc: JSON.parse(JSON.stringify(require('./SampleShaderGraph-box.json'))),
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
