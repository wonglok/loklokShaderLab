
export const makePos = () => {
  return {
    p: { x: 0, y: 0, z: 0 },
    s: { x: 1, y: 1, z: 1 },
    r: { x: 0, y: 0, z: 0 }
  }
}

export const makeBall = () => {
  return {
    elementType: 'Points',
    geometry: 'SphereBufferGeometry',

    ...makePos(),

    shader: {
      uniforms: {
        time: { value: 0 }
      },
      vs: '',
      fs: '',
      updateFn:
`uniforms.time.value = window.performance.now() / 1000;
element.rotation.y += 3.0;`

    }
  }
}
