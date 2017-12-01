<template>
<div>

  <div class="float-me">
    <button @click="addGp('outputGLFragColor')">outputGLFragColor</button>
    <hr />
    <button @click="addGp('outputPosition')">outputPosition</button>
    <button @click="addGp('outputPontSize')">outputPontSize</button>
    <button @click="addGp('outputUV')">outputUV</button>
    <hr />
    <button @click="addGp('getPosition')">getPosition</button>
    <button @click="addGp('time')">getTime</button>
    <button @click="addGp('sin')">getSine</button>
    <button @click="addGp('getConstant')">getConstant</button>
    <button @click="addGp('getVec4')">getVec4</button>
    <hr />
    <button @click="addGp('vec3Modifier')">vec3Modifier</button>
    <button @click="addGp('vec4Modifier')">vec4Modifier</button>
    <hr />
    <button @click="getJSON()">Save Scene</button>
    <input type="file" @change="(evt) => { handleFile(evt.target.files[0]) }" />
    <hr />
  </div>
  <div class="float-me-taller"></div>

  <div class="debug-console">
    <pre>{{ vertexShaderText }}</pre>
    <hr />
    <pre>{{ fragmentShaderText }}</pre>
  </div>
  <div class="container">

    <div class="svg-con" ref="svgCon">
      <svg ref="svgEl" :width="winW * 2.5" :height="winH * 2.5">
        <!-- <defs>
          <linearGradient :id="gradientID" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(0, 0, 255, 0.25)" />
            <stop offset="100%" stop-color="rgba(0, 255, 0, 0.25)" />
          </linearGradient>
        </defs> -->

        <PathLine :refresher="refresher" :startElem="getEl(pair.items[0].id)" :endElem="getEl(pair.items[1].id)" :svgCon="svgCon" :svg="svgEl" :seed="index / connections.length" v-for="(pair, index) in connections" :key="index" />
      </svg>
    </div>

    <div class="word-con">

      <div class="word-con-rel">
        <div v-for="conntGp in doc.connectorGroups" :style="conntGp.style" class="connect-box">
          <div class="connect-box-rel">
            <div class="stick-top-right" >
              <span class="emoji" v-touch:pan="(evt) => { onPan(evt, conntGp) }">
                🐼
              </span>
              <span class="emoji" v-touch:pan="(evt) => { onPanAll(evt) }">
                ✨
              </span>
              <span class="emoji" v-touch:tap="(evt) => { removeGp(conntGp) }">
                ♻️
              </span>
            </div>
            <div class="stick-middle">
              {{ conntGp.funcName }}
              <br />
              <textarea rows="5" class=" code-box" v-model="conntGp.code" />
            </div>
            <ConnectorGroup class="stick-top" :removePair="removePair" :conntGp="conntGp" ballsMode="ballsIn" :balls="balls" :connectorGroups="doc.connectorGroups" @mergeRefs="(v) => { mergeRefs(v) }"></ConnectorGroup>
            <ConnectorGroup class="stick-bottom" :removePair="removePair" :conntGp="conntGp" ballsMode="ballsOut" :balls="balls" :connectorGroups="doc.connectorGroups"  @mergeRefs="(v) => { mergeRefs(v) }"></ConnectorGroup>
          </div>

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
import * as ShaderExport from '@/components/parts/connectors/ShaderExport.js'
export default {
  components: {
    PathLine,
    ConnectorGroup,
    draggable
  },
  data () {
    return {
      winW: window.innerWidth,
      winH: window.innerHeight,
      svgCon: false,
      svgEl: false,
      drag: false,
      doc: {
        connectorGroups: [
        ]
      },
      rAFID: 0,
      refresher: 0,
      fps: 0
    }
  },
  watch: {
    vertexShaderText () {
      this.$emit('vscode', this.vertexShaderText)
    },
    fragmentShaderText () {
      this.$emit('fscode', this.fragmentShaderText)
    }
  },
  computed: {
    vertexShaderText () {
      return ShaderExport.getCode({
        connectorGroups: this.doc.connectorGroups,
        connections: this.connections,
        shaderType: 'vertex'
      })
    },
    fragmentShaderText () {
      return ShaderExport.getCode({
        connectorGroups: this.doc.connectorGroups,
        connections: this.connections,
        shaderType: 'fragment'
      })
    },
    balls: {
      get () {
        return this.doc.connectorGroups.reduce((accu, box) => {
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
    var lastLoop = window.performance.now()
    var rAF = (thisLoop) => {
      this.fps = 1000 / (thisLoop - lastLoop)
      lastLoop = thisLoop
      this.rAFID = window.requestAnimationFrame(rAF)
      this.refresh()
    }
    this.rAFID = window.requestAnimationFrame(rAF)

    this.svgEl = this.$refs['svgEl']
    this.svgCon = this.$refs['svgCon']

    /* eslint-disable */
    // this.doc.connectorGroups =
    /* eslint-enable */

    // this.$nextTick(() => {
    //   window.scrollY = window.innerHeight * 2
    // })
  },
  methods: {
    removePair (ball) {
      var ballID = ball.id
      ball.items.forEach((baller, key, array) => {
        if (baller.id !== ballID) {
          array.splice(key, 1)
        }
      })
    },
    addGp (type) {
      var newObj = Template.makeTemplate({ type })
      newObj && this.doc.connectorGroups.push(newObj)
    },
    removeGp (obj) {
      if (window.confirm(`Remove ${obj.type}?`)) {
        var gpID = obj.id
        this.connections.filter((ball, key, arr) => {
          return ball.items.filter((baller) => {
            return baller.gpID === gpID
          }).length > 0
        }).forEach((cleanUp) => {
          this.removePair(cleanUp)
        })

        this.doc.connectorGroups.indexOf(obj) !== -1 && this.doc.connectorGroups.splice(this.doc.connectorGroups.indexOf(obj), 1)
      }
    },
    getJSON () {
      var dataStr = JSON.stringify(this.doc.connectorGroups)
      var newBlobURL = URL.createObjectURL(new Blob([dataStr], { type: 'text/json' }))
      var dlAnchorElem = document.createElement('a')
      dlAnchorElem.setAttribute('href', newBlobURL)
      dlAnchorElem.setAttribute('download', 'scene.json')
      dlAnchorElem.click()
    },
    handleFile (file) {
      var reader = new FileReader()
      reader.onload = (evt) => {
        try {
          this.doc.connectorGroups = []
          this.doc.connectorGroups = JSON.parse(evt.target.result)
        } catch (e) {
          console.log(e)
        }
      }
      reader.readAsText(file)
    },
    moveBox (evt, conntGp) {
      // console.log(evt, conntGp, 1000 / this.fps)
      var originalTop = parseFloat(conntGp.style.top.replace('px', ''))
      var originalLeft = parseFloat(conntGp.style.left.replace('px', ''))
      let dpr = (window.devicePixelRatio || 1.0)
      if (dpr >= 2) {
        dpr -= 1
      }
      let factor = 1000 / this.fps / dpr
      conntGp.style.top = ((originalTop + evt.velocityY * factor)) + 'px'
      conntGp.style.left = ((originalLeft + evt.velocityX * factor)) + 'px'
    },
    onPan (evt, conntGp) {
      this.moveBox(evt, conntGp)
    },
    onPanAll (evt) {
      this.doc.connectorGroups.forEach((conntGp) => {
        this.moveBox(evt, conntGp)
      })
    },
    mergeRefs (v) {
      this.$refs = {
        ...this.$refs,
        ...v
      }
    },
    getEl (elRef) {
      if (!this.$refs[elRef] || !this.$refs[elRef][0]) {
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
  font-size: 14px;
  position: absolute;
  width: 370px;
  height: 180px;
  border: grey solid 1px;
  background-color: rgba(255,255,255,0.8);
}
.connect-box-rel{
  position: relative;
  width: 100%;
  height: 100%;
}
.stick-top{
  position: absolute;
  top: -25px;
  left: 5px;
}
.stick-bottom{
  position: absolute;
  bottom: -30px;
  left: 5px;
}
.stick-top-right{
  position: absolute;
  top: 0px;
  right: 0px;
}
.stick-middle{
  position: absolute;
  top: 38px;
  left: 2px;
}

.code-box{
  opacity: 1;
  font-size: 12px;
  width: 360px;
  background: rgba(255,255,255,0.9);
  border: #bababa solid 1px;
  overflow: auto;
  outline: none;

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  -webkit-appearence: none;
}

.debug-console{
  background-color: rgba(255,255,255,0.8);
  z-index: 1000;
  position: fixed;
  top: 556px;
  right: 0px;
  overflow: auto;
  height: calc(100% - 56px - 500px);
  width: 500px;
}

.emoji{
  font-size: 30px;
}

.float-me{
  background-color: rgba(255,255,255,0.8);
  position: fixed;
  z-index: 1000;
  top: 53px;
  left: 0px;
  width: 100%;
}
.float-me-taller{
  height: 150px;
}
</style>
