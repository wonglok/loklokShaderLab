<template>
<path ref="path" :d="readD" :stroke="stroke" fill="transparent"></path>
</template>

<script>
function signum (x) {
  return (x < 0) ? -1 : 1
}
function absolute (x) {
  return (x < 0) ? -x : x
}
export default {
  props: {
    stroke: {
      default: 'red'
    },
    seed: {},
    startX: {},
    startY: {},
    endX: {},
    endY: {}
  },
  computed: {
    readD () {
      var startX = this.startX
      var startY = this.startY
      var endX = this.endX
      var endY = this.endY

      if (startX > endX && startY > endY) {
        startX = this.endX
        startY = this.endY
        endX = this.startX
        endY = this.startY
      }

      var deltaX = (endX - startX) * (0.1 + (0.3 * this.seed))
      var deltaY = (endY - startY) * (0.1 + (0.3 * this.seed))

      // for further calculations which ever is the shortest distance
      var delta = deltaY < absolute(deltaX) ? deltaY : absolute(deltaX)

      // set sweep-flag (counter/clock-wise)
      // if start element is closer to the left edge,
      // draw the first arc counter-clockwise, and the second one clock-wise
      var arc1 = 0
      var arc2 = 1
      if (startX > endX) {
        arc1 = 1
        arc2 = 0
      }

      // draw tha pipe-like path
      // 1. move a bit down, 2. arch,  3. move a bit to the right, 4.arch, 5. move down to the end

      return 'M' + startX + ' ' + startY +
      ' V' + (startY + delta) +
      ' A' + delta + ' ' + delta + ' 0 0 ' + arc1 + ' ' + (startX + delta * signum(deltaX)) + ' ' + (startY + 2 * delta) +
      ' H' + (endX - delta * signum(deltaX)) +
      ' A' + delta + ' ' + delta + ' 0 0 ' + arc2 + ' ' + endX + ' ' + (startY + 3 * delta) +
      ' V' + endY
    }
  }
}
</script>

<style>

</style>
