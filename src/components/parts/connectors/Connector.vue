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
    this.doc.connectorGroups =
    [{"shaderType":"vertex","root":false,"type":"getPosition","id":"4e366004-9502-452b-a132-870f3d4eeec6","style":{"top":"880.9780743135615px","left":"126.50350897298107px"},"execID":"_2954","funcName":"getPosition_2954","code":"vec3 getPosition_2954 () {\n  return position;\n}","args":[],"returnType":"vec3","ballsIn":[],"ballsOut":[{"id":"bda5a5ff-af4b-4736-ade0-195efd2bfe41","symbol":"vec3","style":{},"label":"vec3","items":[{"id":"bda5a5ff-af4b-4736-ade0-195efd2bfe41","label":"vec3","gpID":"4e366004-9502-452b-a132-870f3d4eeec6"}],"gpID":"4e366004-9502-452b-a132-870f3d4eeec6"}]},{"shaderType":"common","root":false,"type":"vec3Modifier","id":"4673a5ff-bfc5-479f-9115-f6ab2548bc17","style":{"top":"1178.4299524629541px","left":"77.43707825234345px"},"execID":"_2538","funcName":"vec3Modifier_2538","code":"vec3 vec3Modifier_2538 (vec3 v3, float iX, float iY, float iZ) {\n  v3.xyz = v3.xyz + vec3(iX, iY, iZ);\n  return v3;\n}","args":[{"type":"vec3","name":"v3"},{"type":"float","name":"iX"},{"type":"float","name":"iY"},{"type":"float","name":"iZ"}],"returnType":"vec3","ballsIn":[{"id":"8c38a0cf-afa1-41a6-8c59-e54c090137e1","symbol":"vec3","style":{"margin-right":"25px"},"label":"vec3","items":[{"id":"8c38a0cf-afa1-41a6-8c59-e54c090137e1","label":"vec3","gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"},{"id":"bda5a5ff-af4b-4736-ade0-195efd2bfe41","label":"vec3","gpID":"4e366004-9502-452b-a132-870f3d4eeec6"}],"gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"},{"id":"9e1ad730-db34-4367-a511-8e3a9ff47e79","symbol":"float","style":{},"label":"iX","items":[{"id":"9e1ad730-db34-4367-a511-8e3a9ff47e79","label":"iX","gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}],"gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"},{"id":"8e84db8f-4e83-46ea-9ad3-02d0a7ce2a6a","symbol":"float","style":{},"label":"iY","items":[{"id":"8e84db8f-4e83-46ea-9ad3-02d0a7ce2a6a","label":"iY","gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}],"gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"},{"id":"e4680574-3b2d-4ebc-90c0-42265051367a","symbol":"float","style":{},"label":"iZ","items":[{"id":"e4680574-3b2d-4ebc-90c0-42265051367a","label":"iZ","gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}],"gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}],"ballsOut":[{"id":"605d0b79-2189-4b87-8789-a8e8ad55eb1c","symbol":"vec3","style":{},"label":"vec3","items":[{"id":"605d0b79-2189-4b87-8789-a8e8ad55eb1c","label":"vec3","gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}],"gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}]},{"shaderType":"vertex","root":true,"type":"outputPosition","id":"d0ba886e-0d7c-49d8-b0f3-6fa593d16f29","style":{"top":"1480.7407600071554px","left":"95.02057517053065px"},"execID":"_6110","funcName":"outputPosition_6110","code":"void outputPosition_6110 (vec3 position) {\n  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n  vec4 outputPos = projectionMatrix * mvPosition;\n  gl_Position = outputPos;\n}","args":[{"type":"vec3","name":"position"}],"returnType":"void","ballsIn":[{"id":"6402f5d6-4650-4cf5-bcc6-c60566c4c4d1","symbol":"position","style":{"margin-right":"25px"},"label":"vec3","items":[{"id":"6402f5d6-4650-4cf5-bcc6-c60566c4c4d1","label":"vec3","gpID":"d0ba886e-0d7c-49d8-b0f3-6fa593d16f29"},{"id":"605d0b79-2189-4b87-8789-a8e8ad55eb1c","label":"vec3","gpID":"4673a5ff-bfc5-479f-9115-f6ab2548bc17"}],"gpID":"d0ba886e-0d7c-49d8-b0f3-6fa593d16f29"}],"ballsOut":[]},{"shaderType":"fragment","root":true,"type":"outputGLFragColor","id":"e201969c-ac5c-4094-9ff9-c9870447ce67","style":{"top":"1452.8712317817158px","left":"704.2633299466638px"},"execID":"_4115","funcName":"outputGLFragColor_4115","code":"void outputGLFragColor_4115 (vec4 color) {\n  gl_FragColor = color;\n}","args":[{"type":"vec4","name":"color"}],"returnType":"void","ballsIn":[{"id":"bc7bb652-f095-4a55-a281-c7091783fe66","symbol":"vec4","style":{},"label":"color","items":[{"id":"bc7bb652-f095-4a55-a281-c7091783fe66","label":"color","gpID":"e201969c-ac5c-4094-9ff9-c9870447ce67"},{"id":"f2a47a24-7612-4ebb-8a5f-4f48df6962bc","label":"vec4","gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"}],"gpID":"e201969c-ac5c-4094-9ff9-c9870447ce67"}],"ballsOut":[]},{"shaderType":"common","root":false,"type":"getVec4","id":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f","style":{"top":"1123.9759421797285px","left":"639.6326427032965px"},"execID":"_4339","funcName":"getVec4_4339","code":"vec4 getVec4_4339 (float iX, float iY, float iZ, float iW) {\n  return vec4(iX, iY, iZ, iW);\n}","args":[{"name":"iX","type":"float"},{"name":"iY","type":"float"},{"name":"iZ","type":"float"},{"name":"iW","type":"float"}],"returnType":"vec4","ballsIn":[{"id":"5e4b99ea-7dfb-4746-b7ee-8e7901c2bab9","symbol":"float","style":{},"label":"float","items":[{"id":"5e4b99ea-7dfb-4746-b7ee-8e7901c2bab9","label":"float","gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"},{"id":"1f0b428c-f99f-4e68-af5b-3f54d6afe89c","label":"float","gpID":"efadd1db-1507-4586-8dc8-0952d5acc021"}],"gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"},{"id":"ef160554-2238-44f8-b213-6afa7edced24","symbol":"float","style":{},"label":"float","items":[{"id":"ef160554-2238-44f8-b213-6afa7edced24","label":"float","gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"},{"id":"9227d19e-8f70-41cd-b9b6-e3832685f872","label":"float","gpID":"3a47d402-0d00-4483-a057-5503162b8d59"}],"gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"},{"id":"52024c92-0590-47c5-8dc6-c58f2d2bb6ab","symbol":"float","style":{},"label":"float","items":[{"id":"52024c92-0590-47c5-8dc6-c58f2d2bb6ab","label":"float","gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"}],"gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"},{"id":"ebb3bf97-b331-47d3-afac-e782d897b194","symbol":"float","style":{},"label":"float","items":[{"id":"ebb3bf97-b331-47d3-afac-e782d897b194","label":"float","gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"},{"id":"a9884256-140e-4ef0-ae70-d3814a266417","label":"float","gpID":"da1f797d-9f89-4af6-a96d-a51df91079d0"}],"gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"}],"ballsOut":[{"id":"f2a47a24-7612-4ebb-8a5f-4f48df6962bc","symbol":"vec4","style":{},"label":"vec4","items":[{"id":"f2a47a24-7612-4ebb-8a5f-4f48df6962bc","label":"vec4","gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"}],"gpID":"ebe45022-69ea-4ed3-aa9e-1988c4b11e4f"}]},{"shaderType":"common","root":false,"type":"getConstant","id":"da1f797d-9f89-4af6-a96d-a51df91079d0","style":{"top":"854.4622242420979px","left":"795.6265602901327px"},"execID":"_4692","funcName":"getConstant_4692","code":"float getConstant_4692 () {\n  return 1.0;\n}","args":[],"returnType":"float","ballsIn":[],"ballsOut":[{"id":"a9884256-140e-4ef0-ae70-d3814a266417","symbol":"float","style":{},"label":"float","items":[{"id":"a9884256-140e-4ef0-ae70-d3814a266417","label":"float","gpID":"da1f797d-9f89-4af6-a96d-a51df91079d0"}],"gpID":"da1f797d-9f89-4af6-a96d-a51df91079d0"}]},{"shaderType":"common","root":false,"type":"time","id":"3a47d402-0d00-4483-a057-5503162b8d59","style":{"top":"610.6619497926446px","left":"609.2382465092633px"},"execID":"_264","funcName":"getTime_264","code":"float getTime_264 () {\n  return time * vUv.y;\n}","args":[],"returnType":"float","ballsIn":[],"ballsOut":[{"id":"9227d19e-8f70-41cd-b9b6-e3832685f872","symbol":"","style":{"margin-right":"25px"},"label":"float","items":[{"id":"9227d19e-8f70-41cd-b9b6-e3832685f872","label":"float","gpID":"3a47d402-0d00-4483-a057-5503162b8d59"}],"gpID":"3a47d402-0d00-4483-a057-5503162b8d59"}]},{"shaderType":"common","root":false,"type":"getConstant","id":"efadd1db-1507-4586-8dc8-0952d5acc021","style":{"top":"462.17895008606155px","left":"999.214048264873px"},"execID":"_4757","funcName":"getConstant_4757","code":"float getConstant_4757 () {\n  return vUv.x + sin(time);\n}","args":[],"returnType":"float","ballsIn":[],"ballsOut":[{"id":"1f0b428c-f99f-4e68-af5b-3f54d6afe89c","symbol":"float","style":{},"label":"float","items":[{"id":"1f0b428c-f99f-4e68-af5b-3f54d6afe89c","label":"float","gpID":"efadd1db-1507-4586-8dc8-0952d5acc021"}],"gpID":"efadd1db-1507-4586-8dc8-0952d5acc021"}]},{"shaderType":"vertex","root":true,"type":"outputPontSize","id":"1261cae4-d69f-445e-881e-9a57ecdf03f1","style":{"top":"1953.7477762560925px","left":"113.23137882383429px"},"execID":"_4656","funcName":"outputPontSize_4656","code":"void outputPontSize_4656 (float pointSize) {\n  gl_PointSize = pointSize;\n}","args":[{"type":"float","name":"pointSize"}],"returnType":"void","ballsIn":[{"id":"a065a56c-6f2c-4c5d-8327-f681b93ec0ac","symbol":"float","style":{"margin-right":"25px"},"label":"float","items":[{"id":"a065a56c-6f2c-4c5d-8327-f681b93ec0ac","label":"float","gpID":"1261cae4-d69f-445e-881e-9a57ecdf03f1"},{"id":"5b140926-92b0-4cb9-bc3c-41c484cd83e5","label":"float","gpID":"ee63b8e2-da99-470c-b42d-cd4f1f57ea3e"}],"gpID":"1261cae4-d69f-445e-881e-9a57ecdf03f1"}],"ballsOut":[]},{"shaderType":"common","root":false,"type":"getConstant","id":"ee63b8e2-da99-470c-b42d-cd4f1f57ea3e","style":{"top":"1699.0155556820728px","left":"113.74507219453605px"},"execID":"_4093","funcName":"getConstant_4093","code":"float getConstant_4093 () {\n  return 2.0;\n}","args":[],"returnType":"float","ballsIn":[],"ballsOut":[{"id":"5b140926-92b0-4cb9-bc3c-41c484cd83e5","symbol":"float","style":{},"label":"float","items":[{"id":"5b140926-92b0-4cb9-bc3c-41c484cd83e5","label":"float","gpID":"ee63b8e2-da99-470c-b42d-cd4f1f57ea3e"}],"gpID":"ee63b8e2-da99-470c-b42d-cd4f1f57ea3e"}]},{"shaderType":"vertex","root":true,"type":"outputUV","id":"c0d3bd0d-6055-4a68-9000-b154139f356c","style":{"top":"1955.52201488487px","left":"577.7015696746413px"},"execID":"_535","funcName":"outputUV_535","code":"void outputUV_535 () {\n  vUv = uv;\n}","args":[],"returnType":"void","ballsIn":[],"ballsOut":[]}]
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
