<template>
  <div ref="full">

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

      <Object3D :pz="fx.pz" :py="fx.py" :px="fx.px" :key="iFX" v-for="(fx, iFX) in shaderFXs">
        <Object3D>
          <Object3D>
            <component v-bind:is="fx.elementType">
              <component v-bind:is="fx.geometry" />
              <ShaderMaterial :uniforms="fx.shader.uniforms" :vs="fx.shader.vs" :fs="fx.shader.fs" />
            </component>
          </Object3D>
        </Object3D>
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
export default {
  components: {
    ...Bundle
  },
  props: {
    doc: {}
  },
  computed: {
    shaderFXs () {
      return this.doc.current.shaderFXs
    }
  },
  methods: {
    renderWebGL () {
      this.shaderFXs.forEach((fx) => {
        fx.shader.run()
      })
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  },
  data () {
    return {
      size: {
        width: 100,
        height: 100,
        aspect: 1
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {

  },
  mounted () {
    var resizer = () => {
      var rect = this.$refs.full.getBoundingClientRect()
      this.$nextTick(() => {
        this.size = {
          width: rect.width,
          height: rect.height,
          aspect: rect.width / rect.height
        }
      })
    }
    window.addEventListener('resize', resizer)
    resizer()

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
