import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Editor from '@/components/pages/editor/Editor.vue'
import ShaderGUI from '@/components/pages/shader-gui/ShaderGUI.vue'
import ShaderSVG from '@/components/pages/shader-svg/ShaderSVG.vue'

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
      path: '/shader-svg',
      component: ShaderSVG
    },
    {
      path: '/editor',
      component: Editor
    }
  ]
})
