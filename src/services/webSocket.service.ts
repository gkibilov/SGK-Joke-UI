import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import VueSimpleAlert from 'vue-simple-alert';
import EventBus from './eventBus.service';

let url = `${process.env.VUE_APP_SERVER}/sgk-joker-ws.connect`;
if (localStorage.principalId) {
  url = `${url}?auth_token=${localStorage.principalId}`;
}
const socket = new SockJS(url);
const stompClient = Stomp.over(socket);

stompClient.connect(
  {},
  (res) => {
    stompClient.subscribe('/topic/games', (response) => {
      const data = JSON.parse(response.body);
      EventBus.$emit('app:topic:game', data);
    });

    stompClient.subscribe('/user/queue/errors', (error) => {
      VueSimpleAlert.alert(JSON.parse(error.body).message);
    });

    stompClient.subscribe('/user/reply', (response) => {
      const data = JSON.parse(response.body);
      EventBus.$emit('app:user:reply', data);
    });

    if (res && res.headers) {
      if (res.headers['user-name'] && res.headers['user-name'] !== 'undefined') {
        localStorage.principalId = res.headers['user-name'];
        EventBus.$emit('connected', res.headers['user-name']);
      }
    }
  },
);

export default stompClient;
