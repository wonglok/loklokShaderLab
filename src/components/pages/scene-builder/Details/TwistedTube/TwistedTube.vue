<template>
  <div>
    <Object3D
      :px="0.0" :py="0.0" :pz="0.0"
      :rx="0.0" :ry="0.0" :rz="0.0"
      :sx="1.0" :sy="1.0" :sz="1.0"
      @element="(v) => { tube = v }"
    >
      <Object3D
        v-for="(plane, iPlane) in planes"
        :key="iPlane"
        :px="plane.p.x" :py="plane.p.y" :pz="plane.p.z"
        :rx="0.0" :ry="0.0" :rz="0.0"
        :sx="1.0" :sy="1.0" :sz="1.0"
      >
        <Mesh @element="(v) => { plane.el = v; configPlane(v, plane) }">
          <PlaneBufferGeometry></PlaneBufferGeometry>
          <!-- <MeshBasicMaterial></MeshBasicMaterial> -->
        </Mesh>
      </Object3D>
    </Object3D>
  </div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'

function makePlane ({ i, n, e }) {
  return {
    i,
    n,
    e,
    p: new THREE.Vector3(0.0, 0.0, e * 3.0)
  }
}
export default {
  components: {
    ...Bundle
  },
  data () {
    return {
      PI: Math.PI,
      TWEEN,
      tube: false,
      planes: []
    }
  },
  watch: {
    tube () {
      if (this.tube) {
        this.$parent.$emit('add', this.tube)
        this.$emit('tube', this)
      }
    }
  },
  methods: {
    configPlane (element, plane) {
      let { i, n } = plane
      element.material.side = THREE.DoubleSide
      element.material.opacity = 0.3
      element.material.color = new THREE.Color(`hsl(${Math.floor(i / n * 360)}, 100%, 50%)`)
      element.material.transparent = true
      element.material.needsUpdate = true
    },
    updateEachPlane (plane) {
      let { i, n, e } = plane
      let time = window.performance.now() / 1000
      plane.el.rotation.z = Math.PI * 2 * i / n + time * e
      plane.p.z = e * (2 + 1 * Math.sin(time))
    },
    update () {
      this.planes.forEach(this.updateEachPlane)
    }
  },
  created () {
    let n = 20
    for (let i = 0; i < n; i++) {
      this.planes.push(makePlane({ i, n, e: ((i / n) * 2.0 - 1) * 2.0 }))
    }
  }
}
</script>

<style>

</style>
