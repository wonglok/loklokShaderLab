<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  data () {
    return {
      geometry: null
    }
  },
  created () {
    this.geometry = new THREE.BoxGeometry(2, 2, 2, 10, 10, 10)
    // this.geometry
    this.$emit('geometry', this.geometry)
  },
  watch: {
  },
  mounted () {
    this.$parent.__add(this.geometry, 'geometry')
  },
  beforeDestroy () {
    this.$parent.__remove(this.geometry, 'geometry')
  }
}
</script>

<style scoped>
.box-geometry{
  display: none;
}
</style>
