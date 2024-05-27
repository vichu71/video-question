// router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import Alta from '@/views/Alta.vue';
import QuestionVideo from '@/views/QuestionVideo.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'alta',
    component: Alta
  },
  {
    path: '/question-video/:nombre', // Usamos un parámetro dinámico para el nombre
    name: 'question-video',
    component: QuestionVideo
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
