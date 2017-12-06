<template>
<span style="display:none;">{{ aspect }}{{ fov }}{{ z }}</span>
</template>

<script>
// import * as llvms from '../Mixins/llvms'
export default {
  props: ['aspect', 'fov', 'z'],
  created () {
    this.hydrate()
  },
  mounted () {
    this.hydrate()
  },
  watch: {
    aspect () {
      this.hydrate()
    },
    fov () {
      this.hydrate()
    },
    z () {
      this.hydrate()
    }
  },
  methods: {
    hydrate () {
      // llvms.info.aspect = this.aspect
      // llvms.info.fov = this.fov
      // llvms.info.z = this.z
      // console.log(llvms.info)
    }
  }
}
</script>

<style>

</style>
