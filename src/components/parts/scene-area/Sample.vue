<template>
  <div class="full">

    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="{ x: 0, y: 0, z: 10 }"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v }">
      <PointLight />

      <!-- <Object3D :pz="-10">
        <Points>
          <SphereBufferGeometry />
          <MeshBasicMaterial :color="0xff00ff" :opacity="1" />
        </Points>
      </Object3D> -->

      <Object3D :pz="fx.pz" :key="iFX" v-for="(fx, iFX) in shaderFXs">
        <Points :ref="'pts-' + iFX">
          <SphereBufferGeometry />
          <ShaderMaterial :uniforms="fx.uniforms" :vs="fx.vs" :fs="fx.fs" />
        </Points>
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import * as Vuex from 'vuex'
import Bundle from './ThreeJS/Bundle'
export default {
  components: {
    ...Bundle
  },
  computed: {
    ...Vuex.mapGetters({
      'shader': 'shaders/shader',
      'shaders': 'shaders/shaders'
    })
  },
  methods: {
    ...Vuex.mapActions({
      'saveJSON': 'shaders/saveJSON',
      'restoreJSON': 'shaders/restoreJSON'
    }),
    ...Vuex.mapMutations({
      'addShader': 'shaders/add',
      'removeShader': 'shaders/remove'
    }),
    renderWebGL () {
      this.shaderFXs.forEach((fx) => {
        fx.run()
      })
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    addFx (shaderID) {
      this.addShader({
        id: shaderID
      })
      this.shaderFXs.push({
        pz: -5,
        ...this.shader(shaderID)
      })
    }
  },
  data () {
    return {
      shaderFXs: [],
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {
    this.shaderFXs.push({
      pz: -10,
      ...this.shader('abc')
    })
  },
  mounted () {
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
