<template>
  <div class="chat">
    <template v-if="showChat">
      <div class="header">
        <h3>Chat</h3>
        <a @click="hideChat()">x</a>
      </div>
      <div class="body">
        <ul>
          <li v-for="(message, index) in messages" v-bind:key="index">
            <span v-html="message"></span>
          </li>
        </ul>
      </div>
      <div class="footer">
        <input placeholder="Type..." v-on:keyup.enter="send()" v-model="text"/>
        <a class="button" @click="send()">Send</a>
      </div>
    </template>
    <template v-else>
      <div class="foldedChat">
        <div class="header">
          <h3>Chat</h3>
          <span v-if="newMessage" class="newMessage"></span>
          <a @click="openChat()">show</a>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import
{
  Component,
  Prop,
  Vue,
  Watch,
} from 'vue-property-decorator';
import { AxiosError } from 'axios';
import Service from '../services/api.service';

@Component
export default class ChatComponent extends Vue {
  @Prop() private messages!: string;

  @Prop() private gameId!: string;

  @Prop() private playerId!: string;

  @Prop() private playerName!: string;

  @Watch('messages')
  onMessagesChanged(newVal: string, oldVal: string) {
    if (oldVal && newVal && oldVal.length !== newVal.length) {
      this.newMessage = true;
      const audio = new Audio();
      audio.src = 'message.mp3';
      audio.play();
    }
  }

  public text = '';

  private apiService: Service = new Service();

  private showChat = false;

  private newMessage = false;

  send() {
    const message = `${this.playerName} > ${this.text}`;
    this.apiService.get(`/sendMessage?playerId=${this.playerId}&gameId=${this.gameId}&message=${message}`).then(() => {
      this.text = '';
      const container = this.$el.querySelector('.chat .body');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }).catch((error: AxiosError) => {
      if (error.response) {
        this.$alert(error.response.data.message);
      }
    });
  }

  hideChat() {
    this.showChat = false;
    this.newMessage = false;
  }

  openChat() {
    this.showChat = true;
    this.newMessage = false;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  margin: 0px;
  position: fixed;
  bottom: 0;
  width: 9em;
}

.chat .header {
  background: #fff;
  text-align: left;
  display: flex;
  justify-content: space-between;
}

.chat .header h3 {
  margin: 0px;
  padding: 4px 4px;
  font-size: 0.6em;
}

.chat .header a {
  font-size: 0.5em;
  cursor: pointer;
  margin: 0.3em 0.5em;
  flex: 1;
  text-align: right;
}

.chat .body {
  background-color: #eae9e9;
  font-size: 0.5em;
  color: #403d3d;
  max-height: 7em;
  overflow: auto;
}

.chat .body ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.chat .body ul li {
  text-decoration: none;
  list-style: none;
  margin: 0.5em;
  background-color: #003c4654;
  border-radius: 0.3em;
  color: #fff;
  padding: 4px;
  text-align: left;
}

.chat .footer {
  display: flex;
  align-content: center;
}

.chat .footer {
  background-color: #eae9e9;
  padding: 0 5px;
}

.chat .footer input {
  flex: 1;
}

.chat .footer .button {
  background: #008000;
  font-size: 0.6em;
  color: #fff;
  padding: 8px;
}

.chat .newMessage {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #008000;
  margin-top: 0.3em;
}

</style>
