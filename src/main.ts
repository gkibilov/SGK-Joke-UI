import Vue from 'vue';
import VueSimpleAlert from 'vue-simple-alert';
import Notifications from 'vue-notification';
import stompClient from './services/webSocket.service';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueSimpleAlert);
Vue.use(Notifications);
Vue.prototype.$ws = stompClient;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
