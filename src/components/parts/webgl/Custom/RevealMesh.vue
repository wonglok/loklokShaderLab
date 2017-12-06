<template>
  <Mesh :vms="vms" @mesh="(v) => { mesh = v }" :position="finalPosition" :scale="finalScale" :gclick="gclick">
    <PlaneGeometry v-if="ready" :width="finalSize.x" :height="finalSize.y" :translate="finalTranslate" :scale="scale" />
    <MeshRevealMaterial v-if="ready" :image="link" @exec="(v) => { $emit('exec', v) }" @reveal="(v) => { $emit('reveal', v) }" />
  </Mesh>
</template>

<script>
import { llvmsMesh } from '../Mixins/llvms'
import Mesh from '../Components/Mesh'
import PlaneGeometry from '../Geometry/PlaneGeometry'
import MeshRevealMaterial from '../Material/MeshRevealMaterial'
// import { textureCache } from '@/components/WebGL/Shared/cache'

export default {
  name: 'ImageMesh',
  mixins: [llvmsMesh],
  props: {
    position: {},
    link: {},
    scale: {},
    gclick: {},
    translate: {},
    vms: {},
    visible: {
      default: true
    },
    gOpacity: {},
    color: {}
  },
  // ['position', 'link', 'scale', 'gclick', 'translate', 'vms', 'gOpacity', 'color'],
  components: {
    Mesh,
    PlaneGeometry,
    MeshRevealMaterial
  },
  data () {
    return {
      mesh: false,
      ready: false,
      sWidth: 20,
      sHeight: 20
    }
  },
  mounted () {
    if (this.link) {
      var img = new Image()
      img.onload = () => {
        this.sWidth = img.width / 10
        this.sHeight = img.height / 10
        // if (this.scale) {
        //   this.sWidth = img.width / 10 * (this.scale.x)
        //   this.sHeight = img.height / 10 * (this.scale.y)
        // } else {
        // }
        this.ready = true
      }
      img.src = this.link
    } else {
      this.ready = true
    }
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
