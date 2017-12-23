<template>
  <div class="hello">
    <header class="header">
      <router-link to="/" tag="span">Lok Lok Shader Editing Helper</router-link>
      <span>No DB yet. Work in progress. <a class="todo" target="_blank" href="https://docs.google.com/document/d/1tfKqN32Idr6QphLVCSCzAE918Aj-J30WR3ITV4bvXXg/edit">Todo List.</a></span>
    </header>
    <div class="taller"></div>

    <!-- <pre>{{ state.src }}</pre> -->
    <router-link to="/editor">Editor (no DB)</router-link><br/>
    <router-link to="/shader-gui">Shader GUI (no DB)</router-link><br/>
    <router-link to="/shader-svg">Shader SVG (no DB)</router-link><br/>
    <router-link to="/scene-builder">SceneBuilder (no DB)</router-link><br/>
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
