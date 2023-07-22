import {createApp} from 'vue';
import App from '/@/App.vue';
import {createRouter, createWebHistory} from 'vue-router';

import HomePage from './views/HomePage.vue';
import TeamPage from './views/TeamPage.vue';
import RulesPage from './views/RulesPage.vue';
import LoadPlayers from './views/LoadPlayers.vue';
import PrimeVue from 'primevue/config';
import mitt from 'mitt'; // Import mitt
import './index.css';
import './style.css';
import 'primevue/resources/themes/lara-light-indigo/theme.css';
import ToastService from 'primevue/toastservice';

const emitter = mitt(); // Initialize mitt

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: HomePage,
    },
    {
      path: '/team/:id',
      name: 'TeamPage',
      component: TeamPage,
    },
    {
      path: '/rules',
      component: RulesPage,
    },
    {
      path: '/loadPlayers',
      component: LoadPlayers,
    },
  ],
});

createApp(App)
  .use(router)
  .use(PrimeVue)
  .use(ToastService)
  .provide('emitter', emitter)
  .mount('#app');
