<template>
  <div class="container">
    <SceneViewer class="viewer" :class="{ 'editing': editing }" :doc="doc" ref="viewer"></SceneViewer>
    <ScenePanel class="panel" :class="{ 'editing': editing }" :doc="doc" @editing="(v) => { editing = v }"></ScenePanel>
  </div>
</template>

<script>
import SceneViewer from './SceneViewer.vue'
import ScenePanel from './ScenePanel.vue'
export default {
  components: {
    SceneViewer,
    ScenePanel
  },
  watch: {
    editing () {
      this.$refs.viewer.resizer()
    }
  },
  data () {
    return {
      editing: true,
      doc: {
        current: {
          shaderFXs: [],
          lights: []
        },
        preview: {},
        tm: []
      }
    }
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row-reverse;
}
.panel{
  border-right: black solid 1px;
  height: 100%;
  width: 300px;
}
.viewer{
  height: 100%;
  width: calc(100% - 300px);
}
.panel.editing{
  width: 0px;
}
.viewer.editing{
  width: 100%;
}
</style>
