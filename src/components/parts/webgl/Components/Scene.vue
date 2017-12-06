<template>
<span class="scene"><slot></slot></span>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      scene: null
    }
  },
  created () {
    this.scene = new THREE.Scene()
    // this.scene
    this.$emit('scene', this.scene)
  },
  methods: {
    __add (item) {
      this.scene.add(item)
    },
    __remove (item) {
      this.scene.remove(item)
    }
  }
}
</script>

<style scoped>
.scene{
  display: none;
}
</style>
