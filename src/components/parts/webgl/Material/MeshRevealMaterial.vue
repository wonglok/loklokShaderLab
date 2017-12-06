<script>
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'
export default {
  name: 'Shake',
  abstract: true,
  render () {
    return null
  },
  props: {
    image: {},
    shake: {
      type: Number,
      default: 1
    },
    depthTest: {
      type: Boolean,
      default: false
    },
    blending: {
      default () {
        return THREE.AdditiveBlending
        // return null
      }
    }
  },
  data () {
    return {
      material: null
    }
  },
  created () {
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      // blending: THREE.AdditiveBlending,
      blending: THREE.NormalBlending,
      depthTest: this.depthTest,
      uniforms: {
        image: { value: new THREE.TextureLoader().load(this.image) },
        time: { value: 0.0 },
        color: { value: new THREE.Color(this.color) },
        opacity: { value: 0.0 },
        progress: { value: 0.0 },
        initPos: { value: new THREE.Vector3(0.0, 0.0, 0.0) },
        resolution: { value: new THREE.Vector2() }
      },
      vertexShader: `
        #include <common>

        varying vec2 vUv;
        uniform float time;
        uniform float progress;
        uniform vec3 initPos;

        void main ( void ) {
          vUv = uv;

          vec3 newPos = position - (1.0 - progress) * initPos;

          vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );
          vec4 outputPos = projectionMatrix * mvPosition;
          gl_Position = outputPos;
        }
      `,
      fragmentShader: `
        #include <common>

        uniform sampler2D image;

        varying vec2 vUv;

        uniform float opacity;
        uniform float time;
        uniform vec3 color;
        uniform float progress;
        uniform vec2 resolution;

        void main () {
          vec4 _c = vec4(0.0);

          // vec4 _g = vec4(gl_FragCoord.y / resolution.y) * (1.0 - progress);

          _c += texture2D(image, vUv);

          _c.a *= opacity;

          gl_FragColor = _c;

        }
      `
    })

    // setTimeout(() => {
    //   this.reveal()
    // }, 1000)

    // this.material
    this.$emit('material', this.material)
    this.$emit('exec', this.exec)
    this.$emit('reveal', this.reveal)
  },

  watch: {
    color () {
      this.material.uniforms.color.value.set(this.color)
    }
  },
  methods: {
    reveal ({ initPos, time }) {
      this.material.uniforms.initPos.value.set(initPos.x, initPos.y, initPos.z)

      var v = {
        prg: 0,
        opacity: 0
      }

      new TWEEN.Tween(v)
        .to({ prg: 1 }, time || 1000.0)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          // this.material.uniforms.shake.value = v.s
          this.material.uniforms.progress.value = v.prg
        })
        .start()

      new TWEEN.Tween(v)
        .to({ opacity: 1 }, time || 1000.0)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          // this.material.uniforms.shake.value = v.s
          this.material.uniforms.opacity.value = v.opacity
        })
        .start()

      //
    },
    exec () {
      if (this.material) {
        this.material.uniforms.time.value = window.performance.now() * 0.001
        this.material.uniforms.time.value = this.material.uniforms.time.value % 1
      }
    }
  },
  mounted () {
    this.$parent.__add(this.material, 'material')
  },
  beforeDestroy () {
    this.$parent.__remove(this.material, 'material')
  }
}
</script>

<style scoped>
.mesh-phong-material{
  display: none;
}
</style>
