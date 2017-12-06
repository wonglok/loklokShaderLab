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
        shake: { value: 0.0 },
        initPos: { value: new THREE.Vector3(0.0, 0.0, 0.0) }
      },
      vertexShader: `
        #include <common>

        varying vec2 vUv;
        varying vec2 vK[6];
        uniform float time;
        uniform float shake;
        uniform vec3 initPos;
        uniform float progress;

        void main ( void ) {
          vUv = uv;

          vec2 vTC = uv;
          float cv = shake * time * 100.0;

          vK[ 0] = vTC + vec2( cv * -0.024, cv * -0.02);
          vK[ 1] = vTC + vec2( cv * -0.016, cv * -0.01);
          vK[ 2] = vTC + vec2( cv * -0.008, cv * -0.00);

          vK[ 3] = vTC + vec2( cv *  0.004, cv *  0.00);
          vK[ 4] = vTC + vec2( cv *  0.012, cv *  0.01);
          vK[ 5] = vTC + vec2( cv *  0.020, cv *  0.02);

          vec3 newPos = vec3(vec3(position) - initPos * (1.0 - progress));

          newPos += (shake * 0.16667 * 2.0) * ( rand((vK[0] - uv)) + rand(vec2(0.12345)) );
          newPos += (shake * 0.16667 * 2.0) * ( rand((vK[1] - uv)) + rand(vec2(0.32355)) );
          newPos += (shake * 0.16667 * 2.0) * ( rand((vK[2] - uv)) + rand(vec2(0.88779)) );
          newPos += (shake * 0.16667 * 2.0) * ( rand((vK[3] - uv)) + rand(vec2(0.55667)) );
          newPos += (shake * 0.16667 * 2.0) * ( rand((vK[4] - uv)) + rand(vec2(0.22334)) );
          newPos += (shake * 0.16667 * 2.0) * ( rand((vK[5] - uv)) + rand(vec2(0.62235)) );

          vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );
          vec4 outputPos = projectionMatrix * mvPosition;
          gl_Position = outputPos;
        }
      `,
      fragmentShader: `
        #include <common>

        uniform sampler2D image;

        varying vec2 vUv;
        varying vec2 vK[6];

        uniform float opacity;
        uniform float time;
        uniform vec3 color;

        void main () {
          vec4 _c = vec4(0.0);

          _c += texture2D(image, vK[ 0]) * 0.00442991210551;
          _c += texture2D(image, vK[ 1]) * 0.00895781211794;
          _c += texture2D(image, vK[ 2]) * 0.02159638660533;
          _c += texture2D(image, vK[ 3]) * 0.04436833387183;
          _c += texture2D(image, vK[ 4]) * 0.07767442199335;
          _c += texture2D(image, vK[ 5]) * 0.11587662110566;
          _c += texture2D(image, vK[ 0]) * 0.14730805612155;

          _c += texture2D(image, vUv) * 0.159576912161;

          _c += texture2D(image, vK[ 0]) * 0.147308056121;
          _c += texture2D(image, vK[ 1]) * 0.115876621105;
          _c += texture2D(image, vK[ 2]) * 0.077674421993;
          _c += texture2D(image, vK[ 3]) * 0.044368333871;
          _c += texture2D(image, vK[ 4]) * 0.021596386605;
          _c += texture2D(image, vK[ 5]) * 0.008957812117;
          _c += texture2D(image, vK[ 0]) * 0.004429912105;

          _c.a *= opacity;

          gl_FragColor = _c;

        }
      `
    })

    // setTimeout(() => {
    //   this.shakeShake()
    // }, 1000)

    // this.material
    this.$emit('material', this.material)
    this.$emit('exec', this.exec)
    this.$emit('shake', this.shakeShake)
  },

  watch: {
    color () {
      this.material.uniforms.color.value.set(this.color)
    }
  },
  methods: {
    shakeShake ({ initPos, timeRatio }) {
      this.material.uniforms.initPos.value.set(initPos.x, initPos.y, initPos.z)
      timeRatio = timeRatio || 1.0

      var v = {
        prg: 0,
        o: 0,
        s: 1.0
      }

      new TWEEN.Tween(v)
        .to({ prg: 1 }, timeRatio * 380 * 0.5)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          // this.material.uniforms.shake.value = v.s
          this.material.uniforms.progress.value = v.prg
        })
        .start()

      new TWEEN.Tween(v)
        .to({ o: 1 }, timeRatio * 380 * 0.25)
        .easing(TWEEN.Easing.Bounce.InOut)
        .onUpdate(() => {
          // this.material.uniforms.shake.value = v.s
          this.material.uniforms.opacity.value = v.o
        })
        .start()

      new TWEEN.Tween(v)
        .to({ s: 0 }, timeRatio * 600 * 0.5)
        .easing(TWEEN.Easing.Bounce.Out)
        .onUpdate(() => {
          this.material.uniforms.shake.value = v.s
          // this.material.uniforms.opacity.value = v.o
        })
        .start()
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
