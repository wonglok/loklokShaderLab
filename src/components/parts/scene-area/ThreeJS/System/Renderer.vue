<template>
  <div ref="mounter"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  data () {
    return {
      // THREE,
      renderer: false
    }
  },
  props: {
    size: { default () { return { width: 500, height: 500 } } },
    alpha: { default: true },
    antialias: { default: true }
  },
  mounted () {
    this.renderer = new THREE.WebGLRenderer({
      alpha: this.alpha,
      antialias: this.antialias
    })
    this.resize()
    this.$refs.mounter.appendChild(this.renderer.domElement)
    this.$emit('renderer', this.renderer)
  },
  beforeDestroy () {
    this.$refs.mounter.removeChild(this.renderer.domElement)
  },
  watch: {
    size () {
      this.resize()
    }
  },
  methods: {
    resize () {
      let ratio = window.devicePixelRatio || 1
      this.renderer.setPixelRatio(ratio)
      this.renderer.setSize(this.size.width, this.size.height)
    }
  }
}
</script>

<style>

</style>
