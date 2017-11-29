<template>
<div class="container">

  <div class="svg-con" ref="svgCon">
    <svg ref="svgEl">
      <!-- <defs>
        <linearGradient :id="gradientID" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(0, 0, 255, 0.25)" />
          <stop offset="100%" stop-color="rgba(0, 255, 0, 0.25)" />
        </linearGradient>
      </defs> -->

      <PathLine :refresher="refresher" :startElem="getEl(pair.items[0].id)" :endElem="getEl(pair.items[1].id)" :svgCon="svgCon" :svg="svgEl" v-for="(pair, index) in connections" :key="index" />
    </svg>
  </div>

  <div class="word-con">

    <div class="word-con-rel">
      <div v-for="conntGp in connectorGroups" :style="conntGp.style" class="connect-box">
        <div class="connect-box-rel">
          <div class="stick-top-right" @mousedown="() => { drag = true }" @mouseup="() => { drag = false }" v-touch:pan="(evt) => { onPan(evt, conntGp) }">===</div>
          <ConnectorGroup class="stick-top" :conntGp="conntGp" ballsMode="ballsIn" :balls="balls" :connectorGroups="connectorGroups" @mergeRefs="(v) => { mergeRefs(v) }"></ConnectorGroup>
          <ConnectorGroup class="stick-bottom" :conntGp="conntGp" ballsMode="ballsOut" :balls="balls" :connectorGroups="connectorGroups"  @mergeRefs="(v) => { mergeRefs(v) }"></ConnectorGroup>
        </div>

      </div>
    </div>


  </div>
</div>
</template>

<script>
import draggable from 'vuedraggable'
import PathLine from '@/components/parts/connectors/PathLine.vue'
import ConnectorGroup from '@/components/parts/connectors/ConnectorGroup.vue'
import * as Template from '@/components/parts/connectors/template.js'
export default {
  components: {
    PathLine,
    ConnectorGroup,
    draggable
  },
  data () {
    return {
      svgCon: false,
      svgEl: false,
      drag: false,
      connectorGroups: [
        Template.makeGroup({
          type: 'vec3',
          style: {
            top: '20px',
            left: '20px'
          },
          ballsIn: [
          ],
          ballsOut: [
            Template.makeBall(),
            Template.makeBall(),
            Template.makeBall()
          ]
        }),
        Template.makeGroup({
          type: 'modifier',
          style: {
            top: '300px',
            left: '300px'
          },
          ballsIn: [
            Template.makeBall(),
            Template.makeBall(),
            Template.makeBall(),
            Template.makeBall()
          ],
          ballsOut: [
            Template.makeBall()
          ]
        })
      ],
      rAFID: 0,
      refresher: 0
    }
  },
  computed: {
    balls: {
      get () {
        return this.connectorGroups.reduce((accu, box) => {
          accu = [...accu, ...box.ballsIn, ...box.ballsOut]
          return accu
        }, [])
      }
    },
    connections: {
      get () {
        return this.balls.reduce((accu, item, key) => {
          if (item.items.length >= 2) {
            accu.push(item)
          }
          return accu
        }, [])
      }
    }
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  },
  mounted () {
    var rAF = () => {
      this.rAFID = window.requestAnimationFrame(rAF)
      this.refresh()
    }
    this.rAFID = window.requestAnimationFrame(rAF)

    this.svgEl = this.$refs['svgEl']
    this.svgCon = this.$refs['svgCon']
  },
  methods: {
    onPan (evt, conntGp) {
      // console.log(evt, conntGp)
      var originalTop = parseFloat(conntGp.style.top.replace('px', ''))
      var originalLeft = parseFloat(conntGp.style.left.replace('px', ''))
      conntGp.style.top = ((originalTop + evt.velocityY * 16.6667)) + 'px'
      conntGp.style.left = ((originalLeft + evt.velocityX * 16.6667)) + 'px'
    },
    mergeRefs (v) {
      this.$refs = {
        ...this.$refs,
        ...v
      }
    },
    getEl (elRef) {
      if (!this.$refs[elRef]) {
        return
      }
      return this.$refs[elRef][0].$el
    },
    refresh () {
      this.refresher = Math.random()
    }
  }
}
</script>

<style scoped>

.container {
  transform: perspective(100vmax) translate3d(0,0,0.1px);
  position: relative;
  width: 100%;
  height: 100%;
}
.svg-con {
  position: absolute;
  top: 0px;
  left: 0px;
}
.word-con {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
.word-con-rel{
  position: relative;
  width: 100%;
  height: 100%;
}

.connect-box{
  position: absolute;
  width: 340px;
  height: 170px;
  border: grey solid 1px;
}
.connect-box-rel{
  position: relative;
  width: 100%;
  height: 100%;
}
.stick-top{
  position: absolute;
  top: 0px;
  left: 0px;
}
.stick-bottom{
  position: absolute;
  bottom: 0px;
  left: 0px;
}
.stick-top-right{
  position: absolute;
  top: 0px;
  right: 0px;
}

</style>
