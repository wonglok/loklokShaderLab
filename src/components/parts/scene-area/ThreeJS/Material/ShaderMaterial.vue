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
  props: {
    vs: {
      default:
`void main ( void ) {
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
}`
    },
    fs: {
      default:
`void main () {
  gl_FragColor = vec4(vec3(0.5), 1.0);
}`
    },
    uniforms: {
      default () {
        return {}
      }
    }
  },
  watch: {
    vs () { this.initShader() },
    fs () { this.initShader() },
    uniforms () { this.initShader() }
  },
  mounted () {
    this.initShader()
  },
  methods: {
    initShader () {
      this.material = new THREE.ShaderMaterial({
        uniforms: {
          ...this.uniforms
        },
        vertexShader: this.vs,
        fragmentShader: this.fs
      })
      this.$parent.$emit('material', this.material)
    }
  }
}
</script>

<style>

</style>
