<template>
  <div>
    <div class="panel">
      <div :key="iFX" v-for="(fx, iFX) in shaderFXs">

        <div class="svg-connector" v-show="useShaderEditor && iFXnow === iFX">
          <SVGConnector :importDoc="fx.shader.doc" @close="() => { useShaderEditor = false }" @shader="(v) => { fx.shader.vs = v.vs; fx.shader.fs = v.fs }" />
        </div>
        <div v-if="!useShaderEditor" >
            <button @click="iFXnow = iFX; useShaderEditor = true">edit</button><input class="range" type="range" step="0.00000001" min="-50" max="50" v-model="fx.p.y" />
            <select v-model="fx.elementType">
              <option value="Mesh">Mesh</option>
              <option value="Points">Points</option>
            </select>
            <select v-model="fx.geometry">
              <option value="SphereBufferGeometry">SphereBufferGeometry</option>
              <option value="BoxBufferGeometry">BoxBufferGeometry</option>
            </select>
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
      useShaderEditor: false,
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
    makeNewBall () {
      this.doc.current.shaderFXs.push(Data.makeBall())
      this.doc.current.shaderFXs.push(Data.makeBox())
    },
    makeNewBox () {

    }
  },
  created () {
    this.makeNewBall()
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
  position: fixed;
  overflow: scroll;
  width: 100%;
  height: 100%;
}
.panel{
  height: 100%;
}
</style>
