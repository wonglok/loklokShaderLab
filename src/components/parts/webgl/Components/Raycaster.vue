<template>
<span class="raycaster"></span>
</template>
<script>
import { glSystem } from '@/components/WebGL/Shared/system'
import * as THREE from 'three'
export default {
  // abstract: true,
  // render () {
  //   return null
  // },
  props: ['camera', 'scene'],
  data () {
    return {
      glSystem: glSystem,
      run: false,
      raycaster: null,
      mouse: new THREE.Vector2(0, 0)
    }
  },
  created () {
    this.raycaster = new THREE.Raycaster()
    this.mouse.isIn = false
    this.$emit('raycaster', this)
    this.$emit('raycast', this.raycast)
    this.$emit('setMouse', this.setMouse)
    // this.$emit('finder', this.finder)
    this.$emit('hover', this.hover)
  },
  activated () {
    this.$emit('raycast', this.raycast)
    this.$emit('setMouse', this.setMouse)
    // this.$emit('finder', this.finder)
    this.$emit('hover', this.hover)
  },
  methods: {
    finder () {
      if (this.camera && this.scene && this.mouse) {
        this.raycaster.setFromCamera(this.mouse, this.camera)
        var restore = []
        this.scene.traverse((ele) => {
          if (ele.$skipRayCaster === true) {
            restore.push({
              parent: ele.parent,
              ele: ele
            })
            ele.parent.remove(ele)
          }
        })
        var intersects = this.raycaster.intersectObjects(this.scene.children, true)
        restore.forEach((item) => {
          item.parent.add(item.ele)
        })
        // console.log(intersects)
        return intersects
      } else {
        return []
      }
    },
    hover () {
      if (this.mouse.isIn) {
        return this.finder()
      } else {
        return []
      }
    },
    setMouse ({ pageX, pageY, rect, isIn, type }) {
      if (rect && typeof pageX !== 'undefined' && typeof pageY !== 'undefined') {
        this.mouse.x = ((pageX - rect.left) / rect.width) * 2 - 1
        this.mouse.y = -((pageY - rect.top) / rect.height) * 2 + 1
        // console.log(this.mouse)
      }
      if (typeof isIn !== 'undefined') {
        this.mouse.isIn = isIn
      }
      if (type === 'click') {
        this.run = true
        // this.$emit('glClick', { mouse: this.mouse, found: this.finder() })
      }
    },
    raycast () {
      if (this.run) {
        this.run = false
        // this.glSystem.busy = true
        var result = this.finder()
        // if (typeof result[0] === 'undefined') {
        //   this.glSystem.busy = false
        // }
        this.$emit('glClick', { mouse: this.mouse, found: result })
        this.$emit('glTouchStart', { mouse: this.mouse, found: result })
      }
    },
    raycastNow () {
      var result = this.finder()
      return { mouse: this.mouse, found: result }
    }
  }
}
</script>

<style scoped>
.raycaster{
  display: none;
}
</style>
