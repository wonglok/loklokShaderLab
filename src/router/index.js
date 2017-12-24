import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Editor from '@/components/pages/editor/Editor.vue'
import ShaderGUI from '@/components/pages/shader-gui/ShaderGUI.vue'
import ShaderSVG from '@/components/pages/shader-svg/ShaderSVG.vue'
import SceneBuilder from '@/components/pages/scene-builder/SceneBuilder.vue'

import Mirrage from '@/components/pages/scene-builder/Details/Mirrage.vue'
import Basic from '@/components/pages/scene-builder/Details/Basic.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Hello
    },
    {
      path: '/scene-builder',
      component: SceneBuilder,
      children: [
        {
          path: '',
          component: Basic
        },
        {
          path: 'mirrage',
          component: Mirrage
        }
      ]
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
