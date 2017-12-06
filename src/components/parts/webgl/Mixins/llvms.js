import * as backend from '@/backend/firebase'
import * as THREE from 'three'
import { Parser } from 'expr-eval'

export const __styleContainer = {
  random: Math.random(),
  ready: false,
  data: []
}

export const api = {
  // listStyle () {
  //   return __styleContainer.data.reduce((accu, item ,key) => {
  //     return accu
  //   }, [])
  // },
  listStyle () {
    return __styleContainer.data
  },
  getStyle (name) {
    return __styleContainer.data.filter((item) => {
      return item.name === name
    })[0]
  }
}

export function getTemplate ({ name, data }) {
  return {
    type: 'mesh',
    name,
    position: {
      x: 0.0,
      x_formula: 'x * aspect',
      y: 0.0,
      y_formula: '-y * aspect + top - (meshHeight * scaleY) * 0.5 + 50 * scaleY * 0',
      z: 0.0,
      z_formula: 'z'
    },
    scale: {
      x: 1 / 2,
      x_formula: 'aspect',
      y: 1 / 2,
      y_formula: 'aspect',
      z: 1.0,
      z_formula: '1.0'
    },
    translate: {
      x: 0.0,
      x_formula: '0.0',
      y: 0.0,
      y_formula: '0.0',
      z: 0.0,
      z_formula: '0.0'
    },
    size: {
      x: 0.0,
      x_formula: 'meshWidth',
      y: 0.0,
      y_formula: 'meshHeight',
      z: 0.0,
      z_formula: '0.0'
    },
    grunge: {
      gOpacity: 50,
      gOpacity_formula: 'gOpacity / 100',
      gColor: 0xbababa,
      gColor_formula: '0xbababa'
    },
    ...data
  }
}

export function initLoad () {
  return new Promise((resolve, reject) => {
    backend.getStyles().then((data) => {
      // console.log(data)
      __styleContainer.data = data
      polyfill(__styleContainer.data)
      useRealtime()
        .then(() => {
          resolve()
          __styleContainer.ready = true
        })
    }).catch(() => {
      useRealtime()
        .then(() => {
          resolve()
          __styleContainer.ready = true
        })
    })
  })
}

function useRealtime () {
  return new Promise((resolve, reject) => {
    if (backend.appState.useCMS) {
      backend.readyRT()
      .then(() => {
        var ref = backend.api.db.ref('/cms-data/styles')
        ref.on('value', function (snapshot) {
          var val = snapshot.val()
          __styleContainer.data = backend.transform(val)
          polyfill(__styleContainer.data)
          __styleContainer.random = Math.random()
          console.log(__styleContainer.data)
          resolve()
        })
      })
    } else {
      resolve()
    }
  })
}

function polyfill (array) {
  array.forEach((item, key) => {
    array[key] = getTemplate({ name: item.name, data: item })
  })
}

export function createVisalSetting (obj) {
  if (backend.appState.useCMS) {
    backend.readyRT().then(() => {
      backend.api.db.ref(`/cms-data/styles/${obj.name}`).set(obj)
    })
  }
}

export function updateVisualSetting (key, obj) {
  if (backend.appState.useCMS) {
    backend.readyRT().then(() => {
      var updates = {}
      updates[`${key}`] = backend.cleanKey(obj)
      backend.api.db.ref('/cms-data/styles/').update(updates)
    })
  }
}

export function updateVS (obj) {
  // if (obj.scale.x_formula) {
  //   obj.scale.x = Parser.evaluate(obj.scale.x_formula, { x: 3 }) || 1
  // }
  // if (obj.scale.y_formula) {
  //   obj.scale.y = Parser.evaluate(obj.scale.y_formula, { x: 3 }) || 1
  // }
  updateVisualSetting(obj['.key'], obj)
}

