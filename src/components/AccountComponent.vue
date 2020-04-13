<template>
  <div class="account">
    <div id="header" v-if="players.length > 0">
      <div v-for='index in 4' v-bind:key='index'>
        <span v-if="players[index].name">{{ players[index].name }}</span>
        <div class="scores"
              v-for="callIndex in players[index].calls.length"
              v-bind:key="callIndex">
            <span class="separator"
                  v-if="index===1">{{numberOfCards[callIndex-1]}}
            </span>
            <span
              :class="{ lineThrough: players[index].bonusMultipliers.length
                        && players[index].bonusMultipliers[callIndex-1] === 0 }">
              {{players[index].calls[callIndex-1]}} - {{players[index].scores[callIndex-1]}}
            </span>
            <span v-if="players[index].bonusMultipliers.length">
              {{players[index].bonusMultipliers[callIndex-1] === 2 ? 'x2' : ''}}
            </span>
            <div class="pulkaScore" v-if="callIndex===8 && players[index].pulkaScores
                && players[index].pulkaScores[0]
                && players[index].pulkaScores.length">
              {{(players[index].pulkaScores[0]/100).toFixed(1)}}
            </div>
            <div class="pulkaScore" v-if="callIndex===12 && players[index].pulkaScores
                && players[index].pulkaScores[1]
                && players[index].pulkaScores.length">
              {{(players[index].pulkaScores[1]/100).toFixed(1)}}
            </div>
            <div class="pulkaScore" v-if="callIndex===20 && players[index].pulkaScores
                && players[index].pulkaScores[2]
                && players[index].pulkaScores.length">
              {{(players[index].pulkaScores[2]/100).toFixed(1)}}
            </div>
            <div class="pulkaScore" v-if="callIndex===24 && players[index].pulkaScores
                && players[index].pulkaScores[3]
                && players[index].pulkaScores.length">
              {{ (players[index].pulkaScores[3]/100).toFixed(1)}}
            </div>
        </div>
        <!-- <div class="total">
          {{(players[index].totalScore / 100).toFixed(1)}}
        </div> -->
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
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.account {
  min-height: 5em;
  width: 10em;
  float: right;
  color: #fff;
  border: 1px solid #fff;
  margin: 5px;
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

</style>
