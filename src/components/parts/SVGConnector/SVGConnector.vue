<template>
  <div class="svg-connector">
    <!-- <div class="debug-console">
      <h1>VertexShader</h1>
      <pre class="vs-code">{{ shaderANS.vs }}</pre>
      <h1>FragmentShader</h1>
      <pre class="fs-code">{{ shaderANS.fs }}</pre>
    </div> -->
    <div class="toolbar-taller"></div>
    <div class="toolbar">
      <button @click="$emit('close')">Close</button>
      <button @click="saveRoot">Save File</button>
      <input type="file" @change="restoreRoot"></input>
      <br />

      <div>
        Time Machine:
        <input type="range" v-model="timenow" :min="0" :max="this.root.tm.length - 1" v-if="this.root.tm.length > 0" @input="(evt) => { timeTravel(evt.target.value) }" />

        <button @click="saveTimeCapsule({ force: true })">SaveTimeCapsule</button>
        <transition name="saved">
          <span v-if="notification.saved">Saved</span>
        </transition>
        <!-- <button @click="() => { timeTravel($refs['time-machine'].value) }">Time Travel</button> -->
      </div>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">getPosition</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">getUV</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">floatModifier</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">vec3Modifier</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">vec4Modifier</button>
      <br />
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">outputVertex</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">outputUV</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">outputPointSize</button>
      <button @click="(evt) => { makeBox(evt.target.innerHTML) }">outputFragment</button>
    </div>

    <svg ref="svg-graph" width="5120" height="5120" viewBox="0 0 5120 5120">

      <!-- a_____a -->
      <SVGPath
        v-if="dragging"
        :startX="dragging.startX" :startY="dragging.startY"
        :endX="dragging.endX" :endY="dragging.endY"
        :seed="0.5"
        :stroke="'#bababa'"
      />

      <circle
        v-if="dragging"
        :cx="dragging.endX"
        :cy="dragging.endY"
        :r="17"
        fill="#bababa"
      />

      <g v-for="(conn, index) in connections">
        <SVGPath
        :stroke="'#bababa'"
        :startX="conn.startX" :startY="conn.startY"
        :endX="conn.endX" :endY="conn.endY"
        :seed="Math.max(0.3, Math.min(index / connections.length * 0.7, 0.7))" />
      </g>

      <!-- BOX -->
      <g :transform="getFuncBoxTrans(funcBox)" :key="funcBoxIdx" v-for="(funcBox, funcBoxIdx) in root.doc.funcBoxes" v-if="root.doc.funcBoxes">
        <rect :width="funcBox.size.w" :height="funcBox.size.h" :stroke="shaderLineColor(funcBox)" fill="rgba(255,255,255,0.8)" />

        <!-- Contorl1 -->
        <SVGControlBtn
          :color="shaderLineColor(funcBox)"
          :cid="3"
          :funcBox="funcBox"
          :onpan="(evt) => { onPan(evt, funcBox) }"
        >
          Move
        </SVGControlBtn>

        <!-- Contorl2 -->
        <SVGControlBtn
          :color="shaderLineColor(funcBox)"
          :cid="2"
          :funcBox="funcBox"
          :onpan="(evt) => { onPanAll(evt, funcBox, root.doc.funcBoxes) }"
        >
          MvAll
        </SVGControlBtn>

        <!-- Control3 -->
        <SVGControlBtn
          :color="shaderLineColor(funcBox)"
          :cid="1"
          :funcBox="funcBox"
          :onpan="(evt) => {  }"
          :ontap="(evt) => { removeBox(funcBox, funcBoxIdx, root.doc.funcBoxes) }"
        >
          Clear
        </SVGControlBtn>

        <g v-for="(ballIn, ballInIndex) in funcBox.ballsIn" :key="ballInIndex">
          <circle :cx="30 + 46 * ballInIndex"
           :ref="'ball' + ballIn.fromBall"
           v-touch:panstart="(evt) => { connectBallStart(evt, ballIn, ballInIndex) }"
           v-touch:panmove="(evt) => { connectBallMove(evt, ballIn, ballInIndex) }"
           v-touch:panend="(evt) => { connectBallEndR(evt, ballIn, ballInIndex) }"
           v-touch:tap="() => { breakUpBallsAt(ballIn) }"
           :cy="0" :r="20" fill="white" :stroke="shaderLineColor(funcBox)">
          </circle>
        </g>

        <g v-for="(ballOut, ballOutIndex) in funcBox.ballsOut" :key="ballOutIndex">
          <circle :cx="30 + 46 * ballOutIndex"
           :ref="'ball' + ballOut.fromBall"
           v-if="ballOut.label !== 'void'"
           v-touch:panstart="(evt) => { connectBallStart(evt, ballOut, ballOutIndex) }"
           v-touch:panmove="(evt) => { connectBallMove(evt, ballOut, ballOutIndex) }"
           v-touch:panend="(evt) => { connectBallEnd(evt, ballOut, ballOutIndex) }"
           v-touch:tap="() => { breakUpBallsAt(ballOut) }"
           :cy="funcBox.size.h" :r="20" fill="white" :stroke="shaderLineColor(funcBox)">
          </circle>
        </g>

        <foreignObject :x="10" :y="35" :width="funcBox.size.w" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <textarea
              spellcheck="false"
              :style="{
                appearance: 'none',
                outline: 'none',
                border: shaderLineColor(funcBox) + ' solid 1px',
                borderRadius: '5px',
                color: shaderLineColor(funcBox),
                fontSize: '13px',
                width: funcBox.size.w - 28 + 'px',
                height: '130px'
              }"
              v-model="funcBox.code">
            </textarea>
          </div>
        </foreignObject>

        <!--
        <foreignObject :x="funcBox.size.w - 20 - 130.3" :y="funcBox.size.h - 10" :width="130.3" height="140">
          <div xmlns="http://www.w3.org/1999/xhtml">
            <select :style="{
              //appearance: 'none',
              //outline: 'none',
              border: '#56a0d3 solid 1px',
              borderRadius: '5px',
              width: funcBox.size.w - 28 + 'px',
              height: '30px',
              width: '130.3px'
            }" v-model="funcBox.type">
              <option value="common">Commonly Shared</option>
              <option value="vertex">For Vertex Shader</option>
              <option value="fragment">For Fragment Shader</option>
            </select>
          </div>
        </foreignObject>
        -->

      </g>


    </svg>

  </div>
