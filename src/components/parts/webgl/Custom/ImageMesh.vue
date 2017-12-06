<template>
  <Mesh :visible="visible" :vms="vms" @mesh="(v) => { mesh = v; }" :position="finalPosition" :scale="finalScale" :gclick="gclick" :gTS="gTS">
    <PlaneGeometry v-if="ready" :width="sWidth" :height="sHeight" :translate="finalTranslate" :scale="scale" />
    <MeshPictureMaterial :opacity="1" :color="0xffffff" :image="link" :blending="blending" :depthTest="depthTest" :transparent="transparent" :blendEquation="blendEquation" :blendSrc="blendSrc" :blendDst="blendDst" />
  </Mesh>
</template>

<script>
import * as THREE from 'three'
// import { textureCache } from '../Shared/cache'
import { llvmsMesh } from '../Mixins/llvms'
import Mesh from '../Components/Mesh'
import PlaneGeometry from '../Geometry/PlaneGeometry'
import MeshPictureMaterial from '../Material/MeshPictureMaterial'
import { textureCache } from '@/components/WebGL/Shared/cache'

export default {
  name: 'ImageMesh',
  mixins: [llvmsMesh],
  props: {
    blendEquation: {},
    blendSrc: {},
    blendDst: {},

    depthTest: {},
    transparent: {},
    blending: { default () { return THREE.NormalBlending } },
    position: {},
    link: {},
    // alphaMap: {},
    scale: {},
    gclick: {},
    gTS: {},
    translate: {},
    vms: {},
    visible: {
      default: true
    }
  },
  components: {
    Mesh,
    PlaneGeometry,
    MeshPictureMaterial
  },
  data () {
    return {
      THREE,
      mesh: false,
      ready: false,
      sWidth: 1,
      sHeight: 1
    }
  },
  mounted () {
    if (this.mesh) {
      this.mesh.visible = false
      this.mesh.userData.$component = this
    }
    if (this.link) {
      // textureCache.setCache(this.link, () => {
      // })
      var img
      var handle = () => {
        this.sWidth = img.width / 10
        this.sHeight = img.height / 10
        // if (this.scale) {
        //   this.sWidth = img.width / 10 * (this.scale.x)
        //   this.sHeight = img.height / 10 * (this.scale.y)
        // } else {
        // }
        this.ready = true
        this.mesh.visible = this.visible
        this.$nextTick(() => {
          this.$emit('ready')
        })
      }

      var storedImage = textureCache.image[this.link]
      if (storedImage) {
        img = storedImage
        handle()
      } else {
        img = new Image()
        img.onload = handle
        img.src = this.link
      }
    }
  },
  beforeDestroy () {
  },
  computed: {
  },
  watch: {
  },
  methods: {
    __add (data) {
      this.$parent.__add(data)
    },
    __remove (data) {
      this.$parent.__remove(data)
    }
  }
}
</script>

<style scoped>

</style>
