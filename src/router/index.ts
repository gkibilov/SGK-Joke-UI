import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import GameComponent from '../components/GameComponent.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/game/:id/:gameId',
    name: 'Game',
    component: GameComponent,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