</template>

<script>
import SVGPath from '@/components/parts/SVGConnector/SVGPath.vue'
import SVGControlBtn from '@/components/parts/SVGConnector/SVGControlBtn.vue'
import * as Template from '@/components/parts/SVGConnector/Template.js'
import * as ShaderExporter from '@/components/parts/SVGConnector/ShaderExporter.js'

export default {
  data () {
    return {
      timenow: 0,
      ready: false,
      Math,
      Date,
      dragging: false,
      notification: {
        saved: false
      },
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
  watch: {
    timenow (now, last) {
      var total = this.root.tm.length - 1
      if (last === total && now !== total) {
        this.saveTimeCapsule()
      }
    },
    shaderANS () {
      this.$emit('shader', this.shaderANS)
    }
  },
  computed: {

    shaderANS () {
      return this.calcShader()
    },
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
    shaderLineColor (funcBox) {
      return funcBox.type === 'vertex' ? '#189892' : '#62a719'
    },
    checkSaveStatus ({ force }) {
      var past = this.root.tm[this.root.tm.length - 1]
      if (
        (
          force
        ) ||
        (
          (
            // a___a is not using time machine.
            (
              past &&
              this.timenow === (this.root.tm.length - 1) &&
              JSON.stringify(this.root.doc) !== JSON.stringify(past)
            ) ||
            // new
            (!past && this.root.doc.funcBoxes.length === 0)
          )
        )
      ) {
        return true
      } else {
        return false
      }
    },
    saveTimeCapsule ({ force }) {
      if (this.checkSaveStatus({ force })) {
        this.root.doc.date = new Date()
        this.root.tm.push(JSON.parse(JSON.stringify(this.root.doc)))
        this.timenow = this.root.tm.length - 1

        this.notification.saved = true
        setTimeout(() => {
          this.notification.saved = false
        }, 1000 * 3)
      } else {
        this.notification.alreadySaved = true
        setTimeout(() => {
          this.notification.alreadySaved = false
        }, 1000 * 3)
      }
    },
    timeTravel (idx) {
      var timeDoc = this.root.tm[idx]
      if (timeDoc) {
        this.root.doc = Template.getNewDoc()
        this.$nextTick(() => {
          this.root.doc = timeDoc
          this.$forceUpdate()
        })
      }
    },
    makeBox (name) {
      this.root.doc.funcBoxes.push(Template[name]())
    },
    viewportRestore () {
      let viewportmeta = document.querySelector('meta[name="viewport"]')
      if (viewportmeta === null) {
        viewportmeta = document.createElement('meta')
        viewportmeta.setAttribute('name', 'viewport')
        document.head.appendChild(viewportmeta)

        viewportmeta = document.querySelector('meta[name="viewport"]')
      }
      viewportmeta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0')
      this.$nextTick(() => {
        viewportmeta.setAttribute('content', 'width=device-width, initial-scale=1')
      })
    },
    calcShader () {
      return ShaderExporter.generateVSFS({ doc: this.root.doc })
    },
    saveRoot () {
      var dataStr = JSON.stringify(this.root)
      var newBlobURL = URL.createObjectURL(new Blob([dataStr], { type: 'text/json' }))
      var dlAnchorElem = document.createElement('a')
      dlAnchorElem.setAttribute('href', newBlobURL)
      dlAnchorElem.setAttribute('download', 'svg-shader.json')
      dlAnchorElem.click()
    },
    restoreRoot (evt) {
      var reader = new FileReader()
      reader.onload = (evt) => {
        try {
          this.root = JSON.parse(evt.target.result)
        } catch (e) {
          console.log(e)
        }
      }
      if (evt.target.files[0]) {
        reader.readAsText(evt.target.files[0])
      }
    },
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
      var svgOffset = this.offset(this.$refs['svg-graph'])

      this.dragging = {
        startX: -svgOffset.left + offset.left + 21,
        startY: -svgOffset.top + offset.top,
        endX: -svgOffset.left + offset.left + 21,
        endY: -svgOffset.top + offset.top
      }
    },
    connectBallMove (evt, ball) {
      let factor = (window.navigator.userAgent.indexOf('Chrome') !== -1) ? 1.0 : 0.5
      this.dragging.endX += evt.velocityX * (this.fps.diff) * factor
      this.dragging.endY += evt.velocityY * (this.fps.diff) * factor
    },
    getConnEndOffset () {
      var svgOffset = this.offset(this.$refs['svg-graph'])
      var offset = {
        top: this.dragging.endY + svgOffset.top,
        left: this.dragging.endX - 21 + svgOffset.left
      }
      return offset
    },
    getConnetionFilter (offset) {
      return (eBall) => {
        try {
          var el = this.$refs['ball' + eBall.fromBall][0]
          var eOffset = this.offset(el)
          var y = eOffset.top - offset.top
          var x = eOffset.left - offset.left
          var d = Math.sqrt(x * x + y * y)
          return d < 30
        } catch (e) {
          return false
        }
      }
    },
    connectBallEnd (evt, ball) {
      var offset = this.getConnEndOffset()
      var ans = this.allInputBalls.filter(this.getConnetionFilter(offset))[0]
      if (ans) {
        try {
          this.connectBalls(ans, ball)
        } catch (e) {
          this.dragging = false
        }
      }
      this.dragging = false
    },
    connectBallEndR (evt, ball) {
      var offset = this.getConnEndOffset()
      var ans = this.allOutputBalls.filter(this.getConnetionFilter(offset))[0]
      if (ans) {
        try {
          this.connectBalls(ans, ball)
        } catch (e) {
          this.dragging = false
        }
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
    removeBox (box, idx, arr) {
      this.saveTimeCapsule({ force: true })

      box.ballsIn.forEach(this.breakUpBallsAt)
      box.ballsOut.forEach(this.breakUpBallsAt)
      arr.splice(idx, 1)
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

      /* eslint-disable */
      this.root = require('./Demo.json')
      this.timenow = this.root.tm.length - 1
      /* eslint-enable */

      this.$nextTick(() => {
        this.ready = true

        setInterval(() => {
          this.saveTimeCapsule({ force: false })
        }, 1000 * 10)
      })
    },
    onPanAll (evt, funcBox, funcBoxes) {
      var isVertex = (funcBox.type === 'vertex')
      funcBoxes.filter((eBox) => {
        if (isVertex) {
          return eBox.type === 'vertex'
        } else {
          return eBox.type === 'fragment' || eBox.type === 'common'
        }
      }).forEach((funcBox) => {
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

<style scoped>
.svg-connector{
  background-color: white;
}
.debug-console{
  position: fixed;
  bottom: 0px;
  right: 0px;
  width: 350px;
  height: calc(100vh - 56px - 350px);
  background-color: white;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.saved-enter-active, .saved-leave-active {
  transition: opacity .5s
}
.saved-enter, .saved-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}
.toolbar-taller{
  height: 100px;
}
.toolbar{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100px;
  background-color: white;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

.vs-code{
  color: #189892;
}
.fs-code{
  color: #62a719;
}

</style>