export const llvmsMesh = {
  props: [
    'vms'
  ],
  data () {
    return {
      vmsObj: null,
      localRefresher: 0,
      __styleContainer
    }
  },
  mounted () {
    // if (this.vms) {
    //   this.mesh.visible = false
    // }
    this.mesh.userData.$component = this
    this.__llvms__updateVMSObjRef()
  },
  computed: {
    finalPosition () {
      if (this.vmsObj) {
        var rectInfo = this.__llvms__getRect({ vms: this.vmsObj })
        var params = { ...rectInfo, ...this.vmsObj.position }
        try {
          var ans = {
            x: Parser.evaluate(this.vmsObj.position.x_formula || ('0.0'), params),
            y: Parser.evaluate(this.vmsObj.position.y_formula || ('0.0'), params),
            z: Parser.evaluate(this.vmsObj.position.z_formula || ('0.0'), params)
          }
          this.$emit('final-position', { pos: ans, params })
          return ans
        } catch (e) {
          return false
        }
      } else {
        return this.position
      }
    },
    finalScale () {
      if (this.vmsObj) {
        var rectInfo = this.__llvms__getRect({ vms: this.vmsObj })
        var params = { ...rectInfo, ...this.vmsObj.scale }
        try {
          return {
            x: Parser.evaluate(this.vmsObj.scale.x_formula || ('0.5'), params),
            y: Parser.evaluate(this.vmsObj.scale.y_formula || ('0.5'), params),
            z: Parser.evaluate(this.vmsObj.scale.z_formula || ('1.0'), params)
          }
        } catch (e) {
          return false
        }
      } else {
        return this.scale
      }
    },
    finalTranslate () {
      if (this.vmsObj) {
        var rectInfo = this.__llvms__getRect({ vms: this.vmsObj })
        var params = { ...rectInfo, ...this.vmsObj.translate }
        try {
          return {
            x: Parser.evaluate(this.vmsObj.translate.x_formula || ('0.0'), params),
            y: Parser.evaluate(this.vmsObj.translate.y_formula || ('0.0'), params),
            z: Parser.evaluate(this.vmsObj.translate.z_formula || ('0.0'), params)
          }
        } catch (e) {
          return false
        }
      } else {
        return this.translate
      }
    },
    finalSize () {
      if (this.vmsObj && this.vmsObj.size) {
        var rectInfo = this.__llvms__getRect({ vms: this.vmsObj })
        var params = { ...rectInfo, ...this.vmsObj.size }
        try {
          return {
            x: Parser.evaluate(this.vmsObj.size.x_formula || ('0.0'), params),
            y: Parser.evaluate(this.vmsObj.size.y_formula || ('0.0'), params),
            z: Parser.evaluate(this.vmsObj.size.z_formula || ('0.0'), params)
          }
        } catch (e) {
          return false
        }
      } else {
        return {
          x: this.sWidth,
          y: this.sHeight,
          z: this.sDepth
        }
      }
    },
    finalGrunge () {
      if (this.vmsObj && this.vmsObj.grunge) {
        var rectInfo = this.__llvms__getRect({ vms: this.vmsObj })
        var params = { ...rectInfo, ...this.vmsObj.grunge }
        try {
          return {
            gOpacity: Parser.evaluate(this.vmsObj.grunge.gOpacity_formula || ('0.0'), params),
            gColor: Parser.evaluate(this.vmsObj.grunge.gColor_formula || ('0.0'), params)
          }
        } catch (e) {
          return false
        }
      } else {
        return {
          gOpacity: this.gOpacity,
          gColor: this.color
        }
      }
    },
    readRectInfo () {
      var rectInfo = this.__llvms__getRect({ vms: this.vmsObj })
      return rectInfo
    },
    __llvms__readyStyles () {
      if (this.__styleContainer) {
        return this.__styleContainer.ready
      }
      return __styleContainer.ready
    },
    __llvms__styleRemoteRefresh () {
      if (this.__styleContainer) {
        return this.__styleContainer.random
      }
      return __styleContainer.random
    },
    __llvms__styles () {
      if (this.__styleContainer) {
        return this.__styleContainer.data
      }
      return __styleContainer.data
    },
    __llvms__vmsLocalRefresh () {
      if (this.vmsObj) {
        return JSON.stringify(this.vmsObj) + this.localRefresher
      }
    },
    __llvms__vmsRemoteRefresh () {
      if (this.vmsObj) {
        return JSON.stringify(this.__llvms__styleRemoteRefresh)
      }
    }
  },
  watch: {
    __llvms__readyStyles () {
      // if (this.vms) {
      //   this.mesh.visible = this.visible
      // }
      this.__llvms__updateVMSObjRef()
    },
    __llvms__vmsRemoteRefresh () {
      this.__llvms__updateVMSObjRef()
      this.__llvms__update()
    },
    __llvms__vmsLocalRefresh () {
      this.__llvms__update()
    }
  },
  activated () {
    this.__llvms__updateVMSObjRef()
  },
  methods: {
    loadVMS () {
      this.__llvms__updateVMSObjRef()
    },
    __llvms__updateVMSObjRef () {
      if (this.vms && this.__llvms__readyStyles) {
        let vmsObj = this.vmsObj = this.mesh.userData.vms = this.__llvms__find(this.vms)
        if (!vmsObj) {
          createVisalSetting(this.__llvms__getTemplate({ name: this.vms, data: {} }))
        }
      }
    },
    __llvms__getTemplate ({ name }) {
      return getTemplate({ name })
    },
    __llvms__find (name) {
      return this.__llvms__styles.filter((item) => {
        return item.name === name
      })[0]
    },
    __llvms__getAspect () {
      var aspect = this.aspect ||
                    this.$parent.aspect ||
                    this.$parent.$parent.aspect ||
                    this.$parent.$parent.$parent.aspect ||
                    this.$parent.$parent.$parent.$parent.aspect ||
                    this.$parent.$parent.$parent.$parent.$parent.aspect ||
                    this.$parent.$parent.$parent.$parent.$parent.$parent.aspect
      return aspect
    },
    __llvms__getCamera () {
      var camera = this.camera ||
                    this.$parent.camera ||
                    this.$parent.$parent.camera ||
                    this.$parent.$parent.$parent.camera ||
                    this.$parent.$parent.$parent.$parent.camera ||
                    this.$parent.$parent.$parent.$parent.$parent.camera ||
                    this.$parent.$parent.$parent.$parent.$parent.$parent.camera
      return camera
    },
    __llvms__getRect ({ vms }) {
      var aspect = this.__llvms__getAspect()
      var camera = this.__llvms__getCamera()

      var meshWidth = this.sWidth
      var meshHeight = this.sHeight

      var dist = camera.position.z - (vms.position.z || 0.0)
      var vFOV = THREE.Math.degToRad(camera.fov) // convert vertical fov to radians
      var screenHeight = 2 * Math.tan(vFOV / 2) * dist // visible height
      var screenWidth = screenHeight * aspect // visible width

      var left = -screenWidth * 0.5
      var top = screenHeight * 0.5
      var bottom = -top
      var right = -left

      var api = {
        top,
        left,
        right,
        bottom,
        aspect,
        screenHeight,
        screenWidth,
        meshWidth,
        meshHeight,
        scaleX: 0.5,
        scaleY: 0.5,
        scaleZ: 1.0
      }

      try {
        api.scaleX = Parser.evaluate(vms.scale.x_formula || ('0.5'), api)
        api.scaleY = Parser.evaluate(vms.scale.y_formula || ('0.5'), api)
        api.scaleZ = Parser.evaluate(vms.scale.z_formula || ('1.0'), api)
      } catch (e) {

      }

      return api
    },
    __llvms__update () {
      // var rectInfo = this.__llvms__getRect({ z: this.vmsObj.position.z })
      // // var camera = this.__llvms__getCamera()

      // // console.log('update pos', this.__llvms__calc({ obj: this.vmsObj, key: 'position', prop: 'x' }))
      // if (this.vmsObj && this.mesh) {
      //   if (this.vmsObj.position) {
      //     this.mesh.position.set(
      //       Parser.evaluate(this.vmsObj.position.x_formula || '0.0', { ...rectInfo, ...this.vmsObj.position }),
      //       Parser.evaluate(this.vmsObj.position.y_formula || '0.0', { ...rectInfo, ...this.vmsObj.position }),
      //       Parser.evaluate(this.vmsObj.position.z_formula || '0.0', { ...rectInfo, ...this.vmsObj.position })
      //       // this.__llvms__calc({ obj: this.vmsObj, key: 'position', prop: 'x' }),
      //       // this.__llvms__calc({ obj: this.vmsObj, key: 'position', prop: 'y' }),
      //       // this.__llvms__calc({ obj: this.vmsObj, key: 'position', prop: 'z' })
      //     )
      //   }
      //   if (this.vmsObj.scale) {
      //     this.mesh.scale.set(
      //       Parser.evaluate(this.vmsObj.scale.x_formula || '1.0', { ...rectInfo, ...this.vmsObj.scale }),
      //       Parser.evaluate(this.vmsObj.scale.y_formula || '1.0', { ...rectInfo, ...this.vmsObj.scale }),
      //       Parser.evaluate(this.vmsObj.scale.z_formula || '1.0', { ...rectInfo, ...this.vmsObj.scale })
      //       // this.__llvms__calc({ obj: this.vmsObj, key: 'scale', prop: 'x' }),
      //       // this.__llvms__calc({ obj: this.vmsObj, key: 'scale', prop: 'y' }),
      //       // this.__llvms__calc({ obj: this.vmsObj, key: 'scale', prop: 'z' })
      //     )
      //   }

      //   // if (this.vmsObj.transform) {
      //   //   this.mesh.transform.set(
      //   //     Parser.evaluate(this.vmsObj.transform.x_formula || '1.0', { ...rectInfo, ...this.vmsObj.transform }),
      //   //     Parser.evaluate(this.vmsObj.transform.y_formula || '1.0', { ...rectInfo, ...this.vmsObj.transform }),
      //   //     Parser.evaluate(this.vmsObj.transform.z_formula || '1.0', { ...rectInfo, ...this.vmsObj.transform })
      //   //     // this.__llvms__calc({ obj: this.vmsObj, key: 'scale', prop: 'x' }),
      //   //     // this.__llvms__calc({ obj: this.vmsObj, key: 'scale', prop: 'y' }),
      //   //     // this.__llvms__calc({ obj: this.vmsObj, key: 'scale', prop: 'z' })
      //   //   )
      //   // }
      // }
    },
    __llvms__calc ({ obj, key, prop }) {
      var mode = obj[key][prop + '_mode']
      var aspect = this.__llvms__getAspect()

      if (!mode || mode === 'normal') {
        return parseFloat(obj[key][prop])
      } else if (mode === 'aspect') {
        return parseFloat(obj[key][prop]) * aspect
      }
    }
  }
}
