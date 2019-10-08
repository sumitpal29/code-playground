import Vue from 'vue'
import Router from 'vue-router'
import Playground from '@/components/Playground'
import Board from '@/components/Board'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Playground',
      component: Playground
    },
    {
      path: '/load',
      name: 'Board',
      component: Board,
      props: true
    }
  ]
})
