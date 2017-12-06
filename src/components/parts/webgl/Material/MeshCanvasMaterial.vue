<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    depthTest: {
      type: Boolean,
      default: false
    },
    color: {
      type: Number,
      default: 0xbababa
    },
    canvas: {
    },
    // gOpacity: {
    //   type: Number,
    //   default: 1.0
    // },
    blending: {
      default () {
        return THREE.AdditiveBlending
        // return null
      }
    }
  },
  data () {
    return {
      texture: null,
      material: null
    }
  },
  created () {
    var texture = this.texture = new THREE.CanvasTexture(
      this.canvas,
      THREE.UVMapping,
      THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping,
      THREE.LinearFilter,
      THREE.LinearFilter
    )
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      // blending: THREE.AdditiveBlending,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      uniforms: {
        canvas: { value: texture },
        useImage: { value: typeof texture !== 'undefined' },
        time: { value: 0.0 },
        color: { value: new THREE.Color(this.color) },
        opacity: { value: 1.0 }
        // gOpacity: { value: this.gOpacity }
      },
      vertexShader: `
        varying vec2 vUv;
        void main ( void ) {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
          vec4 outputPos = projectionMatrix * mvPosition;
          gl_Position = outputPos;
        }
      `,
      fragmentShader: `
        #include <common>

        uniform bool useImage;
        uniform sampler2D canvas;

        varying vec2 vUv;
        // uniform float gOpacity;
        uniform float opacity;
        uniform float time;
        uniform vec3 color;

        void main () {
          if (useImage) {
            vec4 canvasColor = texture2D(canvas, vUv);
            gl_FragColor = vec4(vec3(canvasColor), canvasColor.a * opacity);
          } else {
            gl_FragColor = vec4(color, opacity);
          }
        }
      `
    })
    // this.material
    this.$emit('material', this.material)
    this.$emit('texture', this.texture)
    this.$emit('exec', this.exec)
  },
  watch: {
    // gOpacity () {
    //   this.material.uniforms.gOpacity.value = this.gOpacity
    // },
    color () {
      this.material.uniforms.color.value.set(this.color)
    }
  },
  methods: {
    exec () {
      if (this.material) {
        if (this.material.uniforms.texture.value) {
          this.material.uniforms.texture.value.needsUpdate = true
        }
        this.material.uniforms.time.value = window.performance.now() * 0.001
        this.material.uniforms.time.value = this.material.uniforms.time.value % 10
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
.mesh-canvas-material{
  display: none;
}
</style>
