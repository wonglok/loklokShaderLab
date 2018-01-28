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
  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
// import LightPaint from './LightPaint/LightPaint.vue'
// import SceneReader from './SceneReader'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
/* eslint-disable */
// import 'imports-loader?THREE=three!three/examples/js/shaders/FresnelShader.js'
/* eslint-enable */

export default {
  THREE,
  components: {
    // LightPaint,
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
        pos: { x: 3, y: 5, z: 20 }
      },
      planes: [],
      lights: [],
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
        // this.renderer.gammaInput = true
        // this.renderer.gammaOutput = true
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
      this.makePlane({
        pos: new THREE.Vector3(0, 0, 0),
        opacity: 0.5
      })
      this.makePlane({
        pos: new THREE.Vector3(0, 0, -5.0),
        opacity: 0.7
      })
      this.makePlane({
        pos: new THREE.Vector3(0, 0, -10.0),
        opacity: 0.9
      })

      this.makeLight({
        id: 'l1',
        pos: new THREE.Vector3(20, 20, 20),
        color: new THREE.Color(0xff0000)
      })

      this.makeLight({
        id: 'l2',
        pos: new THREE.Vector3(-20, 20, 20),
        color: new THREE.Color(0x0000ff)
      })

      this.makeLight({
        id: 'l3',
        pos: new THREE.Vector3(10, -20, 20),
        color: new THREE.Color(0x00ff00)
      })
    },
    makePlane ({ pos, opacity }) {
      var geometry = new THREE.PlaneBufferGeometry(20, 20, 1.0, 1.0)
      var material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity
      })
      var plane = new THREE.Mesh(geometry, material)
      plane.position.copy(pos)
      this.scene.add(plane)

      //
      this.planes.push(plane)
    },
    makeLight ({ pos, color }) {
      var light = new THREE.PointLight(color, 1, 100)
      light.position.copy(pos)
      this.scene.add(light)

      //
      this.lights.push(light)
    },
    run () {
      var time = Date.now() * 0.0005
      this.lights[0].position.x = Math.sin(time * 0.7) * 25
      this.lights[0].position.y = Math.cos(time * 0.5) * 30
      // this.lights[0].position.z = Math.cos(time * 0.3) * 30

      this.lights[1].position.x = Math.cos(time * 0.3) * 10
      this.lights[1].position.y = Math.sin(time * 0.5) * 40
      // this.lights[0].position.z = Math.sin(time * 0.3) * 20

      this.lights[2].position.x = Math.sin(time * 0.9) * 30
      this.lights[2].position.y = Math.sin(time * 0.5) * 25
      // this.lights[0].position.z = Math.cos(time * 0.3) * 30
    },
    renderWebGL () {
      TWEEN.update()
      this.run()

      // if (this.paint) {
      //   this.paint.update()
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

