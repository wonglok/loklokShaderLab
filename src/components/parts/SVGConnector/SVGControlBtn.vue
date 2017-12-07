<template>
<g>
  <circle :cx="0 + 20 + funcBox.size.w - 48 * cid" :cy="0" :r="20" :stroke="color" fill="rgba(255,255,255,1.0)"  v-touch:pan="onpan" v-touch:tap="ontap" />
  <text class="ballwords" :x="20 + funcBox.size.w - 48 * cid - 12"  :y="0 + 3" v-touch:pan="onpan"  v-touch:tap="ontap">
    <slot></slot>
  </text>
</g>
</template>

<script>
export default {
  props: {
    color: {
      default: '#5690d3'
    },
    cid: {
      default: 3
    },
    ontap: {
      default () {
        return () => {}
      }
    },
    funcBox: {},
    onpan: {
      default () {
        return () => {}
      }
    }
  },
  computed: {

  }
}
</script>

<style scoped>
.ballwords{
  font-size: 10px;
}
</style>
