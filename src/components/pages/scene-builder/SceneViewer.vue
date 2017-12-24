<template>
  <div ref="full">

    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <OrbitControls v-if="renderer && camera || ready" :renderer="renderer" :camera="camera" />

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="0.1"
      :far="1000"
      :position="cam.pos"
      @camera="(v) => { camera = v; }"
    />

    <!-- <CubeCamera
      :near="0.1"
      :far="100000"
      :cubeResolution="1024"
      @cubeCamera="(v) => { cubeCamera = v; }"
    /> -->

    <Scene @scene="(v) => { scene = v }">

      <Refractor :position="{ x: 0, y: 0, z: 3 }" ref="refractor" />

      <Object3D
        :pz="lig.p.z" :py="lig.p.y" :px="lig.p.x"
        :rz="lig.r.z" :ry="lig.r.y" :rx="lig.r.x"
        :sz="lig.s.z" :sy="lig.s.y" :sx="lig.s.x"

        :key="iLight" v-for="(lig, iLight) in lights"
      >
        <component v-bind:is="lig.lightType" :ref="'light-' + iLight" />
      </Object3D>

      <Object3D
        :visible="visible"
        :pz="fx.p.z" :py="fx.p.y" :px="fx.p.x"
        :rz="fx.r.z" :ry="fx.r.y" :rx="fx.r.x"
        :sz="fx.s.z" :sy="fx.s.y" :sx="fx.s.x"

        :key="iFX" v-for="(fx, iFX) in shaderFXs"
        :ref="'obj-' + iFX"
      >
        <!-- <Object3D> -->
          <!-- <Object3D> -->
            <component v-bind:is="fx.elementType" :ref="'el-' + iFX">
              <component v-bind:is="fx.geometry" v-if="fx.geometry" />
              <component v-bind:is="fx.material" v-if="fx.material" :uniforms="fx.shader.uniforms" :vs="fx.shader.vs" :fs="fx.shader.fs" />
            </component>
          <!-- </Object3D> -->
        <!-- </Object3D> -->
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import * as THREE from 'three'

import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
export default {
  THREE,
  components: {
    ...Bundle
  },
  props: {
    using: {},
    doc: {}
  },
  computed: {
    lights () {
      return this.doc.current.lights
    },
    shaderFXs () {
      return this.doc.current.shaderFXs
    }
  },
  watch: {
    camera () {
      if (this.camera && this.renderer) {
        this.ready = true
      }
    },
    renderer () {
      if (this.camera && this.renderer) {
        this.ready = true
      }
    },
    using () {
      this.resizer()
    }
  },
  methods: {
    renderWebGL () {
      TWEEN.update()
      this.renderColor()
      this.funcRunner()
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    renderColor () {
      this.renderer.setClearColor(0xeeeeee)
    },
    funcRunner () {
      this.shaderFXs.forEach((fx, iFX) => {
        if (fx.shader.run && fx.shader.run.toString().indexOf(fx.shader.updateFn) !== -1) {
          fx.shader.run()
        } else {
          try {
            /* eslint-disable */
            fx.shader.update = new Function('uniforms', 'element', fx.shader.updateFn)
            /* eslint-enable */
          } catch (e) {
            console.log(e)
          }
          // console.log(this.$refs['el-' + iFX][0])
          fx.shader.run = () => {
            fx.shader.update(fx.shader.uniforms, this.$refs['el-' + iFX][0].element)
          }
          fx.shader.run()
        }
      })
    },
    funz (iFX) {
      var el = this.$refs['refractor'].refractor
      return new Promise((resolve, reject) => {
        let tween1 = new TWEEN.Tween(el.scale)
          .to({ y: '-1' }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)

        let tween2 = new TWEEN.Tween(el.scale)
          .to({ y: '+1' }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(resolve)

        tween1.chain(tween2)
        tween2.chain(tween1)
        tween1.start()
      })
    },
    async animate () {
      this.funz(0)
    }
  },
  data () {
    return {
      cam: {
        pos: { x: -10, y: 0, z: 10 }
      },
      ready: false,
      cubeCamera: false,
      visible: true,
      resizer: () => {},
      size: {
        width: 100,
        height: 100,
        aspect: 1
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  mounted () {
    this.animate()

    var resizer = this.resizer = () => {
      this.$nextTick(() => {
        var rect = this.$refs.full.getBoundingClientRect()
        this.size = {
          width: rect.width,
          height: rect.height,
          aspect: rect.width / rect.height
        }
      })
    }
    window.addEventListener('resize', resizer.bind(this))
    resizer()

    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
