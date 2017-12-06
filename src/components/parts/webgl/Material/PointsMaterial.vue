<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    color: {
      // type: Number,
      default () {
        return Math.random() * 0xffffff
      }
    },
    size: {
      type: Number,
      default () {
        return window.devicePixelRatio || 1.0
      }
    },
    sizeAttenuation: {
      type: Boolean,
      default: false
    },
    blending: {
      // type: Number,
      default () {
        return THREE.AdditiveBlending
      }
    },
    opacity: {
      type: Number,
      default () {
        return 1.0
      }
    },
    depthTest: {
      type: Boolean,
      default () {
        return true
      }
    }
  },
  data () {
    return {
      material: null
    }
  },
  created () {
    this.material = new THREE.PointsMaterial({
      color: this.color,
      size: this.size,
      sizeAttenuation: this.sizeAttenuation,
      opacity: this.opacity,
      blending: this.blending,
      depthTest: this.depthTest
    })
    // this.material
    this.$emit('material', this.material)
  },
  watch: {
    color () {
      this.material.color.set(this.color)
    },
    size () {
      this.material.size = this.size
    },
    opacity () {
      this.material.opacity = this.opacity
    }
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
.points-material{
  display: none;
}
</style>
