// import TWEEN from '@tweenjs/tween.js'
export default {
  data () {
    return {
      // TWEEN,
      scrollerTarget: false,
      scrollStack: {},
      srAFID: 0,
      scrollerState: {
        tsX: 0,
        tsY: 0,
        dX: 0,
        dY: 0,
        status: '',
        enable: {
          x: false,
          y: true
        },
        bound: {
          yMax: 0,
          yMin: 0,
          xMax: 0,
          xMin: 0
        }
      }
    }
  },
  computed: {
  },
  methods: {
    scrollEntry (args) {
      for (var stackKey in this.scrollStack) {
        let setMouse = this.scrollStack[stackKey]
        if (setMouse) {
          setMouse(args)
        }
      }
    },
    emitHandler () {
      this.$emit('setMouse', this.scrollEntry)
    },
    tryMaximiseScroller ({ pos, extra, params }) {
      this.scrollerState.bound.yMax = (-pos.y * 1.25 - params.meshHeight) + (extra || 0)
    },
    setupScroller ({ target, enable, bound }) {
      // if (!this.mouseStack) {
      //   this.$emit('setMouse', this.scrollEntry)
      // }

      if (bound) {
        this.scrollerState.bound = bound
      }
      this.scrollStack.scrollMe = this.scrollMe
      this.scrollerTarget = target
      if (this.scrollerState.enable) {
        this.scrollerState.enable = enable
      }

      var rAF = () => {
        if (this.scrollerState.enable.y) {
          this.scrollerTarget.object3d.position.y -= this.scrollerState.dY
          this.scrollerState.dY *= 0.954321
          this.scrollerPYFast({ bound: this.scrollerState.bound })
        }
        if (this.scrollerState.enable.x) {
          this.scrollerTarget.object3d.position.x += this.scrollerState.dX
          this.scrollerState.dX *= 0.954321
        }
        this.srAFID = window.requestAnimationFrame(rAF)
      }
      this.srAFID = window.requestAnimationFrame(rAF)
    },
    scrollerPYFast ({ bound }) {
      if (this.scrollerTarget) {
        if (this.scrollerTarget.object3d.position.y > bound.yMax) {
          let varying = { ...this.scrollerTarget.object3d.position }
          varying.y -= (varying.y - bound.yMax) * 0.24
          this.scrollerTarget.object3d.position.set(varying.x, varying.y, varying.z)
        }
        if (this.scrollerTarget.object3d.position.y < bound.yMin) {
          let varying = { ...this.scrollerTarget.object3d.position }
          varying.y -= (varying.y - bound.yMin) * 0.24
          this.scrollerTarget.object3d.position.set(varying.x, varying.y, varying.z)
        }
      }
    },
    scrollMe (args) {
      switch (args.type) {
        case 'ts':
          this.scrollerTouchStart(args)
          break
        case 'tm':
          this.scrollerTouchMove(args)
          break
        case 'te':
          this.scrollerTouchEnd(args)
          break
        case 'wheel':
          this.scrollerWheel(args)
          break
      }
    },
    scrollerTouchStart ({ pageX, pageY, rect }) {
      this.scrollerState.status = 'ts'
      this.scrollerState.tsX = pageX - rect.left
      this.scrollerState.tsY = pageY - rect.top
    },
    scrollerTouchMove ({ pageX, pageY, rect }) {
      this.scrollerState.status = 'tm'

      this.scrollerState.dX = pageX - rect.left - this.scrollerState.tsX
      this.scrollerState.dY = pageY - rect.top - this.scrollerState.tsY

      this.scrollerState.tsX = pageX - rect.left
      this.scrollerState.tsY = pageY - rect.top

      this.scrollerState.dX *= 0.1
      this.scrollerState.dY *= 0.1
    },
    scrollerWheel ({ deltaX, deltaY }) {
      this.scrollerState.status = 'tm'

      this.scrollerState.dX = deltaX
      this.scrollerState.dY = -deltaY

      this.scrollerState.dX *= 0.1
      this.scrollerState.dY *= 0.1
    },
    scrollerTouchEnd () {

    },
    cleanupScroller () {
      this.$emit('setMouse', () => {
      })
      window.cancelAnimationFrame(this.srAFID)
    }
  }
}
