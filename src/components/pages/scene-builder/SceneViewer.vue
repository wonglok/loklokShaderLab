<template>
  <div ref="full">

    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
      <keep-alive>
        <component
          class="full"
          :is="'router-view'"
          v-if="renderer"
          :doc="doc"
          :size="size"
          :renderer="renderer"
        >
        </component>
      </keep-alive>
    </Renderer>

  </div>
</template>

<script>
// import * as THREE from 'three'
// import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
export default {
  // THREE,
  components: {
    ...Bundle
  },
  props: {
    doc: {}
  },
  data () {
    return {
      resizer: () => {},
      renderer: false,
      size: {
        width: 100,
        height: 100,
        aspect: 1
      }
    }
  },
  mounted () {
    var resizer = this.resizer = () => {
      this.$nextTick(() => {
        var rect = this.$refs.full.getBoundingClientRect()
        this.size = {
          width: rect.width,
          height: rect.height,
          aspect: rect.width / rect.height
        }
      })
    }
    window.addEventListener('resize', resizer.bind(this))
    resizer()
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
