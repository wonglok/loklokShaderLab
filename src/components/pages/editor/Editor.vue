<template>
  <div ref="container" class="container">
    <div v-if="projectFiles.length > 0">
      <input v-model="newFilePath" />
      <button @click="() => { newFile({ path: newFilePath }) }">Add File</button>
      <button @click="() => { compileFiles() }" :disabled="compiling">Compile Files</button>

      <button v-if="!iwindow && !compiling" @click="() => { openWindow() }">OpenWindow</button>
      <button v-if="iwindow" @click="() => { closeWindow() }">closeWindow</button>

      <button v-if="!iframer && !compiling" @click="() => { openiFrame() }">OpenIframe</button>
      <button v-if="iframer" @click="() => { closeiFrame() }">closeIframe</button>

      <span v-show="compiling">Compiling</span>

      <br />

      <button @click="exportJS">Export Portable JS</button>
      <button @click="exportProjectFiles">Backup Project</button>
      <input type="file" @change="importProjectFiles" />
      <select @change="viewProj">
        <option :key="sample.name" v-for="sample in samples" :value="sample.prj">{{ sample.name }}</option>
      </select>

      <!-- <div>
        <input type="range" style="width: 300px;" step="0.1" ref="demo-slider" @input="(evt) => { updateSlider(evt.target.value) }" />
      </div> -->

      <draggable v-model="projectFiles" :options="{group:'people'}" @start="drag = true" @end="drag = false" @change="() => { compileFiles() }">
        <div v-for="(pFile, pfKey) in projectFiles" :key="pfKey">
          <input v-model="pFile.path" style="font-size: 16px; width: 300px;" :disabled="checkDisable(pFile.path)" />
          <button @click="setFile(pFile)">Edit</button>
          <button v-show="!checkDisable(pFile.path)" @click="removeFile(projectFiles, pfKey)">remove</button>
        </div>
      </draggable>

      <iframe width="400" height="400" :src="iframer" frameborder="0" ref="iframer" v-if="iframer" class="iframe"  allowfullscreen></iframe>
      <ACE v-if="currentFile"  @save="() => { compileFiles() }" :filepath="currentFile.path" v-model="currentFile.src" @input="(value) => { isDirty = true; }"  theme="chrome" width="100%" :height="ace.height"></ACE>
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
import { initTokenReplacer, newFile, genJS } from '@/components/parts/funpack/funpack.js'
export default {
  components: {
    ACE,
    draggable
  },
  data () {
    var projectFiles = []
    var ans = {
      samples: [
        {
          name: 'WebGL',
          prj: JSON.stringify(require('./webgl-particle.json'))
        },
        {
          name: 'Simple VueJS',
          prj: JSON.stringify(require('./simple-vue.json'))
        }
      ],
      iframeLink: false,
      iwindow: false,
      iframer: true,
      complier,
      projectFiles,
      ace: {
        height: window.innerHeight - 50
      },
      current: {
        _filePath: '@/index.html'
      },
      newFilePath: `@/src/newFile.js`,
      isDirty: false,
      clean () {},
      blob: false,
      compiling: false
    }
    return ans
  },
  computed: {
    currentFile () {
      return this.projectFiles.find((e) => { return e.path === this.current._filePath })
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
      // this.projectFiles = require('./sample.json')
      this.projectFiles = require('./webgl-particle.json')
      // this.projectFiles = getNewWebGLProject({ author: '' })
      // this.projectFiles = getNewProject({ author: 'loklok' })
      this.current._filePath = this.projectFiles[0].path
      this.compileFiles()
    }, 1000)
    var onWorker = (evt) => {
      this.compiling = false
      // console.log(evt.data.js)
      this.onCompleteCompile({ js: evt.data.js })
      this.downloadCompiledJS({ js: evt.data.js })
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
    viewProj (evt) {
      var proj = JSON.parse(evt.target.value)
      this.current._filePath = '@/index.html'
      this.projectFiles = proj
    },
    exportJS () {
      this.canDownload = true
      this.compileFiles({})
    },
    downloadCompiledJS ({ js }) {
      if (this.canDownload) {
        this.canDownload = false
        var string = genJS({ js, justJS: true })
        var anchor = document.createElement('a')
        anchor.href = URL.createObjectURL(new Blob([string]))
        anchor.download = 'loklok-portable-js.js'
        anchor.click()
      }
    },
    exportProjectFiles () {
      var files = this.projectFiles
      var json = JSON.stringify(files)
      var anchor = document.createElement('a')
      anchor.href = URL.createObjectURL(new Blob([json]))
      anchor.download = 'lab.json'
      anchor.click()
    },
    importProjectFiles (evt) {
      var file = evt.target.files[0]
      var reader = new FileReader()
      reader.onload = (ev) => {
        var backup = this.projectFiles
        try {
          this.projectFiles = JSON.parse(ev.target.result)
          var currnetFilePath = this.currentFile.path
          this.current._filePath = this.projectFiles.find(e => e.path === currnetFilePath).path
        } catch (e) {
          this.projectFiles = backup
          console.log('cannot read file')
        }
      }
      reader.readAsText(file)
    },
    checkDisable (src) {
      if (src === '@/index.html') {
        return true
      } else if (src === '@/main.js') {
        return true
      } else if (src === '@/router.js') {
        return true
      } else if (src === '@/style.css') {
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
      if (this.iframeLink) {
        URL.revokeObjectURL(this.iframeLink)
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
      this.current._filePath = ''
      this.$nextTick(() => {
        this.current._filePath = file.path
        this.$forceUpdate()
      })
    },
    removeFile (array, index) {
      if (window.confirm(`delete?`)) {
        array.splice(index, 1)
      }
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
.container{
  position: relative;
}
.iframe{
  z-index: 10;
  position: absolute;
  top: 0px;
  right: 0px;
  max-width: 400px;
  max-height: 400px;
}
</style>
