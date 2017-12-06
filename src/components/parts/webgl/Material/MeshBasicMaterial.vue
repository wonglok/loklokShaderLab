<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    image: {},
    color: {
      type: Number
    },
    opacity: {
      type: Number,
      default: 1.0
    },
    blending: {
      default () {
        return THREE.AdditiveBlending
        // return null
      }
    }
  },
  data () {
    return {
      material: null
    }
  },
  created () {
    this.material = new THREE.MeshBasicMaterial({
      map: this.image ? new THREE.TextureLoader().load(this.image) : null,
      color: this.color || 0xee0302,
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
