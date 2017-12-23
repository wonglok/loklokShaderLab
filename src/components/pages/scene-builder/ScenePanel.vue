<template>
  <div>
    <div :key="iFX" v-for="(fx, iFX) in shaderFXs">
      <button @click="iFXnow = iFX">edit</button><input class="range" type="range" step="0.00000001" min="-50" max="50" v-model="fx.py" />
      <select v-model="fx.elementType">
        <option value="Mesh">Mesh</option>
        <option value="Points">Points</option>
      </select>
      <select v-model="fx.geometry">
        <option value="SphereBufferGeometry">SphereBufferGeometry</option>
        <option value="BoxBufferGeometry">BoxBufferGeometry</option>
      </select>
    </div>
    <textarea class="some-full" v-model="shaderFXs[iFXnow].shader.vs"></textarea>
    <textarea class="some-full" v-model="shaderFXs[iFXnow].shader.fs"></textarea>
    <textarea class="some-full" v-model="shaderFXs[iFXnow].shader.updateFn" @input="() => { updateShader(shaderFXs[iFXnow].shader) }"></textarea>
  </div>
</template>

<script>
import * as Vuex from 'vuex'
export default {
  data () {
    return {
      iFXnow: 0
    }
  },
  props: {
    doc: {}
  },
  computed: {
    shaderFXs () {
      return this.doc.current.shaderFXs
    },
    ...Vuex.mapGetters({
      'shader': 'shaders/shader',
      'shaders': 'shaders/shaders'
    })
  },
  methods: {
    ...Vuex.mapActions({
      'saveJSON': 'shaders/saveJSON',
      'restoreJSON': 'shaders/restoreJSON'
    }),
    ...Vuex.mapMutations({
      'updateShader': 'shaders/update',
      'addShader': 'shaders/add',
      'removeShader': 'shaders/remove'
    })
  },
  created () {
    var shader = this.shader('abc')
    this.doc.current.shaderFXs.push({
      elementType: 'Points',
      geometry: 'SphereBufferGeometry',
      px: 0,
      py: 0,
      pz: -10,
      shader
    })
  }
}
</script>

<style scoped>
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
</style>
