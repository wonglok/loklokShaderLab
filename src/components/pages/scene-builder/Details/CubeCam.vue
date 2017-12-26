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

    <CubeCamera
      v-if="renderer && scene && camera"
      @cube-camera="(v) => { cubeCamera = v }"
      :near="0.1"
      :far="1000000"
      :sceneCamera="camera"
      :cubeResolution="1024"
      :renderer="renderer"
      :scene="scene"
    />

    <Object3D
      :pz="0.0" :py="0.0" :px="0.0"
      :rz="0.0" :ry="0.0" :rx="0.0"
      :sz="30" :sy="30" :sx="30"
    >
      <Mesh @element="(v) => { skybox = v }">
        <SphereBufferGeometry></SphereBufferGeometry>
        <MeshBasicMaterial :color="0xeeeeee"></MeshBasicMaterial>
      </Mesh>
    </Object3D>

    <SceneReader :doc="doc" ref="sceneReader" />

  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
import SceneReader from './SceneReader'

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
      skybox: false,
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
    cubeCamera () {
      this.tryConfigSkyBox()
    },
    skybox () {
      this.tryConfigSkyBox()
    }
  },
  methods: {
    setup () {
      this.renderer.setClearColor(0xffffff)
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
    },
    tryConfigSkyBox () {
      if (this.skybox && this.cubeCamera) {
        let texture = this.cubeCamera.camera.renderTarget.texture
        this.skybox.material.envMap = texture
        this.skybox.material.side = THREE.BackSide
        this.skybox.material.needsUpdate = true
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

