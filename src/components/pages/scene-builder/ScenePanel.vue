<template>
  <div :class="{ noline: editingShader }">
    <router-link to="/scene-builder">viewer</router-link>
    <router-link to="/scene-builder/cubecam">cubecam</router-link>
    <router-link to="/scene-builder/mirrage">mirrage</router-link>

    <router-link to="/scene-builder/fresnel">fresnel</router-link>
    <router-link to="/scene-builder/refraction">refraction</router-link>
    <router-link to="/scene-builder/woozy">woozy</router-link>
    <router-link to="/scene-builder/gpuparticles">gpuparticles</router-link>

    <div
      :key="iFX" v-for="(fx, iFX) in shaderFXs"
      class="svg-connector"
      v-show="editingShader && iFXnow === iFX"
      v-if="fx.shader.doc"
    >
      <SVGConnector :importDoc="fx.shader.doc" @close="() => { editingShader = false }" @shader="(v) => { fx.shader.vs = v.vs; fx.shader.fs = v.fs }" />
    </div>

    <div :class="{ hide: editingShader }" v-if="!editingShader">
      <div :key="iFX" v-for="(fx, iFX) in shaderFXs">
        <div v-if="!editingShader" >
            <select v-model="fx.elementType">
              <option :key="iElType" v-for="(elType, iElType) in Data.ElementType" :value="elType">{{ iElType }}</option>
            </select>
            <select v-model="fx.geometry">
              <option :key="iGeoType" v-for="(geoType, iGeoType) in Data.GeoType" :value="geoType">{{ iGeoType }}</option>
            </select>
            <select v-model="fx.material">
              <option :key="iMaterialType" v-for="(materialType, iMaterialType) in Data.MaterialType" :value="materialType">{{ iMaterialType }}</option>
            </select>
            <button v-if="fx.material === Data.MaterialType.ShaderMaterial" @click="iFXnow = iFX; editingShader = true">Edit Shader</button><input class="range" type="range" step="0.00000001" min="-50" max="50" v-model="fx.p.y" />

            <textarea class="kinda-full" v-model="fx.shader.updateFn"></textarea>
        </div>
      </div>

      <!-- <textarea class="some-full" v-model="shaderFXs[iFXnow].shader.vs"></textarea>
      <textarea class="some-full" v-model="shaderFXs[iFXnow].shader.fs"></textarea> -->
    </div>
  </div>
</template>

<script>
import SVGConnector from '@/components/parts/SVGConnector/SVGConnector.vue'
import SceneViewer from './SceneViewer.vue'
import * as Data from './Data.js'

// import * as Vuex from 'vuex'
export default {
  components: {
    SVGConnector,
    SceneViewer
  },
  data () {
    return {
      Data,
      editingShader: false,
      currentShader: false,
      iFXnow: 0
    }
  },
  props: {
    doc: {}
  },
  watch: {
    currentShader () {
      if (this.currentShader) {
        this.shaderFXs[this.iFXnow].shader.fs = this.currentShader.fs
        this.shaderFXs[this.iFXnow].shader.vs = this.currentShader.vs
      }
    },
    editingShader () {
      this.$emit('editing', this.editingShader)
    }
  },
  computed: {
    shaderFXs () {
      return this.doc.current.shaderFXs
    }
    // ...Vuex.mapGetters({
    //   'shader': 'shaders/shader',
    //   'shaders': 'shaders/shaders'
    // })
  },
  methods: {
    // ...Vuex.mapActions({
    //   'saveJSON': 'shaders/saveJSON',
    //   'restoreJSON': 'shaders/restoreJSON'
    // }),

    // ...Vuex.mapMutations({
    //   'updateShader': 'shaders/update',
    //   'addShader': 'shaders/add',
    //   'removeShader': 'shaders/remove'
    // })
  },
  mounted () {
    this.doc.current.shaderFXs.push(Data.makeBall())
    this.doc.current.shaderFXs.push(Data.makeBox())
    this.doc.current.lights.push(Data.makePointLight())
  },
  created () {
    this.$emit('editing', this.editingShader)
  }
}
</script>

<style scoped>
.top-right{
  position: fixed;
  top: 0px;
  right: 0px;
  width: 350px;
  height: 350px;
}
.taller{
  height: 260px;
}
.full{
  height: 100%;
}
.range{
  width: calc(100% - 50px);
}
.some-full{
  width: 100%;
  height: 30%;
}
.kinda-full{
  width: 100%;
  height: 10%;
}
.svg-connector{
  position: absolute;
  overflow: scroll;
  width: 100%;
  height: calc(100%);
  top: 0px;
  /* -webkit-overflow-scrolling: touch; */
}

.hide{
  display: none;
}
.noline{
  border: none;
}
</style>
