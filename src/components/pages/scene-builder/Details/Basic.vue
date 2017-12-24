<template>
<div ref="toucher">

  <OrbitControls v-if="camera" :toucher="$refs['toucher']" :camera="camera" />

  <PerspectiveCamera
    :fov="75"
    :aspect="size.aspect"
    :near="0.1"
    :far="1000"
    :position="cam.pos"
    @camera="(v) => { camera = v; }"
  />

  <Scene @scene="(v) => { scene = v }">

    <!-- <CubeCamera
      v-if="renderer && scene"
      ref="cube-camera"
      @cube-camera="(v) => { cubeCamera = v }"
      :near="0.1"
      :far="100000"
      :cubeResolution="1024"
      :renderer="renderer"
      :scene="scene"
    /> -->

    <!-- <Refractor :position="{ x: 0, y: 0, z: 3 }" ref="refractor" /> -->

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
    size: {},
    renderer: {},
    doc: {}
  },
  data () {
    return {
      cam: {
        pos: { x: -3, y: 0, z: 10 }
      },
      ready: false,
      cubeCamera: false,
      visible: true,
      resizer: () => {},
      scene: false,
      camera: false
    }
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
    },
    ready () {
      if (this.ready) {
        this.setup()
      }
    },
    cubeCamera () {
      // this.scene.background = this.cubeCamera.renderTarget.texture
    }
  },
  methods: {
    setup () {
      this.renderer.setClearColor(0xeeeeee)
    },
    renderWebGL () {
      TWEEN.update()
      if (this.scene && this.camera && this.renderer) {
        this.funcRunner()
        this.renderer.render(this.scene, this.camera)
      }
    },
    funcRunner () {
      this.shaderFXs.forEach((fx, iFX) => {
        if (fx.shader.run && fx.shader.update.toString().indexOf(fx.shader.updateFn) !== -1) {
          fx.shader.run.call(this)
        } else {
          try {
            /* eslint-disable */
            fx.shader.update = new Function('uniforms', 'element', fx.shader.updateFn)
            /* eslint-enable */
          } catch (e) {
            console.log(e)
          }
          // console.log(this.$refs['el-' + iFX][0])
          fx.shader.run = function () {
            if (this.$refs['el-' + iFX][0]) {
              fx.shader.update(fx.shader.uniforms, this.$refs['el-' + iFX][0].element)
            }
          }
          fx.shader.run.call(this)
        }
      })
    }
  },
  activated () {
    // this.$nextTick(() => {
    //   this.$refs['refractor'].animate()
    // })
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  deactivated () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style>

</style>

