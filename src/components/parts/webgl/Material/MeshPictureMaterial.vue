<script>
import { textureCache } from '../Shared/cache'
import * as THREE from 'three'
export default {
  abstract: true,
  render () {
    return null
  },
  props: {
    blendEquation: {},
    blendSrc: {},
    blendDst: {},

    image: {},
    transparent: {
      default: true
    },
    depthTest: {
      type: Boolean,
      default: true
    },
    color: {
      type: Number
    },
    opacity: {
      type: Number,
      default: 1.0
    },
    blending: {
      default () {
        return THREE.NormalBlending
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
    // var vm = this
    this.material = new THREE.ShaderMaterial({
      transparent: this.transparent,
      // blending: THREE.AdditiveBlending,
      blending: this.blending,

      // blendEquation: this.blendEquation, // default
      // blendSrc: this.blendSrc, // default
      // blendDst: this.blendDst, // default

      depthTest: this.depthTest,
      defines: {
        USE_ALPHAMAP: { value: true },
        ALPHATEST: { value: 0.5 }
      },
      uniforms: {
        // alphaMap: { value: (function () {
        //   var ans = textureCache.getTexture(vm.alphaMap)
        //   ans.needsUpdate = true
        //   return ans
        // }()) },
        image: { value: textureCache.getTexture(this.image) },
        opacity: { value: this.opacity }
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
        uniform sampler2D image;
        varying vec2 vUv;
        uniform float opacity;
        void main () {
          vec4 finalColor = texture2D(image, vUv);
          finalColor.a *= opacity;
          if (finalColor.a < 0.001) {
            discard;
          } else {
            gl_FragColor = finalColor;
          }
        }
      `
    })
    // this.material
    this.$emit('material', this.material)
  },
  watch: {
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
