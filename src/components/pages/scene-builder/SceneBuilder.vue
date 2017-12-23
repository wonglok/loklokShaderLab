<template>
  <div class="container">
    <ScenePanel class="panel" :doc="doc"></ScenePanel>
    <SceneViewer class="viewer" :doc="doc"></SceneViewer>
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
  data () {
    return {
      doc: {
        current: {
          shaderFXs: []
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
}
.panel{
  height: 100%;
  width: 300px;
}
.viewer{
  height: 100%;
  width: calc(100% - 300px);
}
</style>
