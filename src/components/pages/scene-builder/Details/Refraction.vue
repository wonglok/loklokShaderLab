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

    <CubeTexture
      :items="[
        require('../textures/cubemap/walk/px.png'), require('../textures/cubemap/walk/nx.png'),
        require('../textures/cubemap/walk/py.png'), require('../textures/cubemap/walk/ny.png'),
        require('../textures/cubemap/walk/pz.png'), require('../textures/cubemap/walk/nz.png')
      ]"
      @cube-texture="(v) => { cubeTexture = v }"
    ></CubeTexture>

    <Mesh @element="(v) => { refractionBox = v }">
      <BoxBufferGeometry></BoxBufferGeometry>
      <MeshBasicMaterial></MeshBasicMaterial>
    </Mesh>

  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/shaders/FresnelShader.js'
/* eslint-enable */

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
      refractionBox: false,
      cubeTexture: false,
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
    refractionBox () {
      this.trySetupReFraction()
    },
    cubeTexture () {
      this.trySetupReFraction()
    }
  },
  methods: {
    trySetupReFraction () {
      if (this.cubeTexture && this.refractionBox) {
        // this.renderer.setClearColor(0xeeeeee)
        // this.renderer.setFaceCulling(THREE.CullFaceNone)
        this.scene.background = this.cubeTexture
        this.cubeTexture.format = THREE.RGBFormat
        this.cubeTexture.needsUpdate = true

        let material = this.refractionBox.material
        material.color = new THREE.Color(0xeeeeee)
        material.refractionRatio = 0.98
        material.reflectionRatio = 0.98
        material.envMap = this.cubeTexture
        material.envMap.mapping = THREE.CubeRefractionMapping
        material.needsUpdate = true
      }
    },
    setup () {
      // this.scene.background
      // this.renderer.setClearColor(0xeeeeee)
    },
    renderWebGL () {
      TWEEN.update()
      if (this.refractionBox) {
        this.refractionBox.rotation.x -= 0.01
        this.refractionBox.rotation.y += 0.01
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

