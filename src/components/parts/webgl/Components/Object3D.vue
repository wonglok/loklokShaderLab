<template>
<span class="object3d"><slot></slot></span>
</template>
<script>
import * as THREE from 'three'
export default {
  props: ['position', 'scale'],
  data () {
    return {
      object3d: null
    }
  },
  created () {
    this.object3d = new THREE.Object3D()
    if (this.position) {
      this.object3d.position.set(this.position.x || 0, this.position.y || 0, this.position.z || 0)
    }
    if (this.scale) {
      this.object3d.scale.set(this.scale.x || 0, this.scale.y || 0, this.scale.z || 0)
    }
    this.$emit('object', this.object3d)
  },
  watch: {
    position () {
      if (this.position) {
        this.object3d.position.set(this.position.x || 0, this.position.y || 0, this.position.z || 0)
      }
    },
    scale () {
      if (this.scale) {
        this.object3d.scale.set(this.scale.x || 0, this.scale.y || 0, this.scale.z || 0)
      }
    }
  },
  // calling parent methods.
  mounted () {
    this.$parent.__add(this.object3d)
  },
  beforeDestroy () {
    this.$parent.__remove(this.object3d)
  },
  methods: {
    // let child add
    __add (v) {
      this.object3d.add(v)
    },
    __remove (v) {
      this.object3d.remove(v)
    }
  }
}
</script>

<style scoped>
.object3d{
  display: none;
}
</style>
