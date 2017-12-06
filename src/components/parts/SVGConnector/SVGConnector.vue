<template>
  <div>
    <svg width="2560" height="2560" viewBox="0 0 2560 2560">

      <!-- a_____a -->
      <SVGPath
        v-if="dragging"
        :startX="dragging.startX" :startY="dragging.startY"
        :endX="dragging.endX" :endY="dragging.endY"
        :seed="0.5" />

      <circle
        v-if="dragging"
        :cx="dragging.endX"
        :cy="dragging.endY"
        :r="17"
        fill="#56a0d3"
      />

      <g v-for="(conn, index) in connections">
        <SVGPath
        stroke="#56a0d3"
        :startX="conn.startX" :startY="conn.startY"
        :endX="conn.endX" :endY="conn.endY"
        :seed="Math.min(0.3 + (index / connections.length), 1.0)" />
      </g>

      <!-- BOX -->
      <g :transform="getFuncBoxTrans(funcBox)" :key="funcBoxIdx" v-for="(funcBox, funcBoxIdx) in root.doc.funcBoxes" v-if="root.doc.funcBoxes">
        <rect :width="funcBox.size.w" :height="funcBox.size.h" stroke="#56a0d3" fill="rgba(255,255,255,0.8)" />

        <!-- Contorl1 -->
        <SVGControlBtn
          :cid="3"
          :funcBox="funcBox"
          :onpan="(evt) => { onPan(evt, funcBox) }"
        >
          Move
        </SVGControlBtn>

        <!-- Contorl2 -->
        <SVGControlBtn
          :cid="2"
          :funcBox="funcBox"
          :onpan="(evt) => { onPanAll(evt, root.doc.funcBoxes) }"
        >
          MvAll
        </SVGControlBtn>

        <!-- Control3 -->
        <SVGControlBtn
          :cid="1"
          :funcBox="funcBox"
        >
          Clear
        </SVGControlBtn>

        <g v-for="(ballIn, ballInIndex) in funcBox.ballsIn">
          <circle :cx="30 + 46 * ballInIndex"
           :ref="'ball' + ballIn.fromBall"
           v-touch:panstart="(evt) => { connectBallStart(evt, ballIn, ballInIndex) }"
           v-touch:panmove="(evt) => { connectBallMove(evt, ballIn, ballInIndex) }"
           v-touch:panend="(evt) => { connectBallEndR(evt, ballIn, ballInIndex) }"
           v-touch:tap="() => { breakUpBallsAt(ballIn) }"
           :cy="0" :r="20" fill="white" :stroke="'#56a0d3'">
          </circle>
        </g>

        <g v-for="(ballOut, ballOutIndex) in funcBox.ballsOut">
          <circle :cx="30 + 46 * ballOutIndex"
           :ref="'ball' + ballOut.fromBall"
           v-touch:panstart="(evt) => { connectBallStart(evt, ballOut, ballOutIndex) }"
           v-touch:panmove="(evt) => { connectBallMove(evt, ballOut, ballOutIndex) }"
           v-touch:panend="(evt) => { connectBallEnd(evt, ballOut, ballOutIndex) }"
           v-touch:tap="() => { breakUpBallsAt(ballOut) }"
           :cy="funcBox.size.h" :r="20" fill="white" :stroke="'#56a0d3'">
          </circle>
        </g>

        <foreignObject :x="10" :y="35" :width="funcBox.size.w" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <textarea :style="{
              appearance: 'none',
              outline: 'none',
              border: '#56a0d3 solid 1px',
              borderRadius: '5px',
              width: funcBox.size.w - 28 + 'px',
              height: '130px'
            }"></textarea>
          </div>
        </foreignObject>

      </g>


    </svg>

  </div>
</template>

<script>
import SVGPath from '@/components/parts/SVGConnector/SVGPath.vue'
import SVGControlBtn from '@/components/parts/SVGConnector/SVGControlBtn.vue'
import * as Template from '@/components/parts/SVGConnector/template.js'

