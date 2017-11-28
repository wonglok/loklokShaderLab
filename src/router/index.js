import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Editor from '@/components/pages/editor/Editor.vue'
import ShaderGUI from '@/components/pages/shader-gui/ShaderGUI.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/shader-gui',
      component: ShaderGUI
    },
    {
      path: '/editor',
      component: Editor
    }
  ]
})
