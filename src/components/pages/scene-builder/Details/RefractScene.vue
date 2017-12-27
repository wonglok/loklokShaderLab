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
      :px="2" :py="0.0" :pz="4"
      :rx="0.0" :ry="0.0" :rz="0.0"
      :sx="1.0" :sy="1.0" :sz="1.0"
    >
      <Mesh @element="(v) => { refractionBoxAlpha = v }">
        <SphereBufferGeometry></SphereBufferGeometry>
        <MeshBasicMaterial></MeshBasicMaterial>
      </Mesh>
    </Object3D>

    <Object3D
      :px="-2" :py="0.0" :pz="4"
      :rx="0.0" :ry="0.0" :rz="0.0"
      :sx="1.0" :sy="1.0" :sz="1.0"
    >
      <Mesh @element="(v) => { refractionBoxBeta = v }">
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
      refractionBoxAlpha: false,
      refractionBoxBeta: false,
      cubeTexture: false,
      cam: {
        pos: { x: 0, y: 0, z: 10 }
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
    refractionBoxAlpha () {
      this.trySetupReFraction()
    },
    refractionBoxBeta () {
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
      if (this.cubeTexture && this.refractionBoxAlpha && this.refractionBoxBeta && this.cubeCamera) {
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
          'time': { value: 0 },
          'tDudv': { value: null },
          'useDudv': { value: false }
        }
        let tDudvTexture = new THREE.TextureLoader().load(require('../textures/maps/waterdudv.jpg'))
        let uniforms1 = THREE.UniformsUtils.clone(uniforms)
        uniforms1['tCube'].value = this.cubeCamera.renderTarget.texture
        uniforms1['tDudv'].value = tDudvTexture

        let uniforms2 = THREE.UniformsUtils.clone(uniforms)
        uniforms2['tCube'].value = this.cubeCamera.renderTarget.texture
        uniforms2['tDudv'].value = tDudvTexture
        uniforms2['useDudv'].value = true

        let material1 = new THREE.ShaderMaterial({
          uniforms: uniforms1,
          vertexShader: require('./WoozyShaders/SolidPerlin.vert'),
          fragmentShader: require('./WoozyShaders/SolidPerlin.frag'),
          mapping: THREE.CubeRefractionMapping
        })
        let material2 = new THREE.ShaderMaterial({
          uniforms: uniforms2,
          vertexShader: require('./WoozyShaders/SolidPerlin.vert'),
          fragmentShader: require('./WoozyShaders/SolidPerlin.frag'),
          mapping: THREE.CubeRefractionMapping
        })
        this.refractionBoxAlpha.material = material1
        this.refractionBoxBeta.material = material2
        // let material = this.refractionBoxAlpha.material
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
      // if (this.refractionBoxAlpha) {
      //   this.refractionBoxAlpha.rotation.x -= 0.01
      //   this.refractionBoxAlpha.rotation.y += 0.01
      // }
      if (this.$refs.sceneReader) {
        this.$refs.sceneReader.funcRunner()
      }
      if (this.refractionBoxAlpha && this.refractionBoxAlpha.material.uniforms) {
        this.refractionBoxAlpha.material.uniforms.time.value = window.performance.now() / 1000
      }
      if (this.refractionBoxBeta && this.refractionBoxBeta.material.uniforms) {
        this.refractionBoxBeta.material.uniforms.time.value = window.performance.now() / 1000
      }
      if (this.cubeCamera && this.refractionBoxAlpha && this.wrapper) {
        // this.cubeCamera.rotation.z = -3.1415
        // this.cubeCamera.position.z = this.camera.position.z
        // this.cubeCamera.rotation.copy(this.camera.rotation)
        this.refractionBoxAlpha.visible = false
        this.refractionBoxBeta.visible = false
        this.wrapper.scale.x = -1
        this.cubeCamera.position.copy(this.refractionBoxAlpha.parent.position)
        this.cubeCamera.position.x = (this.refractionBoxAlpha.parent.position.x + this.refractionBoxBeta.parent.position.x) / 2
        this.cubeCamera.update(this.renderer, this.scene)
        this.wrapper.scale.x = 1
        this.refractionBoxAlpha.visible = true
        this.refractionBoxBeta.visible = true
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

