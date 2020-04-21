<template>
  <div class="chat">
    <template v-if="showChat">
      <div class="header">
        <h3>Chat</h3>
        <a @click="hideChat()">x</a>
      </div>
      <div class="body">
        <ul v-if="newMessages && newMessages.length">
          <li v-for="(message, index) in newMessages" v-bind:key="index">
            <span v-html="message"></span>
          </li>
        </ul>
      </div>
      <div class="footer">
        <input placeholder="Type..." v-on:keyup.enter="send()" v-model="text"/>
        <a class="button" @click="send()">
          <img src="../assets/send.png"/>
        </a>
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
import { Howler, Howl } from 'howler';
import { ActionType } from '../models/Message';
import EventBus from '../services/eventBus.service';
import emotions from '../services/emotion.service';
import { Player } from '../models/Player';

@Component
export default class ChatComponent extends Vue {
  @Prop() private messages!: string[];

  @Prop() private gameId!: string;

  @Prop() private player!: Player;

  private newMessages: string[] = [];

  private mapOfEmotions = this.convertEmotions(emotions);

  @Watch('messages')
  onMessagesChanged(newVal: string, oldVal: string) {
    // replace all smiles
    this.newMessages = this.messages.map((msg) => this.stringToEmoji(msg).text);
    if (oldVal && newVal && oldVal.length !== newVal.length) {
      // check last message if contains smile play sound
      const lastMessageIndex = this.messages.length - 1;
      const lastMessage = this.messages[lastMessageIndex];
      const processedMessage = this.stringToEmoji(lastMessage);
      if (processedMessage.containsSmile) {
        this.playSound(processedMessage.sound);
      } else {
        this.$notify({
          group: 'newMessage',
          title: 'New Message',
          text: processedMessage.text,
          duration: 3000,
        });
        this.newMessage = true;
        const audio = new Howl({
          src: ['message.mp3'],
          /* onplayerror: (error) => {
            console.log(error);
          },
          onerror: (error) => {
            console.log(error);
          }, */
        });
        audio.play();
      }
    }
  }

  public text = '';

  private showChat = false;

  private newMessage = false;

  mounted() {
    EventBus.$on('app:user:reply', (data) => {
      if (data.requestType === ActionType.MESSAGE) {
        this.handleMessage();
      }
    });
  }

  convertEmotions(emos) {
    return emos.reduce((map, obj) => {
      map[obj.key] = obj;
      return map;
    }, {});
  }

  stringToEmoji(text) {
    let smileKey;
    const emojies = Object.keys(this.mapOfEmotions);
    const emojiRegex = new RegExp(`:(${emojies.join('|')}):`, 'g');
    const message = text.replace(emojiRegex, (smile) => {
      smileKey = smile.slice(1, smile.length - 1);
      return `${this.mapOfEmotions[smileKey].text}`;
    });
    if (message !== text) {
      return {
        containsSmile: true,
        sound: this.mapOfEmotions[smileKey].sound,
        text: message,
      };
    }
    return {
      containsSmile: false,
      text,
    };
  }

  handleMessage() {
    this.text = '';
    setTimeout(() => {
      const container = this.$el.querySelector('.chat .body');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }

  playSound(sound: string) {
    const audio = new Howl({
      src: [sound],
      /* onplayerror: (error) => {
        console.log(error);
      },
      onerror: (error) => {
        console.log(error);
      }, */
    });
    audio.play();
  }

  send() {
    const tweet = `${this.player.name} > ${this.text}`;
    const message = {
      type: ActionType.MESSAGE,
      playerId: this.player.id,
      gameId: this.gameId,
      message: tweet,
    };
    this['$ws'].send('/app/playerMessage', JSON.stringify(message));
  }

  hideChat() {
    this.showChat = false;
    this.newMessage = false;
  }

  openChat() {
    this.showChat = true;
    this.newMessage = false;
    this.handleMessage();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  margin: 0px;
  position: fixed;
  bottom: 0;
  width: 9em;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.chat .header {
  background: #3a9fd7;
  border-radius: 3px 3px 0 0;
  text-align: left;
  display: flex;
  justify-content: space-between;
  color: #1a4762;
}

.chat .header h3 {
  margin: 0px;
  padding: 7px 4px;
  font-size: 0.5em;
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
  margin-right: 3em;
  background-color: #d4eef8;
  border-radius: 0.3em;
  color: #878787;
  padding: 4px;
  text-align: left;
  -webkit-box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 0.19);
  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2), 0 0px 10px 0 rgba(0, 0, 0, 0.19);
}

.chat .body ul li.me {
  background: white;
  margin-left: 3em;
  margin-right: 0.5em;
}

.chat .footer {
  display: flex;
  align-content: center;
}

.chat .footer {
  background-color: #ffffff;
  border: 0;
  height: 25px;
}

.chat .footer input {
  flex: 1;
}

.chat .footer .button {
  background: #3a9fd7;
  font-size: 0.6em;
  color: #fff;
  margin-top: 1px;
  position: absolute;
  right: 0;
  height: 24px;
  width: 35px;
}

.chat .newMessage {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #008000;
  margin-top: 0.3em;
}

</style>
