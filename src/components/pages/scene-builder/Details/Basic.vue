<template>
<div ref="toucher">

  <OrbitControls v-if="camera" :toucher="$refs['toucher']" :camera="camera" />
  <PerspectiveCamera
    :fov="75"
    :aspect="size.aspect"
    :near="0.1"
    :far="1000"
    :position="cam.pos"
    @camera="(v) => { camera = v; }"
  />

  <Scene @scene="(v) => { scene = v }">

    <CubeTexture
      :items="[
        require('../textures/cubemap/shopping/px.png'), require('../textures/cubemap/shopping/nx.png'),
        require('../textures/cubemap/shopping/py.png'), require('../textures/cubemap/shopping/ny.png'),
        require('../textures/cubemap/shopping/pz.png'), require('../textures/cubemap/shopping/nz.png')
      ]"
      @cube-texture="(v) => { cubeTexture = v }"
    ></CubeTexture>

    <Mesh @mesh="(v) => { refractionBox = v }">
      <BoxBufferGeometry></BoxBufferGeometry>
      <MeshBasicMaterial></MeshBasicMaterial>
    </Mesh>

    <Object3D
      :pz="lig.p.z" :py="lig.p.y" :px="lig.p.x"
      :rz="lig.r.z" :ry="lig.r.y" :rx="lig.r.x"
      :sz="lig.s.z" :sy="lig.s.y" :sx="lig.s.x"

      :key="iLight" v-for="(lig, iLight) in lights"
    >
      <component v-bind:is="lig.lightType" :ref="'light-' + iLight" />
    </Object3D>

    <Object3D
      :visible="visible"
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
            <component v-bind:is="fx.material" v-if="fx.material" :uniforms="fx.shader.uniforms" :vs="fx.shader.vs" :fs="fx.shader.fs" />
          </component>
        <!-- </Object3D> -->
      <!-- </Object3D> -->
    </Object3D>

  </Scene>

</div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'
export default {
  THREE,
  components: {
    ...Bundle
  },
  props: {
    size: {},
    renderer: {},
    doc: {}
  },
  data () {
    return {
      refractionBox: false,
      cubeTexture: false,
      cam: {
        pos: { x: -3, y: 0, z: 10 }
      },
      ready: false,
      cubeCamera: false,
      visible: true,
      resizer: () => {},
      scene: false,
      camera: false
    }
  },
  computed: {
    lights () {
      return this.doc.current.lights
    },
    shaderFXs () {
      return this.doc.current.shaderFXs
    }
  },
  watch: {
    camera () {
      if (this.camera && this.renderer) {
        this.ready = true
      }
    },
    renderer () {
      if (this.camera && this.renderer) {
        this.ready = true
      }
    },
    ready () {
      if (this.ready) {
        this.setup()
      }
    },
    refractionBox () {
      this.trySetupReFraction()
    },
    cubeTexture () {
      this.trySetupReFraction()
    }
  },
  methods: {
    trySetupReFraction () {
      if (this.cubeTexture && this.refractionBox) {
        this.renderer.setClearColor(0xeeeeee)
        this.renderer.setFaceCulling(THREE.CullFaceNone)
        this.scene.background = this.cubeTexture
        this.cubeTexture.format = THREE.RGBFormat
        this.cubeTexture.needsUpdate = true

        let material = this.refractionBox.material
        material.color = new THREE.Color(0xeeeeee)
        material.refractionRatio = 0.98
        material.reflectionRatio = 0.98
        material.envMap = this.cubeTexture
        material.envMap.mapping = THREE.CubeRefractionMapping
        material.needsUpdate = true
      }
    },
    setup () {
      // this.scene.background
      // this.renderer.setClearColor(0xeeeeee)
    },
    renderWebGL () {
      TWEEN.update()
      if (this.refractionBox) {
        this.refractionBox.rotation.x -= 0.01
        this.refractionBox.rotation.y += 0.01
      }
      if (this.scene && this.camera && this.renderer) {
        this.funcRunner()
        this.renderer.render(this.scene, this.camera)
      }
    },
    funcRunner () {
      this.shaderFXs.forEach((fx, iFX) => {
        if (fx.shader.run && fx.shader.update.toString().indexOf(fx.shader.updateFn) !== -1) {
          fx.shader.run.call(this)
        } else {
          try {
            /* eslint-disable */
            fx.shader.update = new Function('uniforms', 'element', fx.shader.updateFn)
            /* eslint-enable */
          } catch (e) {
            console.log(e)
          }
          // console.log(this.$refs['el-' + iFX][0])
          fx.shader.run = function () {
            if (this.$refs['el-' + iFX][0]) {
              fx.shader.update(fx.shader.uniforms, this.$refs['el-' + iFX][0].element)
            }
          }
          fx.shader.run.call(this)
        }
      })
    }
  },
  activated () {
    // this.$nextTick(() => {
    //   this.$refs['refractor'].animate()
    // })
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  deactivated () {
    window.cancelAnimationFrame(this.rAFID)
  }
}
</script>

<style>

</style>

