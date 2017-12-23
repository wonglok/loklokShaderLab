<template>
  <div class="full">

    <Renderer
      ref="renderer"
      :size="size"
      @renderer="(v) => { renderer = v }"
    >
    </Renderer>

    <PerspectiveCamera
      :fov="75"
      :aspect="size.aspect"
      :near="1"
      :far="1000"
      :position="{ x: 0, y: 0, z: 10 }"
      @camera="(v) => { camera = v; }"
    />

    <Scene @scene="(v) => { scene = v }">
      <PointLight />

      <Object3D :pz="-10">
        <Points>
          <SphereBufferGeometry />
          <MeshBasicMaterial :color="0xff00ff" :opacity="1" />
        </Points>
      </Object3D>

      <Object3D :pz="fx.pz" :key="iFX" v-for="(fx, iFX) in shaderFunz">
        <Points :ref="'pts-' + iFX">
          <SphereBufferGeometry />
          <ShaderMaterial :uniforms="fx.uniforms" :vs="fx.glsl.vs" :fs="fx.glsl.fs" />
        </Points>
      </Object3D>

    </Scene>

  </div>
</template>

<script>
import Bundle from './ThreeJS/Bundle'
export default {
  components: {
    ...Bundle
  },
  data () {
    var vs =
`
uniform float time;
varying vec2 vUv;
void main ( void ) {
  vUv = uv;
  vec3 finalPos = position;
  finalPos.y += sin(position.y + time);
  vec4 mvPosition = modelViewMatrix * vec4( finalPos, 1.0 );
  vec4 outputPos = projectionMatrix * mvPosition;
  gl_Position = outputPos;
  gl_PointSize = 1.5;
}`
    var fs =
`varying vec2 vUv;
void main () {
  gl_FragColor = vec4(vec3(vUv,0.5), 1.0);
}`

    return {
      shaderFunz: [
        {
          pz: -5,
          uniforms: {
            time: { value: 0 }
          },
          glsl: { vs, fs }
        },
        {
          pz: -10,
          uniforms: {
            time: { value: 0 }
          },
          glsl: { vs, fs }
        }
      ],
      size: {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight
      },
      renderer: false,
      scene: false,
      camera: false
    }
  },
  created () {

  },
  mounted () {
    var self = this
    function loop () {
      self.rAFID = window.requestAnimationFrame(loop)
      self.renderWebGL()
    }
    self.rAFID = window.requestAnimationFrame(loop)
  },
  methods: {
    renderWebGL () {
      this.shaderFunz.forEach((fx) => {
        fx.uniforms.time.value = window.performance.now() / 1000
      })

      if (this.scene && this.camera && this.renderer) {
        this.renderer.render(this.scene, this.camera)
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
