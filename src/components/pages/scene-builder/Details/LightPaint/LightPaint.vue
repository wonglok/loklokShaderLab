<template>
  <div>
    <SpotLight
      :key="iLight"
      v-for="(light, iLight) in lights"
      @element="(v) => { configLight(light, v) }"
    >
    </SpotLight>

    <Object3D
      @element="(v) => { paint = v }"
      :px="plane.p.x" :py="plane.p.y" :pz="plane.p.z"
      :rx="0.0" :ry="0.0" :rz="0.0"
      :sx="100.0" :sy="1.0" :sz="100.0"
    >
      <Mesh @element="(v) => { configPlane(plane, v) }">
        <BoxBufferGeometry></BoxBufferGeometry>
        <MeshPhongMaterial :color="0xbababa"></MeshPhongMaterial>
      </Mesh>
    </Object3D>

  </div>
</template>

<script>
import * as THREE from 'three'
import * as TWEEN from '@tweenjs/tween.js'
import Bundle from '@/components/parts/scene-area/ThreeJS/Bundle'

function makeLight ({ i, e, n }) {
  return {
    i,
    e,
    n,
    el: false,
    p: new THREE.Vector3(0.0, 0.0, 0.0)
  }
}

function makePlane () {
  return {
    el: false,
    p: new THREE.Vector3(0.0, 0.0, 0.0)
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
      paint: false,
      lights: [],
      plane: makePlane()
    }
  },
  watch: {
    paint () {
      if (this.paint) {
        this.$parent.$emit('add', new THREE.AmbientLight(0xffffff, 0.1))
        this.$parent.$emit('add', this.paint)
        this.$emit('paint', this)
      }
    }
  },
  methods: {
    configLight (light, el) {
      light.el = el
      el.position.set(10, 10, 10)
      el.color = new THREE.Color(0xbababa)
      el.intensity = 2
      el.distance = 50
      el.angle = 0.3
      el.penumbra = 0.2
      el.decay = 2
    },
    configPlane (plane, el) {
      el.material.color.set(0x808080)
      // plane.el = el
      // el.material.side = THREE.DoubleSide
    },
    update () {

    },
    createLightObj () {
      let n = 5
      for (let i = 0; i < n; i++) {
        this.lights.push(makeLight({ i, e: (i / 5) + -0.5 }))
      }
    }
  },
  created () {
    this.createLightObj()
  }
}
</script>

<style>

</style>
