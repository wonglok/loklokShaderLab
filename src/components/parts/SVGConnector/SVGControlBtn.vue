<template>
<g>
  <circle :cx="0 + 20 + funcBox.size.w - 48 * cid" :cy="0" :r="20" stroke="#56a0d3" fill="rgba(255,255,255,0.9)"  v-touch:pan="onpan" />
  <text class="ballwords" :x="20 + funcBox.size.w - 48 * cid - 12"  :y="0 + 3" v-touch:pan="onpan">
    <slot></slot>
  </text>
</g>
</template>

<script>
export default {
  props: {
    cid: {
      default: 3
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
