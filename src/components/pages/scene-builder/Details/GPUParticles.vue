<template>
<div ref="toucher">

  <OrbitControls v-if="camera" :toucher="$refs['toucher']" :camera="camera" @controls="(v) => { orbit = v }" />
  <PerspectiveCamera
    :fov="75"
    :aspect="size.aspect"
    :near="0.1"
    :far="1000"
    :position="cam.pos"
    @camera="(v) => { camera = v; }"
  />

  <Scene @scene="(v) => { scene = v }">

    <SceneReader :doc="doc" ref="sceneReader" />

    <Object3D
      :pz="0.0" :py="0.0" :px="0.0"
      :rz="0.0" :ry="0.0" :rx="0.0"
      :sz="0.1" :sy="0.1" :sx="0.1"
    >
      <GPUParticles
        v-if="renderer && camera && scene"
        :renderer="renderer"
        :camera="camera"
        :scene="scene"
        @gpgpu="(v) => { gpuParticles = v }"
      ></GPUParticles>
    </Object3D>
  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import SceneReader from './SceneReader'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
/* eslint-disable */
// import 'imports-loader?THREE=three!three/examples/js/shaders/FresnelShader.js'
/* eslint-enable */
import GPUParticles from './GPUParticles/GPUParticles.vue'

export default {
  THREE,
  components: {
    SceneReader,
    GPUParticles,
    ...Bundle
  },
  props: {
    size: {},
    renderer: {},
    doc: {}
  },
  data () {
    return {
      orbit: false,
      mpos: {
        x: 0, y: 0
      },
      cam: {
        pos: { x: 0, y: 0, z: 0 }
      },
      gpuParticles: false,
      ready: false,
      visible: true,
      resizer: () => {},
      scene: false,
      camera: false
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
    ready () {
      if (this.ready) {
        this.setup()
      }
    },
    orbit () {
      if (this.orbit) {
        this.orbit.enableDamping = true
        this.orbit.domElement.addEventListener('mousemove', (evt) => {
          evt.preventDefault()
          this.mpos.x = (evt.clientX / this.size.width) * 2.0 - 1
          this.mpos.y = -(evt.clientY / this.size.width) * 2.0 + 1
        }, false)
        this.orbit.domElement.addEventListener('touchstart', (evt) => {
          if (evt.touches.length === 3) {
            this.orbit.enablePan = false
          }
        }, false)
        this.orbit.domElement.addEventListener('touchmove', (evt) => {
          evt.preventDefault()
          if (evt.touches.length === 3) {
            this.mpos.x = (evt.touches[0].clientX / this.size.width) * 2.0 - 1
            this.mpos.y = -(evt.touches[0].clientY / this.size.width) * 2.0 + 1
          }
        }, false)
        this.orbit.domElement.addEventListener('touchend', () => {
          this.orbit.enablePan = true
        })
      }
    }
  },
  methods: {
    setup () {
    },
    renderWebGL () {
      TWEEN.update()
      if (this.refractionBox) {
        this.refractionBox.rotation.x -= 0.01
        this.refractionBox.rotation.y += 0.01
      }
      if (this.$refs.sceneReader) {
        this.$refs.sceneReader.funcRunner()
      }

      if (this.gpuParticles) {
        if (this.gpuParticles.updateMouse) {
          this.gpuParticles.updateMouse(this.mpos.x, this.mpos.y)
        }
        this.gpuParticles.update()
      }

      if (this.orbit) {
        this.orbit.update()
      }

      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  activated () {
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

