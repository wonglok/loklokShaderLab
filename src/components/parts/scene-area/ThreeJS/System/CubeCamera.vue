<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: ['near', 'far', 'cubeResolution', 'position'],
  data () {
    return {
      camera: null
    }
  },
  created () {
    this.camera = new THREE.CubeCamera(this.near, this.far, this.cubeResolution)

    if (this.position) {
      this.camera.position.x = this.position.x
      this.camera.position.y = this.position.y
      this.camera.position.z = this.position.z
    }
    this.$emit('cubeCamera', this.camera)
  },
  watch: {
    position () {
      if (this.position) {
        this.camera.position.x = this.position.x
        this.camera.position.y = this.position.y
        this.camera.position.z = this.position.z
      }
    },
    aspect () {
      if (this.camera) {
        this.camera.aspect = this.aspect
        this.camera.updateProjectionMatrix()
      }
    }
  }
}
</script>

<style scoped>
.perspective-camera{
  display: none;
}
</style>
