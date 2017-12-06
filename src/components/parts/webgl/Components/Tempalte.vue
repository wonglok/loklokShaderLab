<template>
<span class="template"><slot></slot></span>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      mesh: null
    }
  },
  created () {
    this.mesh = new THREE.Mesh()
    // this.mesh
    this.$emit('mesh', this.mesh)
  },
  watch: {
  }
}
</script>

<style scoped>
.template{
  display: none;
}
</style>
