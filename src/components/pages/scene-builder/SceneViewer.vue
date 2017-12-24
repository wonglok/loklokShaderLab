<template>
  <div ref="full">

    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="0.1"
      :far="1000"
      :position="{ x: 0, y: 0, z: 5 }"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v }">

      <Object3D
        :pz="fx.p.z" :py="fx.p.y" :px="fx.p.x"
        :rz="fx.r.z" :ry="fx.r.y" :rx="fx.r.x"
        :sz="fx.s.z" :sy="fx.s.y" :sx="fx.s.x"

        :key="iFX" v-for="(fx, iFX) in shaderFXs"
      >
        <!-- <Object3D> -->
          <!-- <Object3D> -->
            <component v-bind:is="fx.elementType" :ref="'el-' + iFX">
              <component v-bind:is="fx.geometry" />
              <ShaderMaterial :uniforms="fx.shader.uniforms" :vs="fx.shader.vs" :fs="fx.shader.fs" />
            </component>
          <!-- </Object3D> -->
        <!-- </Object3D> -->
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
export default {
  components: {
    ...Bundle
  },
  props: {
    using: {},
    doc: {}
  },
  computed: {
    shaderFXs () {
      return this.doc.current.shaderFXs
    }
  },
  watch: {
    using () {
      this.resizer()
    }
  },
  methods: {
    renderWebGL () {
      TWEEN.update()
      this.funcRunner()
      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
      }
    },
    funcRunner () {
      this.shaderFXs.forEach((fx, iFX) => {
        if (fx.shader.run && fx.shader.run.toString().indexOf(fx.shader.updateFn) !== -1) {
          fx.shader.run()
        } else {
          try {
            /* eslint-disable */
            fx.shader.update = new Function('uniforms', 'element', fx.shader.updateFn)
            /* eslint-enable */
          } catch (e) {
            console.log(e)
          }
          // console.log(this.$refs['el-' + iFX][0])
          fx.shader.run = () => {
            fx.shader.update(fx.shader.uniforms, this.$refs['el-' + iFX][0].element)
          }
          fx.shader.run()
        }
      })
    },
    funz (iFX) {
      var el = this.$refs['el-' + iFX][0].element
      return new Promise((resolve, reject) => {
        let tween2 = new TWEEN.Tween(el.position)
          .to({ y: '+3' }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onComplete(resolve)

        let tween1 = new TWEEN.Tween(el.position)
          .to({ y: '-3' }, 1000)
          .easing(TWEEN.Easing.Quadratic.Out)

        tween1.chain(tween2)
        tween1.start()
      })
    },
    async animate () {
      await this.funz(0)
    }
  },
  data () {
    return {
      resizer: () => {},
      size: {
        width: 100,
        height: 100,
        aspect: 1
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  mounted () {
    this.animate()

    var resizer = this.resizer = () => {
      var rect = this.$refs.full.getBoundingClientRect()
      this.$nextTick(() => {
        this.size = {
          width: rect.width,
          height: rect.height,
          aspect: rect.width / rect.height
        }
      })
    }
    window.addEventListener('resize', resizer.bind(this))
    resizer()

    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  beforeDestroy () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style scoped>
.full{
  width: 100%;
  height: 100%;
}
</style>
