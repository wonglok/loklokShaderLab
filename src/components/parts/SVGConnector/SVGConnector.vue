<template>
  <div>
    <button @click="saveRoot">Save File</button>
    <input type="file" @change="restoreRoot"></input>
    <br />
    <div class="debug-console">
      <h1>VertexShader</h1>
      <pre>{{ shaderANS.vs }}</pre>
      <h1>FragmentShader</h1>
      <pre>{{ shaderANS.fs }}</pre>
    </div>
    <div>
      Time Machine:
      <select v-if="this.root.tm.length > 0" @change="(evt) => { timeTravel(evt.target.value) }" ref="time-machine">
        <option :value="timeDocIndex" v-for="(timeDoc, timeDocIndex) in this.root.tm">{{ (new Date(timeDoc.date)).toDateString() + ' - ' + (new Date(timeDoc.date)).toTimeString() }}</option>
      </select>
      <button @click="saveTimeCapsule">SaveTimeCapsule</button>
      <!-- <button @click="() => { timeTravel($refs['time-machine'].value) }">Time Travel</button> -->
    </div>
    <hr />
    <button @click="(evt) => { makeBox(evt.target.innerHTML) }">vec3Modifier</button>
    <button @click="(evt) => { makeBox(evt.target.innerHTML) }">outputVertex</button>
    <button @click="(evt) => { makeBox(evt.target.innerHTML) }">outputFragment</button>
    <hr />
    <svg ref="svg-graph" width="2560" height="5120" viewBox="0 0 2560 5120">

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
        :seed="Math.max(0.3, Math.min(index / connections.length * 0.7, 0.7))" />
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
          :onpan="(evt) => {  }"
          :ontap="(evt) => { removeBox(funcBox, funcBoxIdx, root.doc.funcBoxes) }"
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
           v-if="ballOut.label !== 'void'"
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
            }" v-model="funcBox.code"></textarea>
          </div>
        </foreignObject>

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
      ready: false,
      Math,
      Date,
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
    saveTimeCapsule () {
      var past = this.root.tm[this.root.tm.length - 1]
      if (past) {
        if (JSON.stringify(past) !== JSON.stringify(this.root.doc)) {
          this.root.doc.date = new Date()
          this.root.tm.push(JSON.parse(JSON.stringify(this.root.doc)))
        }
      } else {
        this.root.doc.date = new Date()
        this.root.tm.push(JSON.parse(JSON.stringify(this.root.doc)))
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
        var eOffset = this.offset(this.$refs['ball' + eBall.fromBall][0])
        var y = eOffset.top - offset.top
        var x = eOffset.left - offset.left
        var d = Math.sqrt(x * x + y * y)
        return d < 30
      }
    },
    connectBallEnd (evt, ball) {
      var offset = this.getConnEndOffset()
      var ans = this.allInputBalls.filter(this.getConnetionFilter(offset))[0]
      if (ans) {
        this.connectBalls(ans, ball)
      }
      this.dragging = false
    },
    connectBallEndR (evt, ball) {
      var offset = this.getConnEndOffset()
      var ans = this.allOutputBalls.filter(this.getConnetionFilter(offset))[0]
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
    removeBox (box, idx, arr) {
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

      //

      /* eslint-disable */
      this.root = //
      {"doc":{"date":"2017-12-07T02:26:41.533Z","docID":"9ea865d9-a3b7-4157-b118-6c6afe78fc10","funcBoxes":[{"name":"outputVertex","type":"vertex","boxID":"33cd10e5-70b4-43b4-8068-eda84bcee977","code":"void outputVertex_9906 (vec3 position) {\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  vec4 outputPos = projectionMatrix * mvPosition;\n  gl_Position = outputPos;\n}","pos":{"x":45.39534275639608,"y":502.0050914488599},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec3","name":"position","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"c2462453-84a6-4f2f-ae8d-c7b0804831ae","defaultValue":"vec3(0.0)","toBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","toBall":"be30597d-857d-4c72-bbe3-6700aa4b0338","index":0}],"ballsOut":[{"label":"void","name":"outputVertex_9906","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"9f67e1c9-93aa-4c79-8181-3826b797070a","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true},{"name":"outputFragment","type":"fragment","boxID":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","code":"void outputFragment_2153 (vec4 color) {\n  gl_FragColor = color;\n}","pos":{"x":616.9826612037193,"y":513.3269323257534},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec4","name":"color","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"3e4fe58a-a24b-4f76-874d-772f5282f341","defaultValue":"vec4(0.5)","toBox":false,"toBall":false,"index":0}],"ballsOut":[{"label":"void","name":"outputFragment_2153","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"285b32da-d838-483f-8d75-c8557f178803","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true},{"name":"vec3Modifier","type":"common","boxID":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","code":"vec3 vec3Modifier_2549 (vec3 v3, float iX, float iY, float iZ) {\n  v3.xyz = v3.xyz + vec3(iX, iY, iZ);\n  return v3;\n}","pos":{"x":46.30722159051839,"y":180.6689499929233},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec3","name":"v3","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"e680ec40-00db-41ac-bfcd-a948d3c5889e","defaultValue":"vec3(0.0)","toBox":false,"toBall":false,"index":0},{"label":"float","name":"iX","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"a8e97757-54c4-489c-9b9e-a494e92faaa8","defaultValue":"0.0","toBox":false,"toBall":false,"index":1},{"label":"float","name":"iY","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"dd80f753-3e58-47eb-9669-f5e716d01a67","defaultValue":"0.0","toBox":false,"toBall":false,"index":2},{"label":"float","name":"iZ","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"3c4cc218-8b8d-4fe8-8171-77817d684409","defaultValue":"0.0","toBox":false,"toBall":false,"index":3}],"ballsOut":[{"label":"vec3","name":"vec3Modifier_2549","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"be30597d-857d-4c72-bbe3-6700aa4b0338","defaultValue":"vec3(0.0)","toBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","toBall":"c2462453-84a6-4f2f-ae8d-c7b0804831ae","index":0}],"isRoot":false}]},"tm":[{"date":"2017-12-07T02:26:01.534Z","docID":"9ea865d9-a3b7-4157-b118-6c6afe78fc10","funcBoxes":[]},{"date":"2017-12-07T02:26:11.533Z","docID":"9ea865d9-a3b7-4157-b118-6c6afe78fc10","funcBoxes":[{"name":"outputFragment","type":"fragment","boxID":"99f025d9-c27b-4fe6-90f4-9194c3407998","code":"void outputFragment_4900 (vec4 color) {\n  gl_FragColor = color;\n}","pos":{"x":61.48425511395705,"y":131.55951347628704},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec4","name":"color","fromBox":"99f025d9-c27b-4fe6-90f4-9194c3407998","fromBall":"4d9ebfcf-0ec6-44bd-b715-d15f35ffeaab","defaultValue":"vec4(0.5)","toBox":false,"toBall":false,"index":0}],"ballsOut":[{"label":"void","name":"outputFragment_4900","fromBox":"99f025d9-c27b-4fe6-90f4-9194c3407998","fromBall":"24838a44-0023-486a-8cc0-fdd3958086af","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true}]},{"date":"2017-12-07T02:26:21.533Z","docID":"9ea865d9-a3b7-4157-b118-6c6afe78fc10","funcBoxes":[{"name":"outputVertex","type":"vertex","boxID":"33cd10e5-70b4-43b4-8068-eda84bcee977","code":"void outputVertex_9906 (vec3 position) {\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  vec4 outputPos = projectionMatrix * mvPosition;\n  gl_Position = outputPos;\n}","pos":{"x":88.34403855492818,"y":332.86615714228464},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec3","name":"position","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"c2462453-84a6-4f2f-ae8d-c7b0804831ae","defaultValue":"vec3(0.0)","toBox":false,"toBall":false}],"ballsOut":[{"label":"void","name":"outputVertex_9906","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"9f67e1c9-93aa-4c79-8181-3826b797070a","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true},{"name":"outputFragment","type":"fragment","boxID":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","code":"void outputFragment_2153 (vec4 color) {\n  gl_FragColor = color;\n}","pos":{"x":183.7947658041381,"y":382.56113894822255},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec4","name":"color","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"3e4fe58a-a24b-4f76-874d-772f5282f341","defaultValue":"vec4(0.5)","toBox":false,"toBall":false}],"ballsOut":[{"label":"void","name":"outputFragment_2153","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"285b32da-d838-483f-8d75-c8557f178803","defaultValue":"","toBox":false,"toBall":false,"index":1}],"isRoot":true}]},{"date":"2017-12-07T02:26:31.534Z","docID":"9ea865d9-a3b7-4157-b118-6c6afe78fc10","funcBoxes":[{"name":"outputVertex","type":"vertex","boxID":"33cd10e5-70b4-43b4-8068-eda84bcee977","code":"void outputVertex_9906 (vec3 position) {\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  vec4 outputPos = projectionMatrix * mvPosition;\n  gl_Position = outputPos;\n}","pos":{"x":104.94026463126754,"y":566.2538658597101},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec3","name":"position","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"c2462453-84a6-4f2f-ae8d-c7b0804831ae","defaultValue":"vec3(0.0)","toBox":false,"toBall":false}],"ballsOut":[{"label":"void","name":"outputVertex_9906","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"9f67e1c9-93aa-4c79-8181-3826b797070a","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true},{"name":"outputFragment","type":"fragment","boxID":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","code":"void outputFragment_2153 (vec4 color) {\n  gl_FragColor = color;\n}","pos":{"x":676.5275830785907,"y":577.5757067366036},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec4","name":"color","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"3e4fe58a-a24b-4f76-874d-772f5282f341","defaultValue":"vec4(0.5)","toBox":false,"toBall":false}],"ballsOut":[{"label":"void","name":"outputFragment_2153","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"285b32da-d838-483f-8d75-c8557f178803","defaultValue":"","toBox":false,"toBall":false,"index":1}],"isRoot":true}]},{"date":"2017-12-07T02:26:41.533Z","docID":"9ea865d9-a3b7-4157-b118-6c6afe78fc10","funcBoxes":[{"name":"outputVertex","type":"vertex","boxID":"33cd10e5-70b4-43b4-8068-eda84bcee977","code":"void outputVertex_9906 (vec3 position) {\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  vec4 outputPos = projectionMatrix * mvPosition;\n  gl_Position = outputPos;\n}","pos":{"x":45.39534275639608,"y":502.0050914488599},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec3","name":"position","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"c2462453-84a6-4f2f-ae8d-c7b0804831ae","defaultValue":"vec3(0.0)","toBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","toBall":"be30597d-857d-4c72-bbe3-6700aa4b0338","index":0}],"ballsOut":[{"label":"void","name":"outputVertex_9906","fromBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","fromBall":"9f67e1c9-93aa-4c79-8181-3826b797070a","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true},{"name":"outputFragment","type":"fragment","boxID":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","code":"void outputFragment_2153 (vec4 color) {\n  gl_FragColor = color;\n}","pos":{"x":616.9826612037193,"y":513.3269323257534},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec4","name":"color","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"3e4fe58a-a24b-4f76-874d-772f5282f341","defaultValue":"vec4(0.5)","toBox":false,"toBall":false,"index":0}],"ballsOut":[{"label":"void","name":"outputFragment_2153","fromBox":"86a747a7-92b1-47f8-a1ef-2a4010d3966b","fromBall":"285b32da-d838-483f-8d75-c8557f178803","defaultValue":"","toBox":false,"toBall":false,"index":0}],"isRoot":true},{"name":"vec3Modifier","type":"common","boxID":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","code":"vec3 vec3Modifier_2549 (vec3 v3, float iX, float iY, float iZ) {\n  v3.xyz = v3.xyz + vec3(iX, iY, iZ);\n  return v3;\n}","pos":{"x":46.30722159051839,"y":180.6689499929233},"size":{"w":380,"h":200},"ballsIn":[{"label":"vec3","name":"v3","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"e680ec40-00db-41ac-bfcd-a948d3c5889e","defaultValue":"vec3(0.0)","toBox":false,"toBall":false,"index":0},{"label":"float","name":"iX","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"a8e97757-54c4-489c-9b9e-a494e92faaa8","defaultValue":"0.0","toBox":false,"toBall":false,"index":1},{"label":"float","name":"iY","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"dd80f753-3e58-47eb-9669-f5e716d01a67","defaultValue":"0.0","toBox":false,"toBall":false,"index":2},{"label":"float","name":"iZ","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"3c4cc218-8b8d-4fe8-8171-77817d684409","defaultValue":"0.0","toBox":false,"toBall":false,"index":3}],"ballsOut":[{"label":"vec3","name":"vec3Modifier_2549","fromBox":"55cf66cb-4f0c-4c8d-b0ad-0672d0ed9b8d","fromBall":"be30597d-857d-4c72-bbe3-6700aa4b0338","defaultValue":"vec3(0.0)","toBox":"33cd10e5-70b4-43b4-8068-eda84bcee977","toBall":"c2462453-84a6-4f2f-ae8d-c7b0804831ae","index":0}],"isRoot":false}]}]}
      /* eslint-enable */

      this.$nextTick(() => {
        this.ready = true

        setInterval(() => {
          this.saveTimeCapsule()
        }, 1000 * 10)
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

<style scoped>
.debug-console{
  position: fixed;
  top: 56px;
  right: 0px;
  width: 500px;
  height: 500px;
  background-color: white;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
}

</style>
