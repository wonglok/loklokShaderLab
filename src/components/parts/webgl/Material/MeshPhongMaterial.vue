<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    opacity: {
      type: Number
    },
    blending: {
      default () {
        return THREE.AdditiveBlending
      }
    }
  },
  data () {
    return {
      material: null
    }
  },
  created () {
    this.material = new THREE.MeshPhongMaterial({
      color: 0xee0302,
      specular: 0xffffff,
      shininess: 1.0,
      opacity: this.opacity,
      blending: this.blending,
      transparent: true
    })
    // this.material
    this.$emit('material', this.material)
  },
  watch: {
  },
  mounted () {
    this.$parent.__add(this.material, 'material')
  },
  beforeDestroy () {
    this.$parent.__remove(this.material, 'material')
  }
}
</script>

<style scoped>
.mesh-phong-material{
  display: none;
}
</style>
