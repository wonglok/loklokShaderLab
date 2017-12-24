<template>
<div class="mesh-lambert-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      material: false
    }
  },
  created () {
    this.material = new THREE.MeshLambertMaterial({
      color: Math.random() * 0xffffff
    })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
