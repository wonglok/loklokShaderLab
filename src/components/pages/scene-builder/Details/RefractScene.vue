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

    <Object3D
      @element="(v) => { wrapper = v }"
      :px="0.0" :py="0.0" :pz="0.0"
      :rx="0.0" :ry="0.0" :rz="0.0"
      :sx="1.0" :sy="1.0" :sz="1.0"
    >
      <SceneReader :doc="doc" ref="sceneReader" />
    </Object3D>

    <CubeTexture
      :items="[
        require('../textures/cubemap/walk/px.png'), require('../textures/cubemap/walk/nx.png'),
        require('../textures/cubemap/walk/py.png'), require('../textures/cubemap/walk/ny.png'),
        require('../textures/cubemap/walk/pz.png'), require('../textures/cubemap/walk/nz.png')
      ]"
      @cube-texture="(v) => { cubeTexture = v }"
    ></CubeTexture>

    <CubeCamera
      v-if="renderer && scene"
      @cube-camera="(v) => { cubeCamera = v }"
      :near="0.1"
      :far="5000"
      :resolution="1024"
    />

    <Object3D
      :px="0.0" :py="0.0" :pz="4"
      :rx="0.0" :ry="0.0" :rz="0.0"
      :sx="1.0" :sy="1.0" :sz="1.0"
    >
      <Mesh @element="(v) => { refractionBox = v }">
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
import SceneReader from './SceneReader'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/shaders/FresnelShader.js'
/* eslint-enable */

export default {
  THREE,
  components: {
    SceneReader,
    ...Bundle
  },
  props: {
    size: {},
    renderer: {},
    doc: {}
  },
  data () {
    return {
      wrapper: false,
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
    },
    cubeCamera () {
      this.trySetupReFraction()
    }
  },
  methods: {
    trySetupReFraction () {
      if (this.cubeTexture && this.refractionBox && this.cubeCamera) {
        // this.renderer.setClearColor(0xeeeeee)
        // this.renderer.setFaceCulling(THREE.CullFaceNone)
        // this.cubeTexture.format = THREE.RGBFormat

        this.scene.matrixAutoUpdate = false
        this.scene.background = this.cubeTexture
        this.cubeTexture.needsUpdate = true

        // var shader = THREE.FresnelShader
        // var uniforms = THREE.UniformsUtils.clone(shader.uniforms)
        var uniforms = {
          'mRefractionRatio': { value: 1.02 },
          'mFresnelBias': { value: 0.1 },
          'mFresnelPower': { value: 2.0 },
          'mFresnelScale': { value: 1.0 },
          'tCube': { value: null },
          'time': { value: 0 }
        }
        // this.cubeCamera.renderTarget.texture.mapping = THREE.CubeRefractionMapping
        // this.cubeCamera.renderTarget.texture.flipY = true
        uniforms['tCube'].value = this.cubeCamera.renderTarget.texture

        let material = new THREE.ShaderMaterial({
          uniforms: uniforms,

          vertexShader: require('./WoozyShaders/Solid.vert'),
          fragmentShader: require('./WoozyShaders/Solid.frag'),

          // vertexShader: shader.vertexShader,
          // fragmentShader: shader.fragmentShader,
          // side: THREE.Double,
          mapping: THREE.CubeRefractionMapping
        })
        this.refractionBox.material = material

        // let material = this.refractionBox.material
        // material.color = new THREE.Color(0xeeeeee)
        // material.refractionRatio = 0.98
        // material.reflectionRatio = 0.98
        // material.envMap = this.cubeTexture
        // material.envMap.mapping = THREE.CubeRefractionMapping
        // material.needsUpdate = true
      }
    },
    setup () {
      // this.scene.background
      // this.renderer.setClearColor(0xeeeeee)
    },
    renderWebGL () {
      TWEEN.update()
      // if (this.refractionBox) {
      //   this.refractionBox.rotation.x -= 0.01
      //   this.refractionBox.rotation.y += 0.01
      // }
      if (this.$refs.sceneReader) {
        this.$refs.sceneReader.funcRunner()
      }
      if (this.refractionBox && this.refractionBox.material.uniforms) {
        this.refractionBox.material.uniforms.time.value = window.performance.now() / 1000
      }
      if (this.cubeCamera && this.refractionBox && this.wrapper) {
        // this.cubeCamera.rotation.z = -3.1415
        // this.cubeCamera.position.z = this.camera.position.z
        // this.cubeCamera.rotation.copy(this.camera.rotation)
        this.refractionBox.visible = false
        this.wrapper.scale.x = -1
        this.cubeCamera.position.copy(this.refractionBox.parent.position)

        this.cubeCamera.update(this.renderer, this.scene)
        this.wrapper.scale.x = 1
        this.refractionBox.visible = true
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

