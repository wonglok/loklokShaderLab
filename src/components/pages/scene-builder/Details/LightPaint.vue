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
    <!-- <SceneReader :doc="doc" ref="sceneReader" /> -->

    <LightPaint @paint="(v) => { paint = v }" />

  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import LightPaint from './LightPaint/LightPaint.vue'
// import SceneReader from './SceneReader'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
/* eslint-disable */
// import 'imports-loader?THREE=three!three/examples/js/shaders/FresnelShader.js'
/* eslint-enable */

export default {
  THREE,
  components: {
    LightPaint,
    // SceneReader,
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
        pos: { x: 3, y: 5, z: 10 }
      },
      paint: false,
      ready: false,
      cubeCamera: false,
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
        this.renderer.gammaInput = true
        this.renderer.gammaOutput = true
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
    },
    renderWebGL () {
      TWEEN.update()
      if (this.paint) {
        this.paint.update()
      }
      // if (this.$refs.sceneReader) {
      //   this.$refs.sceneReader.funcRunner()
      // }
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  activated () {
    var self = this
    function loop (rAFT) {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL(rAFT)
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

