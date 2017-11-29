<template>
<path ref="path" :d="readD">
</path>
</template>

<script>
// helper functions, it turned out chrome doesn't support Math.sgn()
function signum (x) {
  return (x < 0) ? -1 : 1
}
function absolute (x) {
  return (x < 0) ? -x : x
}
function offset (elt, parent) {
  var rect = elt.getBoundingClientRect()
  var bodyElt = document.body
  return {
    top: rect.top + bodyElt.scrollTop,
    left: rect.left + bodyElt.scrollLeft
  }
}

export default {
  props: {
    gradientID: {},
    refresher: {},
    svg: {},
    svgCon: {},
    startElem: {},
    endElem: {}
  },
  data () {
    return {
      svgWidth: 0,
      svgHeight: 0,

      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    }
  },
  mounted () {
    this.refresh()
  },
  watch: {
    refresher () {
      this.refresh()
    },
    endElem () {
      this.refresh()
    },
    startElm () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.calcElementsCoord()
      this.tryResize()
    },
    tryResize () {
      var startX = this.startX
      // var startY = this.startY
      var endX = this.endX
      var endY = this.endY
      var svg = this.svg

      if (!this.svg) {
        return ''
      }

      // get the path's stroke width (if one wanted to be  really precize, one could use half the stroke size)
      var stroke = this.stroke
      // check if the svg is big enough to draw the path, if not, set heigh/width
      if (endY !== this.svgHeight && svg.getAttribute('height') < endY) {
        svg.setAttribute('height', endY)
        this.svgHeight = endY
      }
      if ((startX + stroke) !== this.svgWidth && svg.getAttribute('width') < (startX + stroke)) {
        svg.setAttribute('width', (startX + stroke))
        this.svgWidth = (startX + stroke)
      }
      if ((endX + stroke) !== this.svgWidth && svg.getAttribute('width') < (endX + stroke)) {
        svg.setAttribute('width', (endX + stroke))
        this.svgWidth = (endX + stroke)
      }
    },
    calcElementsCoord () {
      var startElem = this.startElem
      var endElem = this.endElem
      var svgCon = this.svgCon

      // console.log(svgCon, startElem, endElem)

      if (!startElem || !endElem || !svgCon) {
        return
      }

      // get (top, left) coordinates for the two elements
      var startCoord = offset(startElem)
      var endCoord = offset(endElem)

      // if first element is lower than the second, swap!
      if (offset(startElem).top > offset(endElem).top) {
        let temp = startElem
        startElem = endElem
        endElem = temp

        let temp2 = endCoord
        endCoord = startCoord
        startCoord = temp2
      }

      var svgConOffset = offset(svgCon)
      // get (top, left) corner coordinates of the svg container
      var svgTop = svgConOffset.top
      var svgLeft = svgConOffset.left

      // calculate path's start (x,y)  coords
      // we want the x coordinate to visually result in the element's mid point
      var startX = startCoord.left + 0.5 * startElem.offsetWidth - svgLeft // x = left offset + 0.5*width - svg's left offset
      var startY = startCoord.top + startElem.offsetHeight - svgTop // y = top offset + height - svg's top offset

      // calculate path's end (x,y) coords
      var endX = endCoord.left + 0.5 * endElem.offsetWidth - svgLeft
      var endY = endCoord.top - svgTop

      var ans = {
        startX,
        startY,
        endX,
        endY
      }

      this.startX = ans.startX
      this.startY = ans.startY
      this.endX = ans.endX
      this.endY = ans.endY

      // this.$forceUpdate()

      return ans
    }
  },
  computed: {
    stroke () {
      var path = this.$refs['path']
      if (!path) {
        return 0
      }
      var stroke = parseFloat(getComputedStyle(path)['stroke-width'])
      return stroke
    },
    readD () {
      var startX = this.startX
      var startY = this.startY
      var endX = this.endX
      var endY = this.endY

      var deltaX = (endX - startX) * 0.175
      var deltaY = (endY - startY) * 0.175
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

<style scoped>
path {
  fill:   none;
  stroke: #bababa;
  /* stroke: linear-gradient(45deg, cyan, hotpink); */
  stroke-width: 4px;
}
</style>
