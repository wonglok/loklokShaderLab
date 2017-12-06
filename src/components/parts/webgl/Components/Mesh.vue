<template>
<span class="mesh"><slot></slot></span>
</template>
<script>
import * as THREE from 'three'
export default {
  props: {
    'position': {},
    'gclick': {},
    'gTS': {},
    'scale': {},
    'visible': {
      default: true
    }
  },
  data () {
    return {
      mesh: null,
      default: {
        geometry: false,
        material: false
      }
    }
  },
  created () {
    this.mesh = new THREE.Mesh()
    if (this.gclick) {
      this.mesh.userData.gclick = this.gclick
    }
    if (this.gTS) {
      this.mesh.userData.gTS = this.gTS
    }
    if (this.position) {
      this.mesh.position.set(this.position.x || 0, this.position.y || 0, this.position.z || 0)
    }
    if (this.scale) {
      this.mesh.scale.set(this.scale.x || 1, this.scale.y || 1, this.scale.z || 1)
    }
    this.default.geometry = this.mesh.geometry
    this.default.material = this.mesh.material
    this.$emit('mesh', this.mesh)
  },
  watch: {
    position () {
      if (this.position) {
        this.mesh.position.set(this.position.x || 0, this.position.y || 0, this.position.z || 0)
      }
    },
    scale () {
      if (this.scale) {
        this.mesh.scale.set(this.scale.x || 1, this.scale.y || 1, this.scale.z || 1)
      }
    },
    visible () {
      this.mesh.visible = this.visible
    }
  },
  // calling parent methods.
  mounted () {
    this.mesh.visible = this.visible
    this.$parent.__add(this.mesh)
  },
  beforeDestroy () {
    this.$parent.__remove(this.mesh)
  },
  methods: {
    // let child add
    __add (v, type) {
      if (type === 'geometry') {
        this.mesh.geometry = v
      }
      if (type === 'material') {
        this.mesh.material = v
      }
    },
    __remove (v, type) {
      if (type === 'geometry') {
        this.mesh.geometry = this.default.geometry
      }
      if (type === 'material') {
        this.mesh.material = this.default.material
      }
    }
  }
}
</script>

<style scoped>
.mesh{
  display: none;
}
</style>
