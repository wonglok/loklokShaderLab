const namespace = 'shaders'
export const ns = namespace
export const pfx = ns + '/'

const state = {
  shaders: []
}

function hydrateUpdater (info) {
  /* eslint-disable */
  info.update = new Function('uniforms', info.updateFn)
  info.run = () => {
    info.update(info.uniforms)
  }
  /* eslint-enable */
  return info
}

const getters = {
  shaders () {
    return state.shaders.map((info) => {
      info = hydrateUpdater(info)
      return info
    })
  },
  shader (state, getters) {
    return (sID) => {
      var info = getters.shaders.find((sdr) => { return sdr.id === sID })
      info = hydrateUpdater(info)
      return info
    }
  }
}

const mutations = {
  update (state, payload) {
    var array = state.shaders
    var index = state.shaders.findIndex(e => e.id === payload.id)
    array[index] = hydrateUpdater(payload)
  },
  add (state, payload) {
    state.shaders.push(newShader(payload))
  },
  remove (state, payload) {
    var array = state.shaders
    var index = state.shaders.indexOf(payload)
    array.splice(index, 1)
  },
  restore (state, payload) {
    state.shaders = payload
  }
}

const actions = {
  saveJSON ({ commit, state }, payload) {
    var dataStr = JSON.stringify(state.shaders, null, '\t')
    var newBlobURL = URL.createObjectURL(new Blob([dataStr], { type: 'text/json' }))
    var dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute('href', newBlobURL)
    dlAnchorElem.setAttribute('download', 'shaders.json')
    dlAnchorElem.click()
  },
  restoreJSON ({ commit, state }, evt) {
    var reader = new FileReader()
    reader.onload = (evt) => {
      try {
        commit('restore', JSON.parse(evt.target.result))
      } catch (e) {
        console.log(e)
      }
    }
    reader.readAsText(evt.target.files[0])
  }
}

const moduleObj = {
  mutations,
  ns,
  pfx,
  namespaced: true,
  state,
  actions,
  getters,
  use,
  clean
}

function use (store) {
  store.registerModule(ns, moduleObj)

  store.commit('shaders/add', {
    id: 'abc'
  })

  // store.subscribe((mutation, state) => {
  //   // called after every mutation.
  //   // The mutation comes in the format of `{ type, payload }`.
  // })
}

function clean (store) {
  store.unregisterModule(ns)
}

function newShader (payload) {
  return {
    id: payload.id,
    uniforms: {
      time: { value: 0 },
      ...(payload.uniforms || {})
    },
    vs:
`uniform float time;
varying vec2 vUv;
void main ( void ) {
  vUv = uv;

  // modify here
  vec3 finalPos = position;
  finalPos.y += sin(time * 2.0 + position.y);

  vec4 mvPosition = modelViewMatrix * vec4( finalPos, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 1.5;
}`,
    fs:
`varying vec2 vUv;
void main ( void ) {
  gl_FragColor = vec4(vec3(vUv,0.5), 1.0);
}`,
    updateFn:
`uniforms.time.value = window.performance.now() / 1000;`

  }
}

export default moduleObj
