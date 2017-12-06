<template>
  <div class="hello">
    <!-- <pre>{{ state.src }}</pre> -->
    <router-link to="/editor">Editor (no DB)</router-link><br/>
    <router-link to="/shader-gui">Shader GUI (no DB)</router-link><br/>
    <router-link to="/shader-svg">Shader SVG (no DB)</router-link><br/>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
    }
  },
  methods: {
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
