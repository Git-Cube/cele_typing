import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Keyboard from '../views/Keyboard.vue'
import Typing from '../views/Typing.vue'
import About from '../views/About.vue'
import CnTypingTraining from '../views/CnTypingTraining.vue'
import EnTypingTraining from '../views/EnTypingTraining.vue'
import PrTypingTraining from '../views/PrTypingTraining.vue'
import KeyboardTraining from '../views/KeyboardTraining.vue'
import Report from '../views/Report.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      meta: { showHeader: true },
    },
    {
      path: '/keyboard',
      name: 'Keyboard',
      component: Keyboard,
      meta: { showHeader: true },
    },
    {
      path: '/typing',
      name: 'Typing',
      component: Typing,
      meta: { showHeader: true },
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: { showHeader: true },
    },
    {
      path: '/cn-typing-training',
      name: 'CnTypingTraining',
      component: CnTypingTraining,
      meta: { showHeader: false },
    },
    {
      path: '/en-typing-training',
      name: 'EnTypingTraining',
      component: EnTypingTraining,
      meta: { showHeader: false },
    },
    {
      path: '/pr-typing-training',
      name: 'PrTypingTraining',
      component: PrTypingTraining,
      meta: { showHeader: false },
    },
    {
      path: '/report',
      name: 'Report',
      component: Report,
      meta: { showHeader: false },
    },
    {
      path: '/keyboard-training',
      name: 'KeyboardTraining',
      component: KeyboardTraining,
      meta: { showHeader: false },
    },
  ],
})

export default router
