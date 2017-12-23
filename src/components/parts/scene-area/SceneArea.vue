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
    <Points>
      <SphereBufferGeometry />
      <MeshBasicMaterial :color="0xff00ff" :opacity="1" />
    </Points>
  </Scene>

</div>
</template>

<script>
import Bundle from './ThreeJS/Bundle'
export default {
  components: {
    ...Bundle
  },
  data () {
    return {
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

  },
  mounted () {
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  methods: {
    renderWebGL () {
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
