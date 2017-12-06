<template>
<div class="webgl-renderer" ref="mounter">
</div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    rect: {
      type: window.DOMRect
    },
    alpha: {
      type: Boolean,
      default: true
    },
    antialias: {
      type: Boolean,
      default: false
    },
    camera: {
    },
    scene: {
    }
  },
  data () {
    return {
      renderer: null
    }
  },
  created () {
    this.renderer = new THREE.WebGLRenderer({
      alpha: this.alpha,
      antialias: this.antialias
    })
    let ratio = window.devicePixelRatio || 1
    // this.renderer.setPixelRatio(ratio >= 2 ? 2 : 1)
    this.renderer.setPixelRatio(ratio)
    this.renderer.setSize(this.rect.width, this.rect.height)
    this.$emit('renderer', this.renderer)
  },
  mounted () {
    this.renderer.domElement.style.marginBottom = '-6px'
    this.$refs.mounter.appendChild(this.renderer.domElement)
  },
  beforeDestroy () {
    this.$refs.mounter.removeChild(this.renderer.domElement)
  },
  watch: {
    rect () {
      if (this.renderer && this.rect) {
        this.renderer.setSize(this.rect.width, this.rect.height)
      }
    }
  }
}
</script>

<style scoped>
.webgl-renderer{
  width: 100%;
  height: 100%;
}
</style>
