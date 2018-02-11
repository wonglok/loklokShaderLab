<template>
<div ref="toucher">

  <OrbitControls v-if="camera" :toucher="$refs['toucher']" :camera="camera" />

  <PerspectiveCamera
    :fov="75"
    :aspect="size.aspect"
    :near="0.1"
    :far="100000"
    :position="cam.pos"
    @camera="(v) => { camera = v; }"
  />

  <Scene @scene="(v) => { scene = v }">

    <Refractor :position="{ x: 0, y: 0, z: 3 }" ref="refractor" />
    <SceneReader :doc="doc" ref="sceneReader" />

  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
import SceneReader from './SceneReader.vue'

export default {
  THREE,
  components: {
    ...Bundle,
    SceneReader
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
    }
  },
  methods: {
    setup () {
      this.renderer.setClearColor(0xEEEEEE)
      this.$nextTick(() => {
        this.$refs['refractor'].animate()
      })
    },
    renderWebGL () {
      TWEEN.update()
      this.renderCubeCamera()
      // this.renderCubeMap()
      if (this.$refs.sceneReader) {
        this.$refs.sceneReader.funcRunner()
      }
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    renderCubeCamera () {
      if (this.cubeCamera && this.skybox) {
        this.skybox.visible = false
        this.cubeCamera.update()
        this.skybox.visible = true
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

