import Vue from 'vue';
import VueSimpleAlert from 'vue-simple-alert';
import stompClient from './services/webSocket.service';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(VueSimpleAlert);
Vue.prototype.$ws = stompClient;

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
