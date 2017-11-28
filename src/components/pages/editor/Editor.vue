<template>
  <div ref="container">
    <div v-if="projectFiles.length > 0">
      <input v-model="newFilePath" />
      <button @click="() => { newFile({ path: newFilePath }) }">Add File</button>
      <button @click="() => { compileFiles() }" :disabled="compiling">Compile Files</button>

      <button v-if="!iwindow && !compiling" @click="() => { openWindow() }">OpenWindow</button>
      <button v-if="iwindow" @click="() => { closeWindow() }">closeWindow</button>

      <button v-if="!iframer && !compiling" @click="() => { openiFrame() }">OpenIframe</button>
      <button v-if="iframer" @click="() => { closeiFrame() }">closeIframe</button>

      <span v-show="compiling">Compiling</span>
      <div>
        <input type="range" style="width: 300px;" step="0.1" ref="demo-slider" @input="(evt) => { updateSlider(evt.target.value) }" />
      </div>

      <draggable v-model="projectFiles" :options="{group:'people'}" @start="drag = true" @end="drag = false" @change="() => { compileFiles() }">
        <div v-for="(pFile, pfKey) in projectFiles" :key="pfKey"><input v-model="pFile.path" style="font-size: 16px; width: 300px;" :disabled="checkDisable(pFile.path)" /> <button @click="setFile(pFile)">Edit</button></div>
      </draggable>
      <iframe :src="iframer" ref="iframer" v-if="iframer" class="iframe" />
      <ACE @save="() => { compileFiles() }" :filepath="current.file.path" v-model="current.file.src" @input="(value) => { isDirty = true; }"  theme="chrome" width="100%" :height="ace.height"></ACE>
    </div>
    <div v-else>
      Loading......
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import complier from '@/components/parts/complier/complier.js'
import ACE from '@/components/parts/editor/ACE.vue'
import { getNewProject, initTokenReplacer, newFile } from '@/components/parts/template/template.js'
export default {
  components: {
    ACE,
    draggable
  },
  data () {
    return {
      iframeLink: false,
      iwindow: false,
      iframer: false,
      complier,
      projectFiles: [],
      ace: {
        height: window.innerHeight - 50
      },
      current: {
        file: {
          path: '@/main.js',
          src: '//Welcome! Loading.....'
        }
      },
      newFilePath: `@/src/newFile.js`,
      isDirty: false,
      clean () {},
      blob: false,
      compiling: false
    }
  },
  mounted () {
    var rAF = () => {
      this.syncInfoToSubWindow()
      window.requestAnimationFrame(rAF)
    }
    window.requestAnimationFrame(rAF)

    window.addEventListener('beforeunload', (e) => {
      this.closeWindow()
    }, false)
    setInterval(() => {
      if (this.isDirty) {
        this.isDirty = false
        this.compileFiles()
      }
    }, 3333)
    setTimeout(() => {
      this.projectFiles = getNewProject({ author: 'loklok' })
      this.current.file = this.projectFiles[0]
      this.compileFiles()
    }, 1000)
    var onWorker = (evt) => {
      this.compiling = false
      // console.log(evt.data.js)
      this.onCompleteCompile({ js: evt.data.js })
    }
    this.clean = complier.setUp({ onWorker })
  },
  beforeDestroy () {
    this.clean()
    if (this.iwindow) {
      this.iwindow.close()
    }
  },
  methods: {
    checkDisable (src) {
      if (src === '@/index.html') {
        return true
      } else if (src === '@/main.js') {
        return true
      } else {
        return false
      }
    },
    getHTML ({ js }) {
      var html = (this.projectFiles || []).filter((item) => {
        return item.path === '@/index.html'
      })[0].src
      html = initTokenReplacer({ html, js })
      return html
    },
    onCompleteCompile ({ js }) {
      this.blob = new Blob([this.getHTML({ js })], { type: 'text/html' })
      if (this.blob) {
        URL.revokeObjectURL(this.blob)
      }
      this.iframeLink = URL.createObjectURL(this.blob)

      if (this.iframer) {
        this.iframer = this.iframeLink
      }

      if (this.iwindow) {
        this.iwindow.postMessage({ type: 'suspend-close', duration: 6000 }, window.location.origin)
        this.iwindow.location.assign(this.iframeLink)
      }
    },
    compileFiles () {
      this.compiling = true
      complier.compile({
        files: this.projectFiles
      })
    },
    newFile ({ path }) {
      this.projectFiles.push(
        newFile({ path: path })
      )
    },
    setFile (file) {
      this.current.file = file
      // this.compileFiles()
    },

    openWindow () {
      if (this.iframeLink) {
        var strWindowFeatures = 'menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes'
        strWindowFeatures = `directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${window.innerWidth},height=${window.innerHeight}`
        this.iwindow = window.open(this.iframeLink, 'title', strWindowFeatures)
        this.iwindow.onmessage = ({ data }) => {
          if (data.type === 'close') {
            this.closeWindow()
          }
        }
      }
    },
    openiFrame () {
      if (this.iframeLink) {
        this.iframer = this.iframeLink
      }
    },
    closeiFrame () {
      this.iframer = false
    },
    closeWindow () {
      if (this.iwindow) {
        this.iwindow.close()
        this.iwindow = false
      }
    },
    syncInfoToSubWindow () {
      if (this.$refs['demo-slider']) {
        this.updateSlider(this.$refs['demo-slider'].value)
      }
    },
    updateSlider (number) {
      var content = { type: 'cw.slider', data: { value: parseFloat(number) } }
      if (this.iwindow) {
        this.iwindow.postMessage(content, window.location.origin)
      }
      if (this.$refs['iframer']) {
        this.$refs['iframer'].contentWindow.postMessage(content, window.location.origin)
      }
    }
  }
}
</script>

<style>
.iframe{
  width: 500px;
  height: 500px;
  border: red solid 0px;
}
</style>
