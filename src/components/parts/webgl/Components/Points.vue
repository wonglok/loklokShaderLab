<template>
<span class="points"><slot></slot></span>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      points: null,
      default: {
        geometry: false,
        material: false
      }
    }
  },
  created () {
    this.points = new THREE.Points()
    this.default.geometry = this.points.geometry
    this.default.material = this.points.material
    this.$emit('points', this.points)
  },
  watch: {
  },
  mounted () {
    this.$parent.__add(this.points)
  },
  beforeDestroy () {
    this.$parent.__remove(this.points)
  },
  methods: {
    __add (v, type) {
      if (type === 'geometry') {
        this.points.geometry = v
      }
      if (type === 'material') {
        this.points.material = v
      }
    },
    __remove (v, type) {
      if (type === 'geometry') {
        this.points.geometry = this.default.geometry
      }
      if (type === 'material') {
        this.points.material = this.default.material
      }
    }
  }
}
</script>

<style scoped>
.points{
  display: none;
}
</style>
