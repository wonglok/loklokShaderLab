<template>
  <div class="full">
    <div :key="iFX" v-for="(fx, iFX) in shaderFXs">
      <input class="range" type="range" step="0.00000001" min="-50" max="50" v-model="fx.pz" />
    </div>
    <textarea class="half-full" v-model="shaderFXs[0].vs"></textarea>
    <textarea class="half-full" v-model="shaderFXs[0].fs"></textarea>
  </div>
</template>

<script>
import * as Vuex from 'vuex'
export default {
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
      'addShader': 'shaders/add',
      'removeShader': 'shaders/remove'
    }),
    addFx (shaderID) {
      this.addShader({
        id: shaderID
      })
      this.shaderFXs.push({
        pz: -5,
        ...this.shader(shaderID)
      })
    }
  },
  created () {
    this.doc.current.shaderFXs.push({
      pz: -10,
      ...this.shader('abc')
    })
    this.doc.current.shaderFXs.push({
      pz: -12,
      ...this.shader('abc')
    })
    this.doc.current.shaderFXs.push({
      pz: -14,
      ...this.shader('abc')
    })
    this.doc.current.shaderFXs.push({
      pz: -16,
      ...this.shader('abc')
    })
  }
}
</script>

<style scoped>
.full{
  height: 100%;
}
.range{
  width: 100%
}
.half-full{
  width: 100%;
  height: 40%;
}
</style>
