<template>
<div class="mesh-basic-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      material: false
    }
  },
  mounted () {
    this.material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
