<script>
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    image: {},
    depthTest: {
      type: Boolean,
      default: true
    },
    color: {
      type: Number,
      default: 0xbababa
    },
    gOpacity: {
      type: Number,
      default: 1.0
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
      depthTest: false,
      side: THREE.DoubleSide,
      uniforms: {
        image: { value: new THREE.TextureLoader().load(this.image) },
        useImage: { value: typeof this.image !== 'undefined' },
        time: { value: 0.0 },
        color: { value: new THREE.Color(this.color) },
        opacity: { value: 1.0 },
        gOpacity: { value: this.gOpacity }
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
        uniform sampler2D image;


        varying vec2 vUv;
        uniform float gOpacity;
        uniform float opacity;
        uniform float time;
        uniform vec3 color;

        void main () {

          gl_FragColor = vec4(0.0, 0.0, 0.0, 0.5);
        }
      `
    })
    // this.material
    this.$emit('material', this.material)
    this.$emit('exec', this.exec)
  },
  watch: {
    gOpacity () {
      this.material.uniforms.gOpacity.value = this.gOpacity
    },
    color () {
      this.material.uniforms.color.value.set(this.color)
    }
  },
  methods: {
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
.mesh-hider-material{
  display: none;
}
</style>
