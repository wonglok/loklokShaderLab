<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    color: {
      type: Number,
      default () {
        return 0xffffff
      }
    },
    intensity: {
      type: Number,
      default () {
        return 5
      }
    },
    distance: {
      type: Number,
      default () {
        return 100
      }
    }
  },
  data () {
    return {
      light: null
    }
  },
  created () {
    this.light = new THREE.PointLight(this.color, this.intensity, this.distance)
    this.light.position.set(5, 5, 10)
    // this.light
    this.$emit('light', this.light)
    this.$parent.__add(this.light)
  },
  mounted () {
  },
  beforeDestroy () {
    this.$parent.__remove(this.light)
  },
  watch: {
    color (v) {
      this.light.color.set(v)
    },
    intensity (v) {
      this.light.intensity = v
    }
  }
}
</script>

<style scoped>
.point-light{
  display: none;
}
</style>
