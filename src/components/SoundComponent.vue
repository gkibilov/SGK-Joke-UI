<template>
  <div class="soundBox">
    <div class="soundItem" @click="sendSound(emotion)"
          v-for="emotion in emotions" v-bind:key='emotion.key'>
      <img :src="require(`../assets/emotions/${emotion.key}.png`)" />
    </div>
  </div>
</template>

<script lang="ts">
import
{
  Component,
  Prop,
  Vue,
} from 'vue-property-decorator';
import emotions from '../services/emotion.service';
import { ActionType } from '../models/Message';
import { Sound } from '../models/Sound';

@Component
export default class ChatComponent extends Vue {
  @Prop(String) readonly toPlayer: string | undefined;

  private emotions = emotions;

  sendSound(sound: Sound) {
    const { gameId, id } = this.$route.params;
    const tweet = `${localStorage.playersTempName} to ${this.toPlayer} > :${sound.key}:`;
    const message = {
      type: ActionType.MESSAGE,
      playerId: id,
      gameId,
      message: tweet,
    };
    this['$ws'].send('/app/playerMessage', JSON.stringify(message));
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.soundBox {
  position: absolute;
  display: flex;
  padding: 1em;
  z-index: 1;
  background: #121f2a;
}

.soundBox .soundItem{
  border: 1px solid;
  padding: 0.1em;
  background: #233e53;
  margin: 3px;
  cursor: pointer;
  -webkit-box-flex: 1;
}

.soundBox .soundItem:hover{
  background: #ffffcc;
  border: 1px solid #233e53;
}
</style>
