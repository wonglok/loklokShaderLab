<script>
import * as THREE from 'three'
export default {
  props: ['width', 'height', 'wseg', 'hseg', 'translate', 'scale'],
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
    this.makeGeo()
    // this.geometry
    this.$emit('geometry', this.geometry)
  },
  watch: {
    width () {
      this.makeGeo()
    },
    height () {
      this.makeGeo()
    },
    translate () {
      this.makeGeo()
      this.$parent.__add(this.geometry, 'geometry')
      this.$parent.__remove(this.geometry, 'geometry')
      this.$parent.__add(this.geometry, 'geometry')
    }
  },
  methods: {
    makeGeo () {
      this.geometry = new THREE.PlaneBufferGeometry(this.width || 1.0, this.height || 1.0, this.wseg || 20.0, this.hseg || 20.0)
      if (this.translate) {
        let x = this.translate.x
        // if (typeof this.translate.x === 'function') {
        //   x = this.translate.x(this.width)
        // }
        let y = this.translate.y
        // if (typeof this.translate.y === 'function') {
        //   y = this.translate.y(this.height)
        // }
        let z = this.translate.z
        // if (typeof this.translate.z === 'function') {
        //   z = this.translate.z(1.0)
        // }
        this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(x, y, z))
        // this.$forceUpdate()
      }
    }
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
