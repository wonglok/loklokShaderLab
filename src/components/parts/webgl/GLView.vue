<template>
  <div class="container full" ref="container">
    <keep-alive>
      <component
        v-bind:is="elementType"
        :aspect="aspect"
        :rect="rect"
        :renderer="renderer"
        @glClick="(v) => { $emit('glClick', v) }"
        @setMouse="(v) => { setMouse = v }"
        @exec="(v) => { exec = v }"
        @scene="(v) => { scene = v }"
        @camera="(v) => { camera = v }"
      >
      </component>
    </keep-alive>
    <WebGLRenderer v-if="keepRenderer" :rect="rect" :camera="camera" :scene="scene" @renderer="(v) => { renderer = v }">
    </WebGLRenderer>
  </div>
</template>

<script>
import Bundle from '@/components/WebGL/Bundle'

var rAFID = 0

export default {
  props: {
    elementType: {
      default: 'router-view'
    },
  },
  components: {
    ...Bundle
  },
  data () {
    return {
      view: { left: 0, top: 0 },
      evlt: false,
      exec: () => {},
      uninstaller: () => {},
      setMouse: () => {},
      rect: false,
      aspect: 1.0,
      renderer: false,
      camera: false,
      scene: false,
      keepAlive: false
    }
  },
  mounted () {
    this.install()
    this.loop()
  },
  beforeDestroy () {
    this.uninstaller()
    this.stop()
  },
  computed: {
    ready () {
      return this.camera && this.scene && this.rect
    },
    keepRenderer () {
      return (this.camera && this.scene && this.rect) || this.keepAlive
    }
  },
  watch: {
    ready () {
      if (this.ready) {
        this.keepAlive = true
      }
    }
  },
  methods: {
    stop () {
      window.cancelAnimationFrame(rAFID)
    },
    loop () {
      var loopsiloop = () => {
        rAFID = window.requestAnimationFrame(loopsiloop)

        // var rect = this.$refs.container.getBoundingClientRect()
        // if (rect.left !== this.view.left || rect.top !== this.view.top) {
        //   this.evlt.resizer()
        //   this.view.left = rect.left
        //   this.view.top = rect.top
        // }

        if (this.renderer) {
          this.exec()
          this.renderer.render(this.scene, this.camera)
        }
      }
      rAFID = window.requestAnimationFrame(loopsiloop)
    },
    install () {
      var ev = this.evlt = {
        resizer: () => {
          if (!this.$refs.container) { return }
          this.rect = this.$refs.container.getBoundingClientRect()
          this.aspect = this.rect.width / this.rect.height
        },
        tsData: false,
        tmData: false,
        emitClick: false,
        onTS: (evt) => {
          evt.preventDefault()
          ev.tsData = { type: 'click', isIn: true, touches: evt.touches, pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY, rect: this.rect }
          ev.emitClick = true
          setTimeout(() => {
            ev.emitClick = false
          }, 345)
          this.setMouse({ type: 'ts', isIn: true, touches: evt.touches, pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY, rect: this.rect })
        },
        onTM: (evt) => {
          evt.preventDefault()
          var dx = ev.tsData.pageX - evt.touches[0].pageX
          var dy = ev.tsData.pageY - evt.touches[0].pageY
          if (Math.sqrt(dx * dx + dy * dy) > 80) {
            ev.emitClick = false
          }
          this.setMouse({ type: 'tm', touches: evt.touches, pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY, rect: this.rect })
        },
        onTE: (evt) => {
          if (ev.emitClick) {
            ev.emitClick = false
            this.setMouse(ev.tsData)
          }
          this.setMouse({ type: 'te', isIn: false })
        },
        onMDN: (evt) => {
          this.setMouse({ type: 'mdn', pageX: evt.clientX, pageY: evt.clientY, rect: this.rect })
        },
        onMUP: (evt) => {
          this.setMouse({ type: 'mup', pageX: evt.clientX, pageY: evt.clientY, rect: this.rect })
        },
        onMV: (evt) => {
          evt.preventDefault()
          this.setMouse({ type: 'mv', pageX: evt.pageX, pageY: evt.pageY, rect: this.rect })
        },
        onMO: (evt) => {
          this.setMouse({ isIn: true })
        },
        onME: (evt) => {
          this.setMouse({ isIn: true })
        },
        onML: (evt) => {
          this.setMouse({ isIn: false })
        },
        onCL: (evt) => {
          this.setMouse({ type: 'click', pageX: evt.pageX, pageY: evt.pageY, rect: this.rect })
        },
        onWHL: (evt) => {
          this.setMouse({ type: 'wheel', deltaX: evt.deltaX, deltaY: evt.deltaY })
        }
      }
      ev.resizer()
      console.log('emitting refresher')
      this.$emit('refresh', () => {
        ev.resizer()
      })
      var container = this.$refs.container
      container.addEventListener('mouseover', ev.onMO, false)
      container.addEventListener('mouseenter', ev.onME, false)
      container.addEventListener('mouseleave', ev.onML, false)

      container.addEventListener('mousemove', ev.onMV, false)
      container.addEventListener('mousedown', ev.onMDN, false)
      container.addEventListener('mouseup', ev.onMUP, false)

      container.addEventListener('click', ev.onCL, false)
      container.addEventListener('wheel', ev.onWHL, false)

      container.addEventListener('touchstart', ev.onTS, false)
      container.addEventListener('touchmove', ev.onTM, false)
      container.addEventListener('touchend', ev.onTE, false)
      container.style['-webkit-tap-highlight-color'] = `rgba(0,0,0,0)`
      window.addEventListener('resize', ev.resizer, false)
      this.uninstaller = () => {
        container.removeEventListener('mouseover', ev.onMO)
        container.removeEventListener('mouseenter', ev.onME)
        container.removeEventListener('mouseleave', ev.onML)

        container.removeEventListener('mousemove', ev.onMV)
        container.removeEventListener('mousedown', ev.onMDN)
        container.removeEventListener('mouseup', ev.onMUP)

        container.removeEventListener('click', ev.onCL)
        container.removeEventListener('wheel', ev.onWHL)

        container.removeEventListener('touchstart', ev.onTS)
        container.removeEventListener('touchmove', ev.onTM)
        container.removeEventListener('touchend', ev.onTE)
        window.removeEventListener('resize', ev.resizer)
      }
    }
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
