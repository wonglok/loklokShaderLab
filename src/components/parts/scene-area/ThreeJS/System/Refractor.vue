<template>

</template>

<script>
import * as THREE from 'three'
/* eslint-disable */
import 'imports-loader?THREE=three!three/examples/js/shaders/WaterRefractionShader.js'
import 'imports-loader?THREE=three!three/examples/js/objects/Refractor.js'
/* eslint-enable */

export default {
  props: {
    position: {}
  },
  data () {
    return {
      clock: false,
      reflector: false
    }
  },
  created () {
    this.clock = new THREE.Clock()
    console.log(THREE.Refractor)
    this.refractor = new THREE.Refractor(10, 10, {
      color: 0x999999,
      textureWidth: 1024,
      textureHeight: 1024,
      shader: THREE.WaterRefractionShader
    })
    // this.refractor.position.set(0, 0, 3)
    if (this.position) {
      this.refractor.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      )
    }
    var dudvMap = new THREE.TextureLoader().load(require('../textures/waterdudv.jpg'), () => {
      this.$emit('refactor', this.refractor)
      this.$parent.$emit('add', this.refractor)
    })

    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping
    this.refractor.material.uniforms.tDudv.value = dudvMap
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.refractor)
  },
  methods: {
    update () {
      this.refractor.material.uniforms.time.value += this.clock.getDelta()
    }
  }
}
</script>

<style>

</style>
