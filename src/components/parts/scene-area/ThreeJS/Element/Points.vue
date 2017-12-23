<template>
  <div class="points">
    <slot>
    </slot>
  </div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    position: {}
  },
  data () {
    return {
      points: false,
      material: false,
      geometry: false
    }
  },
  created () {
    this.$on('material', (v) => {
      this.material = v
      this.tryAdd()
    })
    this.$on('geometry', (v) => {
      this.geometry = v
      this.tryAdd()
    })
  },
  beforeDestroy () {
    this.uninstall()
  },
  methods: {
    tryAdd () {
      if (this.geometry && this.material) {
        this.points = new THREE.Points(this.geometry, this.material)
        this.$parent.$emit('add', this.points)
      }
    },
    uninstall () {
      this.$parent.$emit('remove', this.points)
    }
  }
}
</script>

<style>

</style>
