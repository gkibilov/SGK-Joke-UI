import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import VueSimpleAlert from 'vue-simple-alert';
import EventBus from './eventBus.service';

const socket = new SockJS('http://localhost:8080/sgk-joker-ws.connect');
const stompClient = Stomp.over(socket);
stompClient.connect(
  {},
  (res) => {
    if (res && res.headers) {
      console.log(res.headers);
      EventBus.$emit('connected', res.headers['user-name']);
    }
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

    stompClient.send('/app/getAllGames');
  },
);

export default stompClient;
