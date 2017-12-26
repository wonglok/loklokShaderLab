import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Editor from '@/components/pages/editor/Editor.vue'
import ShaderGUI from '@/components/pages/shader-gui/ShaderGUI.vue'
import ShaderSVG from '@/components/pages/shader-svg/ShaderSVG.vue'
import SceneBuilder from '@/components/pages/scene-builder/SceneBuilder.vue'

import Mirrage from '@/components/pages/scene-builder/Details/Mirrage.vue'
import Viewer from '@/components/pages/scene-builder/Details/Viewer.vue'
import CubeCam from '@/components/pages/scene-builder/Details/CubeCam.vue'

import Fresnel from '@/components/pages/scene-builder/Details/Fresnel.vue'
import Refraction from '@/components/pages/scene-builder/Details/Refraction.vue'
import Woozy from '@/components/pages/scene-builder/Details/Woozy.vue'
import GPUParticles from '@/components/pages/scene-builder/Details/GPUParticles.vue'

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
          component: Viewer
        },
        {
          path: 'mirrage',
          component: Mirrage
        },
        {
          path: 'cubecam',
          component: CubeCam
        },
        {
          path: 'fresnel',
          component: Fresnel
        },
        {
          path: 'refraction',
          component: Refraction
        },
        {
          path: 'woozy',
          component: Woozy
        },
        {
          path: 'gpuparticles',
          component: GPUParticles
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
