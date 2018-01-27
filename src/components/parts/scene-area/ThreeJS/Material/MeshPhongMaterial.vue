<template>
<div class="mesh-phong-material"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    color: {
      default () {
        return Math.random() * 0xffffff
      }
    }
  },
  data () {
    return {
      material: false
    }
  },
  created () {
    this.material = new THREE.MeshPhongMaterial({
      color: new THREE.Color(this.color),
      specular: new THREE.Color(0x111111),
      shininess: 50
    })
    this.$parent.$emit('material', this.material)
  }
}
</script>

<style>

</style>