export default {
  data () {
    return {
      ready: false,
      Math,
      dragging: false,
      fps: {
        lastTime: 0
      },
      rAFID: 0,
      root: {
        doc: {},
        tm: []
      }
    }
  },
  components: {
    SVGControlBtn,
    SVGPath
  },
  mounted () {
    var rAF = (time) => {
      this.rAFID = window.requestAnimationFrame(rAF)
      this.fps.diff = time - this.fps.lastTime
      this.fps.lastTime = time
    }
    this.rAFID = window.requestAnimationFrame(rAF)
    this.fps.lastTime = performance.now()

    this.$nextTick(() => {
      this.initDoc()
    }, 100)
  },
  computed: {
    allBalls () {
      if (!this.root.doc.funcBoxes) {
        return []
      }
      var connectedBalls = this.root.doc.funcBoxes.reduce((accu, funcBox, index) => {
        accu = [
          ...accu,
          ...funcBox.ballsIn.map((eBall, index) => {
            eBall.index = index
            return eBall
          }),
          ...funcBox.ballsOut.map((eBall, index) => {
            eBall.index = index
            return eBall
          })
        ]
        return accu
      }, [])

      return connectedBalls
    },
    allInputBalls () {
      if (!this.root.doc.funcBoxes) {
        return []
      }
      var connectedBalls = this.root.doc.funcBoxes.reduce((accu, funcBox, index) => {
        accu = [
          ...accu,
          ...funcBox.ballsIn.map((eBall, index) => {
            eBall.index = index
            return eBall
          })
        ]
        return accu
      }, [])

      return connectedBalls
    },
    allOutputBalls () {
      if (!this.root.doc.funcBoxes) {
        return []
      }
      var connectedBalls = this.root.doc.funcBoxes.reduce((accu, funcBox, index) => {
        accu = [
          ...accu,
          ...funcBox.ballsOut.map((eBall, index) => {
            eBall.index = index
            return eBall
          })
        ]
        return accu
      }, [])

      return connectedBalls
    },
    connectedBalls () {
      if (!this.root.doc.funcBoxes) {
        return []
      }
      var connectedBalls = this.root.doc.funcBoxes.reduce((accu, funcBox, index) => {
        accu = [
          ...accu,
          // ...funcBox.ballsIn,
          ...funcBox.ballsOut
        ]
        return accu
      }, []).filter((ball, index) => {
        ball.index = index
        return ball.toBall !== false && ball.toBox !== false
      })

      return connectedBalls
    },
    connections () {
      if (!this.ready) {
        return []
      }

      var items = this.connectedBalls.map((ball) => {
        var fromBox = this.root.doc.funcBoxes.filter((box) => {
          return box.boxID === ball.fromBox
        })[0]
        var toBox = this.root.doc.funcBoxes.filter((box) => {
          return box.boxID === ball.toBox
        })[0]
        var toBall = this.allBalls.filter((eBall) => {
          return eBall.fromBall === ball.toBall
        })[0]

        ball = {
          ...ball,
          fromBox,
          toBox,
          startX: fromBox.pos.x + 30,
          startY: fromBox.pos.y + fromBox.size.h,
          endX: toBox.pos.x + 30 + toBall.index * 46,
          endY: toBox.pos.y
        }
        return ball
      })
      return items
    }
  },
  methods: {
    offset (elt) {
      var rect = elt.getBoundingClientRect()
      var bodyElt = document.body.parentElement
      return {
        top: rect.top + bodyElt.scrollTop,
        left: rect.left + bodyElt.scrollLeft
      }
    },
    connectBallStart (evt, ball) {
      var offset = this.offset(this.$refs['ball' + ball.fromBall][0])

      this.dragging = {
        startX: offset.left + 21,
        startY: offset.top - 30,
        endX: offset.left + 21,
        endY: offset.top - 15
      }
    },
    connectBallMove (evt, ball) {
      let factor = (window.navigator.userAgent.indexOf('Chrome') !== -1) ? 1.0 : 0.5
      this.dragging.endX += evt.velocityX * (this.fps.diff) * factor
      this.dragging.endY += evt.velocityY * (this.fps.diff) * factor
    },
    connectBallEnd (evt, ball) {
      var bodyElt = document.body
      var offset = {
        top: this.dragging.endY + 15 + bodyElt.scrollTop,
        left: this.dragging.endX - 30 + bodyElt.scrollLeft
      }

      var ans = this.allInputBalls.filter((eBall) => {
        var eOffset = this.offset(this.$refs['ball' + eBall.fromBall][0])
        var y = eOffset.top - offset.top
        var x = eOffset.left - offset.left
        var d = Math.sqrt(x * x + y * y)
        return d < 30
      })[0]

      if (ans) {
        this.connectBalls(ans, ball)
      }
      this.dragging = false
    },
    connectBallEndR (evt, ball) {
      var bodyElt = document.body
      var offset = {
        top: this.dragging.endY + 15 + bodyElt.scrollTop,
        left: this.dragging.endX - 30 + bodyElt.scrollLeft
      }

      var ans = this.allOutputBalls.filter((eBall) => {
        var eOffset = this.offset(this.$refs['ball' + eBall.fromBall][0])
        var y = eOffset.top - offset.top
        var x = eOffset.left - offset.left
        var d = Math.sqrt(x * x + y * y)
        if (d < 20) {
          console.table([
            eOffset,
            offset
          ])
        }
        return d < 20
      })[0]

      if (ans) {
        this.connectBalls(ans, ball)
      }
      this.dragging = false
    },
    breakUpBallsAt (ball) {
      var fromBall = this.allBalls.filter((eBall) => {
        return eBall.fromBall === ball.fromBall
      })[0]
      var toBall = this.allBalls.filter((eBall) => {
        return eBall.fromBall === ball.toBall
      })[0]
      if (fromBall) {
        fromBall.toBall = false
        fromBall.toBox = false
      }
      if (toBall) {
        toBall.toBall = false
        toBall.toBox = false
      }
    },
    connectBalls (ballA, ballB) {
      console.log(ballA, ballB)
      ballA.toBall = ballB.fromBall
      ballA.toBox = ballB.fromBox
      ballB.toBall = ballA.fromBall
      ballB.toBox = ballA.fromBox
    },
    getBallByID (id) {
      return this.$refs[id][0]
    },
    getFuncBoxTrans (funcBox) {
      var x = funcBox.pos.x.toFixed(3)
      var y = funcBox.pos.y.toFixed(3)

      return `matrix(1 0 0 1 ${x} ${y})`
    },
    initDoc () {
      this.root.doc = Template.getNewDoc()
      this.$nextTick(() => {
        this.ready = true
        this.$forceUpdate()
      })
    },
    onPanAll (evt, funcBoxes) {
      funcBoxes.forEach((funcBox) => {
        this.onPan(evt, funcBox)
      })
    },
    onPan (evt, funcBox) {
      var factor = (window.navigator.userAgent.indexOf('Chrome') !== -1) ? 1.0 : 0.5
      funcBox.pos.x += evt.velocityX * (this.fps.diff) * factor
      funcBox.pos.y += evt.velocityY * (this.fps.diff) * factor
    },
    onPanEnd (evt, funcBox) {

    }
  }
}
</script>

<style>


</style>
