<template>
  <div>
    <div class="connectors">
      <SVGConnector ref="connector" @shader="(v) => { shader = v }" />
    </div>
    <div class="canvas-area" ref="canvas-area">
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import SVGConnector from '@/components/parts/SVGConnector/SVGConnector.vue'

export default {
  components: {
    SVGConnector
  },
  data () {
    return {
      shader: false,
      cube: false
    }
  },
  mounted () {
    /* eslint-disable */
    var rect = this.$refs['canvas-area'].getBoundingClientRect()
    this.rect = rect
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, rect.width/rect.height, 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( rect.width, rect.height );
    renderer.setPixelRatio(window.devicePixelRatio);

    this.$refs['canvas-area'].appendChild( renderer.domElement );

    var geometry = new THREE.BoxBufferGeometry( 1, 1, 1, 20, 20, 20 );

    var cube = this.cube = new THREE.Points( geometry );
    scene.add( cube );

    camera.position.z = 3;

    var animate = function () {
      requestAnimationFrame(animate);
      if (cube.material && cube.material.uniforms && cube.material.uniforms.time) {
        cube.material.uniforms.time.value = window.performance.now() * 0.01;
      }
      cube.rotation.y += 0.05;
      renderer.render(scene, camera);
    };

    animate();
    /* eslint-enable */
  },
  watch: {
    shader () {
      this.$nextTick(() => {
        this.refreshMaterial()
      })
    }
  },
  methods: {
    makeMaterial () {
      // console.log(this.vs, this.fs)
      var rect = this.rect
      var material = new THREE.ShaderMaterial({
        uniforms: {
          resolution: { value: new THREE.Vector2(rect.width, rect.height) },
          time: { value: 0 }
        },
        vertexShader: this.shader.vs,
        fragmentShader: this.shader.fs
      })

      return material
    },
    refreshMaterial () {
      var material = this.makeMaterial()
      if (material) {
        this.cube.material = material
      }
    }
  }
}
</script>

<style scoped>
.canvas-area{
  transform: perspective(100vmax) translate3d(0px,0px,1px);
  z-index: 2000;
  position: fixed;
  top: 56px;
  right: 0px;
  width: 350px;
  height: 350px;
}
</style>

