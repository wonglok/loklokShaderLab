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
        require('../textures/cubemap/home/px.png'), require('../textures/cubemap/home/nx.png'),
        require('../textures/cubemap/home/py.png'), require('../textures/cubemap/home/ny.png'),
        require('../textures/cubemap/home/pz.png'), require('../textures/cubemap/home/nz.png')
      ]"
      @cube-texture="(v) => { cubeTexture = v }"
    ></CubeTexture>

    <Object3D
      :pz="0.0" :py="0.0" :px="-4"
      :rz="0.0" :ry="0.0" :rx="0.0"
      :sz="1.0" :sy="1.0" :sx="1.0"
    >
      <Points @element="(v) => { refractionElementAlpha = v }">
        <SphereBufferGeometry></SphereBufferGeometry>
        <MeshBasicMaterial></MeshBasicMaterial>
      </Points>
    </Object3D>

    <Object3D
      :pz="0.0" :py="0.0" :px="0"
      :rz="0.0" :ry="0.0" :rx="0.0"
      :sz="1.0" :sy="1.0" :sx="1.0"
    >
      <Points @element="(v) => { refractionElementBeta = v }">
        <SphereBufferGeometry></SphereBufferGeometry>
        <MeshBasicMaterial></MeshBasicMaterial>
      </Points>
    </Object3D>

    <Object3D
      :pz="0.0" :py="0.0" :px="4"
      :rz="0.0" :ry="0.0" :rx="0.0"
      :sz="1.0" :sy="1.0" :sx="1.0"
    >
      <Mesh @element="(v) => { refractionElementGama = v }">
        <SphereBufferGeometry></SphereBufferGeometry>
        <MeshBasicMaterial></MeshBasicMaterial>
      </Mesh>
    </Object3D>


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
      refractionElementGama: false,
      refractionElementBeta: false,
      refractionElementAlpha: false,
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
    refractionElementAlpha () {
      this.trySetupReFraction()
    },
    cubeTexture () {
      this.trySetupReFraction()
    }
  },
  methods: {
    trySetupReFraction () {
      if (this.cubeTexture && this.refractionElementAlpha && this.refractionElementBeta && this.refractionElementGama) {
        // this.renderer.setClearColor(0xeeeeee)
        // this.renderer.setFaceCulling(THREE.CullFaceNone)
        this.scene.background = this.cubeTexture
        this.cubeTexture.format = THREE.RGBFormat
        this.cubeTexture.needsUpdate = true

        var uniforms = {
          'mRefractionRatio': { value: 1.02 },
          'mFresnelBias': { value: 0.1 },
          'mFresnelPower': { value: 2.0 },
          'mFresnelScale': { value: 1.0 },
          'tCube': { value: null },
          'time': { value: 0 }
        }
        uniforms['tCube'].value = this.cubeTexture
        uniforms['tCube'].value.mapping = THREE.CubeRefractionMapping
        // let perlin = require('./WoozyShaders/Perlin.vert')

        let material1 = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: require('./WoozyShaders/Dot.vert'),
          fragmentShader: require('./WoozyShaders/Dot.frag')
        })
        let material2 = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: require('./WoozyShaders/Perlin.vert'),
          fragmentShader: require('./WoozyShaders/Perlin.frag')
        })
        let material3 = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: require('./WoozyShaders/Solid.vert'),
          fragmentShader: require('./WoozyShaders/Solid.frag')
        })
        // material.needsUpdate = true
        this.refractionElementAlpha.material = material1
        this.refractionElementBeta.material = material2
        this.refractionElementGama.material = material3
      }
    },
    setup () {
      // this.scene.background
      // this.renderer.setClearColor(0xeeeeee)
    },
    renderWebGL () {
      TWEEN.update()
      if (this.refractionElementAlpha && this.refractionElementAlpha.material.uniforms) {
        this.refractionElementAlpha.material.uniforms.time.value = window.performance.now() / 1000
      }
      if (this.refractionElementAlpha) {
        // this.refractionElementAlpha.rotation.x -= 0.01
        this.refractionElementAlpha.rotation.y += 0.01
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

