<template>
  <div>
    <div class="connectors">
      <Connector ref="connector" @vscode="(v) => { vs = v; }" @fscode="(v) => { fs = v; }" />
    </div>
    <div class="canvas-area" ref="canvas-area">
    </div>

  </div>
</template>

<script>
import * as THREE from 'three'
import Connector from '@/components/parts/connectors/Connector.vue'
export default {
  components: {
    Connector
  },
  data () {
    return {
      fs: '',
      vs: '',
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
    fs () {
      this.$nextTick(() => {
        this.refreshMaterial()
      })
    },
    vs () {
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
        vertexShader: this.vs,
        fragmentShader: this.fs
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
  z-index: 2000;
  position: fixed;
  top: 56px;
  right: 0px;
  width: 500px;
  height: 500px;
}
.connectors{

}

</style>
