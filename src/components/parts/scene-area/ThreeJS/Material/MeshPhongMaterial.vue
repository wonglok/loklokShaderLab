<template>
<div class="mesh-phong-material"></div>
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
    this.material = new THREE.MeshPhongMaterial({
      color: Math.random() * 0xffffff
    })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
