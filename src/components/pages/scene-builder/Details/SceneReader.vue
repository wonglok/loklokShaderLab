<template>
<div>
  <Object3D
    :pz="lig.p.z" :py="lig.p.y" :px="lig.p.x"
    :rz="lig.r.z" :ry="lig.r.y" :rx="lig.r.x"
    :sz="lig.s.z" :sy="lig.s.y" :sx="lig.s.x"

    :key="iLight" v-for="(lig, iLight) in lights"
  >
    <component v-bind:is="lig.lightType" :ref="'light-' + iLight" />
  </Object3D>

  <Object3D
    :pz="fx.p.z" :py="fx.p.y" :px="fx.p.x"
    :rz="fx.r.z" :ry="fx.r.y" :rx="fx.r.x"
    :sz="fx.s.z" :sy="fx.s.y" :sx="fx.s.x"

    :key="iFX" v-for="(fx, iFX) in shaderFXs"
    :ref="'obj-' + iFX"
  >
    <!-- <Object3D> -->
      <!-- <Object3D> -->
        <component v-bind:is="fx.elementType" :ref="'el-' + iFX">
          <component v-bind:is="fx.geometry" v-if="fx.geometry" />
          <component v-bind:is="fx.material" v-if="fx.material" :uniforms="fx.shader.uniforms" :vs="shader(fx.shader).vs" :fs="shader(fx.shader).fs" />
        </component>
      <!-- </Object3D> -->
    <!-- </Object3D> -->
  </Object3D>
</div>
</template>

<script>
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
import * as ShaderExporter from '@/components/parts/SVGConnector/ShaderExporter.js'
export default {
  components: {
    ...Bundle
  },
  props: {
    doc: {}
  },
  computed: {
    shader () {
      return (shader) => {
        if (shader.doc) {
          return ShaderExporter.generateVSFS(shader.doc)
        } else {
          return {
            vs: undefined,
            fs: undefined
          }
        }
      }
    },
    lights () {
      return this.doc.current.lights
    },
    shaderFXs () {
      return this.doc.current.shaderFXs
    }
  },
  created () {
    // event bubble up
    this.$on('add', (v) => {
      this.$parent.$emit('add', v)
    })
    this.$on('remove', (v) => {
      this.$parent.$emit('remove', v)
    })
  },
  mounted () {
  },
  methods: {
    funcRunner () {
      this.shaderFXs.forEach((fx, iFX) => {
        if (fx.shader.run && fx.shader.update.toString().indexOf(fx.shader.updateFn) !== -1) {
          fx.shader.run(this.$refs['el-' + iFX][0])
        } else {
          try {
            /* eslint-disable */
            fx.shader.update = new Function('uniforms', 'element', fx.shader.updateFn)
            /* eslint-enable */
          } catch (e) {
            console.log(e)
          }
          // console.log(this.$refs['el-' + iFX][0])
          fx.shader.run = function (component) {
            if (component) {
              fx.shader.update(fx.shader.uniforms, component.element)
            }
          }
          fx.shader.run(this.$refs['el-' + iFX][0])
        }
      })
    }
  }
}
</script>

<style>

</style>
