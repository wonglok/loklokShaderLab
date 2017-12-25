<template>
<div class="cube-camera"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    near: {},
    far: {},
    sceneCamera: {},
    cubeResolution: {},
    position: {},
    renderer: {},
    scene: {}
  },
  data () {
    return {
      camera: null
    }
  },
  created () {
    this.camera = new THREE.CubeCamera(this.near, this.far, this.cubeResolution)

    if (this.position) {
      this.camera.position.x = this.position.x
      this.camera.position.y = this.position.y
      this.camera.position.z = this.position.z
    }
    this.$emit('cube-camera', this)
    // this.$parent.$emit('add', this.camera)
  },
  beforeDestroy () {
    // this.$parent.$emit('remove', this.camera)
  },
  methods: {
    update () {
      if (this.renderer && this.scene && this.sceneCamera) {
        // this.camera.position.copy(this.sceneCamera.position)
        this.camera.rotation.set(
          this.sceneCamera.rotation.x,
          this.sceneCamera.rotation.y,
          this.sceneCamera.rotation.z
        )
        this.camera.rotation.needsUpdate = true
        this.camera.update(this.renderer, this.scene)
      }
    }
  },
  watch: {
    position () {
      if (this.position) {
        this.camera.position.x = this.position.x
        this.camera.position.y = this.position.y
        this.camera.position.z = this.position.z
      }
    },
    aspect () {
      if (this.camera) {
        this.camera.aspect = this.aspect
        this.camera.updateProjectionMatrix()
      }
    }
  }
}
</script>

<style scoped>
.perspective-camera{
  display: none;
}
</style>
