<template>
  <div class="account">
    <div id="header" v-if="players.length > 0">
      <div>
        <div class="emptyPlaceHolder"></div>
        <div v-for="callIndex in players[1].calls.length + players[1].pulkaScores.length"
              v-bind:key="callIndex">
              <div v-if="callIndex === 9
                        || callIndex === 14
                        || callIndex === 23" class="emptyPlaceHolder"></div>
              <span v-else>
                {{roundNumbers[callIndex-1]}}
              </span>
        </div>
      </div>
      <div v-for='index in 4' v-bind:key='index'>
        <span v-if="players[index].name">
          {{ players[index].name }}
        </span>
        <div class="scores"
              v-for="callIndex in players[index].calls.length"
              v-bind:key="callIndex">
            <span
              :class="{ lineThrough: players[index].bonusMultipliers.length
                        && players[index].bonusMultipliers[callIndex-1] === 0 }">
              <span :class="scoreColor(players[index], callIndex)">
              {{players[index].calls[callIndex-1]}} -
              {{players[index].scores[callIndex-1] === -200 ?
               '|---|' : players[index].scores[callIndex-1]}}
              </span>
            </span>
            <span v-if="players[index].bonusMultipliers.length">
              {{players[index].bonusMultipliers[callIndex-1] === 2 ? 'x2' : ''}}
            </span>
            <div class="pulkaScore" v-if="callIndex === 8 && players[index].pulkaScores
                && players[index].pulkaScores[0] != undefined
                && players[index].pulkaScores.length">
              {{(players[index].pulkaScores[0]/100).toFixed(1)}}
            </div>
            <div class="pulkaScore" v-if="callIndex === 12 && players[index].pulkaScores
                && players[index].pulkaScores[0] != undefined
                && players[index].pulkaScores.length">
              {{(players[index].pulkaScores[1]/100).toFixed(1)}}
            </div>
            <div class="pulkaScore" v-if="callIndex === 20 && players[index].pulkaScores
                && players[index].pulkaScores[0] != undefined
                && players[index].pulkaScores.length">
              {{(players[index].pulkaScores[2]/100).toFixed(1)}}
            </div>
            <!-- <div class="pulkaScore" v-if="callIndex === 24 && players[index].pulkaScores
                && players[index].pulkaScores.length">
              {{ (players[index].pulkaScores[3]/100).toFixed(1)}}
            </div> -->
        </div>
        <div class="total" v-if="(players[index].calls.length < 8
                                  && players[index].calls.length > 0)
                                || (players[index].calls.length < 12
                                    && players[index].calls.length > 8)
                                || (players[index].calls.length < 20
                                    && players[index].calls.length > 12)
                                || players[index].calls.length > 20">
          {{(players[index].totalScore / 100).toFixed(1)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Player } from '../models/Player';

@Component
export default class AccountComponent extends Vue {
  @Prop({ type: Array, required: true })
  players!: Array<Player>;

  @Prop({ type: Array, required: true })
  numberOfCards!: Array<number>;

  private roundNumbers: number[] =
  [1, 2, 3, 4, 5, 6, 7, 8, -1, 9, 9, 9, 9, -1, 8, 7, 6, 5, 4, 3, 2, 1, -1, 9, 9, 9, 9];

  scoreColor(player: Player, callIndex: number) {
    if (player.calls && player.scores) {
      const call = +player.calls[callIndex - 1];
      const score = +player.scores[callIndex - 1];
      if (!score) {
        return '';
      }
      if ((call === 0 && score === 50) || score > 99) {
        return 'successScore';
      }
    }
    return 'faildScore';
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.account {
  min-height: 5em;
  width: 10em;
  float: right;
  color: #fff;
  margin: 5px;
  -webkit-box-shadow: 0.2em 0.2em 0.5em 0.4em #333;
  box-shadow: 0.2em 0.2em 0.7em 0.2em #585050;
}
.account #header {
  display: flex;
  justify-content: space-evenly;
  font-size: 0.5em;
}

.account .scores {
  text-align: left;
  padding: 0;
}

.account .total {
  border-top: 1px solid #fff;
}

.account .separator {
  padding-right: 3px;
}

.lineThrough {
  text-decoration: line-through;
}

.pulkaScore {
  border-top: 1px solid #fff;
  border-bottom: 1px solid #fff;
  text-align: center;
}

.emptyPlaceHolder {
  min-height: 1.3em;
}

.faildScore {
  color: #e64768;
}

.successScore {
  color: #91c791;
}

</style>
