<template>
  <div class="light-point"></div>
</template>

<script>
import * as THREE from 'three'
export default {
  props: {
    color: {
      default () {
        return 0xffffff
      }
    }
  },
  data () {
    return {
      light: false
    }
  },
  mounted () {
    this.light = new THREE.PointLight({ color: new THREE.Color(this.color) })
    this.$emit('element', this.light)
    this.$parent.$emit('add', this.light)
  },
  beforeDestroy () {
    this.$parent.$emit('remove', this.light)
  }
}
</script>

<style>

</style>
