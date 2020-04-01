<template>
  <div class="playingCards">
    <div class='some-page-wrapper'>
      <a v-if="showResumePolling" @click="startPolling()">resume polling</a>
      <div class="flex-container">
        <div class="flex-child gamePlay">
          <div class='row'>
            <div class='column inlineCards'>
              <template v-if="opponents[1]">
                <div v-if="opponents[1]" class='playerName top'>
                  {{ opponents[1].name }}
                  ({{ opponents[1].call === null
                      ? '-' : opponents[1].call}}/{{ opponents[1].taken }})
                </div>
                <div class='privateCard0 cardBack'
                      :class="{ active: currentState.currentTurnPosition
                      === opponents[1].position}">
                </div>
              </template>
            </div>
          </div>
          <div class='row'>
            <div class='column'>
              <template v-if="opponents[0]">
                <div class='playerName right'>
                  {{ opponents[0].name }}
                  ({{ opponents[0].call === null
                      ? '-' : opponents[0].call}}/{{ opponents[0].taken }})
                </div>
                <div class='privateCard90 cardBack90'
                      :class="{ active: currentState.currentTurnPosition
                      === opponents[0].position}"></div>
              </template>
            </div>
            <div class='column content'>
              <img src="../assets/SGKLogo.png" />
              <div class="middleActoins">
                <div class='card' :class='[deck[card.cardId].suite, calculateCardPosition(card)]'
                  v-for='card in actions' v-bind:key='card.cardId'>
                  <span v-if="card.cardId != 1 && card.cardId != 2"
                        class="rank">{{ deck[card.cardId].type }}</span>
                  <span v-if="card.cardId != 1 && card.cardId != 2"
                        class="suit"> </span>
                  <span v-if="card.cardId != 1 && card.cardId != 2"
                        class="rank rank-bottom">{{ deck[card.cardId].type }}</span>
                  <span v-if="deck[card.cardId].suite === 'bez'
                        && currentState.currentPlay.jokerActionWant" class="jokerDisplayAction">
                    Want <span :class="currentState.currentPlay.actingSuite.toLowerCase()"></span>
                  </span>
                  <span v-if="deck[card.cardId].suite === 'bez'
                        && currentState.currentPlay.jokerActionTake" class="jokerDisplayAction">
                    Take <span :class="currentState.currentPlay.actingSuite.toLowerCase()"></span>
                  </span>
                </div>
              </div>
            </div>
            <div class='column'>
              <template v-if="opponents[2]">
                <div class='playerName left'>
                  {{ opponents[2].name }}
                  ({{ opponents[2].call === null
                      ? '-' : opponents[2].call}}/{{ opponents[2].taken }})
                </div>
                <div class='privateCard90 cardBack90'
                      :class="{ active: currentState.currentTurnPosition
                      === opponents[2].position}"></div>
              </template>
            </div>
          </div>
          <div class='footer-row'>
            <div class='column'>
              <div class="callBlock"
                v-if="(currentState.status === 'CALLS_MADE'
                || currentState.status === 'PLAY_DONE'
                || currentState.status === 'PLAY_STARTED')
                && currentState.currentTurnPosition === me.position">
                <span class="callUnit">Your Turn</span>
              </div>
              <div class="callBlock" v-if="currentState.status === 'DEALT'
                    && currentState.currentTurnPosition === me.position && kozyr != null">
                <span class="callUnit" v-if="me.cantCallNumer != 0" @click="call(0)">Pass</span>
                <div class="template" v-for="numb in currentState.numCards"
                      v-bind:key="numb"
                      @click="call(numb)">
                <span v-if="numb && me.cantCallNumer != numb" class="callUnit">{{ numb }}</span>
                </div>
              </div>
              <div class="jokerAction" v-if="showJokerAction">
                <div class="close" @click="closeJokerActions()">X</div>
                <div class="item" @click="selectJokerAction('WANT')">Want</div>
                <div class="item" @click="selectJokerAction('TAKE')">Take</div>
              </div>
              <div class="jokerAction" v-if="showJokerActionSuite">
                <div class="close" @click="closeJokerActions()">X</div>
                <div class="want">
                  <div class="item diamond" @click="selectJokerSuite('DIAMOND')"></div>
                  <div class="item hart" @click="selectJokerSuite('HART')"></div>
                  <div class="item spade" @click="selectJokerSuite('SPADE')"></div>
                  <div class="item club" @click="selectJokerSuite('CLUB')"></div>
                </div>
              </div>
              <div class="jokerAction" v-if="currentState.status === 'DEALT'
                && currentState.currentTurnPosition === me.position && kozyr == null">
                <div class="close" @click="closeJokerActions()">X</div>
                <div class="want">
                  <div class="item diamond" @click="setKozyr('DIAMOND')"></div>
                  <div class="item hart" @click="setKozyr('HART')"></div>
                  <div class="item spade" @click="setKozyr('SPADE')"></div>
                  <div class="item club" @click="setKozyr('CLUB')"></div>
                  <div class="item BEZ" @click="setKozyr('BEZ')"></div>
                </div>
              </div>
              <div class='playerName bottom'>
                {{ me.name }}({{ me.call === null || me.call === undefined
                    ? '-' : me.call}}/{{ me.taken }})
              </div>
              <div class="inlineCards">
                <template v-if="me.cards && me.cards.length > 0">
                  <div class="cardWrapper">
                    <div v-for='card in me.cards' v-bind:key='card.id'
                        class='card' :class='deck[card.id].suite'
                        @click="hitAction(card)">
                      <span class="rank">
                        {{ card.id != 1 && card.id != 2 ? deck[card.id].type : ' ' }}
                      </span>
                      <span class="suit">
                      </span>
                      <span class="rank rank-bottom">
                        <div v-if="card.id === 1 || card.id === 2">.</div>
                        {{ card.id != 1 && card.id != 2 ? deck[card.id].type : ' ' }}
                      </span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
          <div class="account-footer">
            <account v-if="players.length
                            && currentState
                            && currentState.cardNumbers"
                      :players="players"
                      :numberOfCards="currentState.cardNumbers">
            </account>
          </div>
        </div>
        <div class="flex-child tablePlace">
            <div class="kozyr">
              <div class="kozyrPlace">
                <div v-if="kozyr && deck[kozyr.id]" class='card' :class='deck[kozyr.id].suite'>
                  <span class="rank">{{ deck[kozyr.id].type }}</span>
                  <span class="suit"></span>
                  <span class="rank rank-bottom">{{ deck[kozyr.id].type }}</span>
                </div>
                <div v-if="kozyr && kozyr.id === -1" class='card wholeCard'
                    :class='kozyr.suite.toLowerCase()'>
                    <div class="suit"></div>
                </div>
              </div>
              <div class="attributePlace">
                <div class="attribute">|---| -200</div>
                <div v-if="currentState
                          && currentState.currentPlay
                          && currentState.currentPlay.huntLevel
                          && currentState.currentPlay.huntLevel > 0"
                class="attribute hunt" title="შენტენვა">
                🐷{{currentState.currentPlay.huntLevel}}</div>
                <div v-if="currentState
                          && currentState.currentPlay
                          && currentState.currentPlay.huntLevel
                          && currentState.currentPlay.huntLevel < 0"
                class="attribute huntout" title="წაგლეჯვა">
                {{(currentState.currentPlay.huntLevel * -1)}}</div>
              </div>
            </div>
            <account v-if="players.length
                            && currentState
                            && currentState.cardNumbers"
                      :players="players"
                      :numberOfCards="currentState.cardNumbers">
            </account>
            <chat v-if="me"
                  :messages="currentState.messages"
                  :gameId="gameId"
                  :playerId="me.id"
                  :playerName="me.name">
            </chat>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AxiosError } from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import AccountComponent from '@/components/AccountComponent.vue';
import ChatComponent from '@/components/ChatComponent.vue';

import { Player } from '../models/Player';
import { State } from '../models/State';
import { Card } from '../models/Card';
import Service from '../services/api.service';

Vue.component('account', AccountComponent);
Vue.component('chat', ChatComponent);

@Component({
  components: { AccountComponent, ChatComponent },
})
export default class GameComponent extends Vue {
  public currentState: State = {} as State;

  private apiService: Service = new Service();

  public actions: Array<object> = [];

  public deck: { [key: string]: Card } = {
    1: { id: 1, suite: 'bez', type: 'JOKER' },
    2: { id: 2, suite: 'bez', type: 'JOKER' },
    3: { id: 3, suite: 'spade', type: '7' },
    4: { id: 4, suite: 'spade', type: '8' },
    5: { id: 5, suite: 'spade', type: '9' },
    6: { id: 6, suite: 'spade', type: '10' },
    7: { id: 7, suite: 'spade', type: 'J' },
    8: { id: 8, suite: 'spade', type: 'Q' },
    9: { id: 9, suite: 'spade', type: 'K' },
    10: { id: 10, suite: 'spade', type: 'A' },
    11: { id: 11, suite: 'club', type: '7' },
    12: { id: 12, suite: 'club', type: '8' },
    13: { id: 13, suite: 'club', type: '9' },
    14: { id: 14, suite: 'club', type: '10' },
    15: { id: 15, suite: 'club', type: 'J' },
    16: { id: 16, suite: 'club', type: 'Q' },
    17: { id: 17, suite: 'club', type: 'K' },
    18: { id: 18, suite: 'club', type: 'A' },
    19: { id: 19, suite: 'diamond', type: '6' },
    20: { id: 20, suite: 'diamond', type: '7' },
    21: { id: 21, suite: 'diamond', type: '8' },
    22: { id: 22, suite: 'diamond', type: '9' },
    23: { id: 23, suite: 'diamond', type: '10' },
    24: { id: 24, suite: 'diamond', type: 'J' },
    25: { id: 25, suite: 'diamond', type: 'Q' },
    26: { id: 26, suite: 'diamond', type: 'K' },
    27: { id: 27, suite: 'diamond', type: 'A' },
    28: { id: 28, suite: 'hart', type: '6' },
    29: { id: 29, suite: 'hart', type: '7' },
    30: { id: 30, suite: 'hart', type: '8' },
    31: { id: 31, suite: 'hart', type: '9' },
    32: { id: 32, suite: 'hart', type: '10' },
    33: { id: 33, suite: 'hart', type: 'J' },
    34: { id: 34, suite: 'hart', type: 'Q' },
    35: { id: 35, suite: 'hart', type: 'K' },
    36: { id: 36, suite: 'hart', type: 'A' },
  }

  public me: Player = {};

  public players: Array<Player> = [];

  public opponents: Array<Player> = [];

  public kozyr = 'none';

  public polling = -1;

  public gameId = '';

  public showJokerAction = false;

  public showJokerActionSuite = false;

  public jokerAction = '';

  public joker: Card = {};

  public version = 0;

  public showResumePolling = false;

  created() {
    this.startPolling();
  }

  startPolling() {
    this.refreshState();
    this.gameId = this.$route.params.gameId;
    this.polling = setInterval(() => {
      this.refreshState();
    }, 2000);
  }

  play() {
    const audio = new Audio();
    audio.src = 'placeCard.mp3';
    audio.play();
  }

  hitAction(card: Card) {
    if (card.id === 1 || card.id === 2) {
      this.showJokerAction = true;
      this.joker = card;
    } else {
      this.action(card, '');
    }
  }

  calculateCardPosition(card: any): any {
    let nIndex = -1;
    this.opponents.forEach((opp, index) => {
      if (opp.position === card.playerPosition) {
        nIndex = index;
      }
    });
    let cls = '';
    if (nIndex === -1) {
      cls = 'alignBottom';
    } else if (nIndex === 0) {
      cls = 'alignLeft';
    } else if (nIndex === 1) {
      cls = 'alignTop';
    } else if (nIndex === 2) {
      cls = 'alignRight';
    }
    return cls;
  }

  selectJokerAction(action: string) {
    this.showJokerAction = false;
    if (this.currentState.currentTurnPosition === this.currentState.actingPlayerPosition) {
      this.showJokerActionSuite = true;
      this.jokerAction = action;
    } else {
      this.action(this.joker, action);
    }
  }

  selectJokerSuite(suit: string) {
    const action = `${this.jokerAction}_${suit}`;
    this.showJokerAction = false;
    this.showJokerActionSuite = false;
    this.jokerAction = '';
    this.action(this.joker, action);
    this.joker = {};
  }

  closeJokerActions() {
    this.showJokerAction = false;
    this.showJokerActionSuite = false;
    this.jokerAction = '';
    this.joker = {};
  }

  action(card: Card, action: string) {
    if (this.currentState.currentTurnPosition && this.currentState.actingPlayerPosition) {
      const currentPlayer: Player = this.me;
      if (currentPlayer && currentPlayer.cards
          && currentPlayer.cards[0] && currentPlayer.cards[0]) {
        if (this.currentState.currentTurnPosition !== this.currentState.actingPlayerPosition) {
          this.apiService.get(`/reaction?playerId=${currentPlayer.id}&cardId=${card.id}&gameId=${this.gameId}&jokerReaction=${action}`).then((res) => {
            this.play();
            this.currentState = res.data.state;
            if (this.currentState && this.currentState.currentPlay
                && this.currentState.currentPlay.actions) {
              this.actions = this.currentState.currentPlay.actions;
            }
          });
        } else {
          this.apiService.get(`/action?playerId=${currentPlayer.id}&cardId=${card.id}&gameId=${this.gameId}&jokerAction=${action}`).then((res) => {
            this.play();
            this.currentState = res.data.state;
            if (this.currentState && this.currentState.currentPlay
                && this.currentState.currentPlay.actions) {
              this.actions = this.currentState.currentPlay.actions;
            }
          });
        }
      }
    }
  }

  call(quantity: number) {
    if (this.currentState.currentTurnPosition) {
      const currentPlayer: Player = this.players[this.currentState.currentTurnPosition];
      this.apiService.get(`/call?playerId=${currentPlayer.id}&wantQty=${quantity}&gameId=${this.gameId}`).then((res) => {
        this.currentState = res.data.state;
      });
    }
  }

  setKozyr(suit: string) {
    this.apiService.get(`/setKozyr?playerId=${this.me.id}&kozyrSuite=${suit}&gameId=${this.gameId}`).then((res) => {
      this.currentState = res.data.state;
    });
  }

  refreshState() {
    const { gameId, id } = this.$route.params;
    this.apiService.get(`/getPlayersState?playerId=${id}&gameId=${gameId}`).then((res) => {
      if (res.data.state.version !== this.version) {
        this.currentState = res.data.state;
        if (this.currentState && this.currentState.currentPlay
            && this.currentState.currentPlay.actions) {
          this.actions = this.currentState.currentPlay.actions;
        }
        this.me = res.data.player;
        Vue.set(this.players, res.data.player.position, res.data.player);
        this.opponents = res.data.opponents;
        res.data.opponents.forEach((player: Player) => {
          if (player.position) {
            Vue.set(this.players, player.position, player);
            // this.players[player.position] = player;
          }
        });
        this.kozyr = res.data.state.currentPlay.kozyr;
      }
    }).catch((error: AxiosError) => {
      clearInterval(this.polling);
      this.showResumePolling = true;
    });
  }

  beforeDestroy() {
    clearInterval(this.polling);
    this.polling = -1;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.active {
  background-color: #f00 !important;
}
.some-page-wrapper {
  background-color: green;
}
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.column {
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
}

.content {
  flex: 2;
  min-height: 16em;
}

.content img {
  width: 100%;
  position: absolute;
  opacity: 0.5;
}

.red {
  background-color: red;
}

.playingCards {
  height: 100vh;
  min-height: 1px;
}

.playingCards .card {
  display: inline-block;
  width: 3.3em;
  height: 4.6em;
  border: 1px solid #666;
  -moz-border-radius: .3em;
  -webkit-border-radius: .3em;
  -khtml-border-radius: .3em;
  border-radius: .3em;
  padding: .25em;
  margin: -1em -1.3em;
  text-align: center;
  font-size: 1.2em; /* @change: adjust this value to make bigger or smaller cards */
  font-weight: normal;
  font-family: Arial, sans-serif;
  background-color: #fff;
  -moz-box-shadow: .2em .2em .5em #333;
  -webkit-box-shadow: .2em .2em .5em #333;
  box-shadow: .2em .2em .5em #333;
  animation-name: shuffle;
  animation-duration: 2s;
  position: relative;
}

.playingCards .privateCard90 {
  display: inline-block;
  width: 4.6em;
  height: 3.3em;
  border: 1px solid #666;
  border-radius: .3em;
  padding: .25em;
  margin: -1.7em 0;
  font-size: 1.2em;
}

.playingCards .privateCard0 {
  display: inline-block;
  width: 3.3em;
  height: 4.6em;
  border: 1px solid #666;
  border-radius: .3em;
  padding: .25em;
  margin: -1.7em 0;
  font-size: 1.2em;
  margin: 0 -1.7em;
}

.cardBack, .cardBack90 {
  background-color: #fff;
  position: relative;
}

.cardBack::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 0;
  background: url(/img/back.08a69d65.png) 0 0 repeat;
  -webkit-transform: rotate(30deg);
  background-size: contain;
  background-position: center;
  transform: rotate(0deg);
}

.cardBack90::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 137%;
  top: 0;
  left: 0;
  z-index: 0;
  background: url('../assets/back.png');
  background-size: contain;
  background-repeat: no-repeat;
  -webkit-transform: rotate(30deg);
  transform: rotate(90deg);
}

.middleActoins .card {
  margin: 0 -1.95em;
  box-shadow: 0.1em 0.1em 0.1em #333;
}

.middleActoins .card .hart:after {
  content: "\2665";
}

.middleActoins .card .spade:after {
  content: "\2660";
}

.middleActoins .card .diamond:after {
  content: "\2666";
}

.middleActoins .card .club:after {
  content: "\2663";
}

.middleActoins .alignTop {
  bottom: 2em;
}

.middleActoins .alignBottom {
  top: 2em;
}

.middleActoins .alignLeft {
  right: 4em;
  transform: rotate(90deg);
}

.middleActoins .alignRight {
  left: 3em;
  transform: rotate(-90deg);
}

.middleActoins .card.bez {
  z-index: 1;
}

.playingCards .card.bez {
  background: url('../assets/joker.png');
  background-size: contain;
  background-color: #fff;
}

.inlineCards {
  display: flex;
  flex-direction: row !important;
  justify-content: center;
}

@keyframes shuffle {
  from {background-color: #f5f1bc;}
  to {background-color: #fff;}
}


/* suit colours
********************************************************************/

.playingCards .card.diamond,
.kozyr .diamond,
.middleActoins .card .diamond {
  color: #f00 !important;
}

.kozyr .card {
  font-size: 0.8em;
  bottom: -1.5em !important;
  left: 1.4em;
  float: left;
}

.playingCards .card.club,
.kozyr .club,
.middleActoins .club {
  color: #00f !important;
}
.playingCards .card.hart,
.kozyr .hart,
.middleActoins .hart {
  color: #f00 !important;
}
.playingCards .card.spade,
.kozyr .spade,
.middleActoins .spade {
  color: #000 !important;
}


/* inner bits
********************************************************************/

/* top left main info (rank and suit) */

.playingCards .card .rank,
.playingCards .card .suit {
  display: block;
  line-height: 0.74;
  text-align: left;
  text-transform: uppercase;
  min-height: 0.74em;
}

.playingCards .card .suit {
  line-height: .7;
  height: 3em;
}

.playingCards .rank-bottom {
  transform: rotate(-180deg);
}

.playingCards .card.hart .suit:after {
  content: "\2665";
  right: 0.3em;
  top: 0.6em;
}

.playingCards .card.hart .suit:before {
  content: "\2665";
  right: 0.3em;
  bottom: 1.1em;
  position: absolute;
  transform: rotate(180deg);
}

.playingCards .card.spade .suit:after {
  content: "\2660";
  right: 0.3em;
  top: 0.6em;
}

.playingCards .card.spade .suit:before {
  content: "\2660";
  right: 0.3em;
  bottom: 1.1em;
  position: absolute;
  transform: rotate(180deg);
}

.playingCards .card.club .suit:after {
  content: "\2663";
  right: 0.3em;
  top: 0.6em;
}

.playingCards .card.club .suit:before {
  content: "\2663";
  right: 0.3em;
  bottom: 1.1em;
  position: absolute;
  transform: rotate(180deg);
}

.playingCards .card.diamond .suit:after {
  content: "\2666";
  right: 0.3em;
  top: 0.6em;
}

.playingCards .card.diamond .suit:before {
  content: "\2666";
  right: 0.3em;
  bottom: 1.1em;
  position: absolute;
  transform: rotate(180deg);
}

.playingCards .card.bez .suit:after {
  content: "";
  font-size: 3.5em;
  position: absolute;
  right: 0.2em;
}

.playingCards .card:hover, .playingCards .card:active, .playingCards .card:focus {
    bottom: 0.5em;
    cursor: pointer;
}

.playingCards .kozyr .card:hover {
  bottom: 0;
}

.playingCards .playerName {
  color: #fff;
  position: absolute;
  z-index: 1;
}

.playingCards .playerName.left {
  position: absolute;
  bottom: 4em;
  left: 0;
  right: 0
}

.playingCards .playerName.right {
  position: absolute;
  bottom: 4em;
  left: 0;
  right: 0
}

.playingCards .playerName.bottom {
  position: absolute;
  bottom: 1em;
}

.playingCards .playerName.top {
  position: absolute;
  bottom: -2em;
}

.playingCards .callBlock {
  border: 1px solid #000;
  background-color: #000;
  color: #fff;
  z-index: 1;
  position: absolute;
  bottom: 3em;
}

.playingCards .callBlock .template{
  display: inline-block;
}

.playingCards .callBlock .callUnit {
  border: 1px solid #fff;
  margin: 0.2em;
  padding: 0.2em;
  display: inline-block;
  min-width: 30px;
}

.playingCards .callBlock .callUnit:hover {
  background-color: #fff;
  color: #000;
  cursor: pointer;
}

.playingCards .cardWrapper {
  position: absolute;
  top: 1em;
  left: 0;
  right: 0;
}
.footer-row {
 min-height: 11em;
}
.header-row {
  height: 4em;
  padding: 0.2em;
}

.kozyr {
  width: 100%;
  height: 5em;
  display: flex;
  justify-content: center;
  flex-direction: row;
}

.kozyr .attributePlace {
  flex: 1;
}

.kozyr .kozyrPlace {
  flex: 1;
}

.kozyr .cvet {
  font-size: 3em;
}
.kozyr .attribute {
  font-size: 0.5em;
  color: #fff;
  display: block;
  padding: 10px 3px;
}

.attribute.huntout,
.attribute.huntin {
  font-size: 1em;
}

.attribute.huntout:after {
  content: '\2694';
  font-size: 1em;
}

.attribute.huntin:after {
  content: '\2691';
  font-size: 1em;
}

.jokerAction {
  position: absolute;
  background-color: black;
  color: #fff;
  top: -10em;
  z-index: 2;
  display: flex;
}

.jokerAction .want{
  display: flex;
}

.jokerAction .close {
  content: "X";
  position: absolute;
  top: -1em;
  right: -1em;
  border: 1px solid #fff;
  border-radius: 50%;
  width: 1em;
  background-color: red;
  cursor: pointer;
  padding: 3px;
  font-size: 0.8em;
}

.jokerAction .item {
  border: 1px solid #fff;
  color: #fff;
  font-size: 0.9em;
  background: black;
  padding: 1.2em;
  flex: 1;
}

.jokerAction .item:hover {
  color: #000;
  background: #fff;
  cursor: pointer;
}

.jokerAction .want .item {
  padding: 0.2em 0;
  width: 2em;
}

.jokerAction .want .diamond:after {
  content: "\2666";
  right: 0.3em;
  top: 0.6em;
  color: #f00;
  font-size: 2em;
}

.jokerAction .want .hart:after {
  content: "\2665";
  right: 0.3em;
  top: 0.6em;
  color: #f00;
  font-size: 2em;
}

.jokerAction .want .club:after {
  content: "\2663";
  right: 0.3em;
  top: 0.6em;
  color: #00f;
  font-size: 2em;
}

.jokerAction .want .BEZ:after {
  content: "\01F0DF";
  right: 0.3em;
  top: 0.6em;
  color: #888;
  font-size: 2em;
}

.jokerAction .want .spade:after {
  content: "\2660";
  right: 0.3em;
  top: 0.6em;
  color: #ccc;
  font-size: 2em;
}

.jokerDisplayAction {
  font-size: 0.7em;
  position: absolute;
  width: 100%;
  left: 0;
}

.flex-container {
  display: flex;
}

.flex-child.gamePlay {
  flex: 1;
}

.flex-child.tablePlace {
  flex: 0 0 10em;
}

.account-footer .account {
  display: none;
}

.playingCards .wholeCard.hart .suit:after {
  content: "\2665";
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  font-size: 4em;
  margin-top: 0.3em;
}

.playingCards .wholeCard.hart .suit:before,
.playingCards .wholeCard.spade .suit:before,
.playingCards .wholeCard.diamond .suit:before,
.playingCards .wholeCard.club .suit:before {
  content: '';
}

.playingCards .wholeCard.spade .suit:after {
  content: "\2660";
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  font-size: 4em;
  margin-top: 0.3em;
}

.playingCards .wholeCard.club .suit:after {
  content: "\2663";
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  font-size: 4em;
  margin-top: 0.3em;
}

.playingCards .wholeCard.diamond .suit:after {
  content: "\2666";
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  font-size: 4em;
  margin-top: 0.3em;
}

.playingCards .wholeCard.bez .suit:after {
  content: "\01F0DF";
  position: absolute;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  text-align: center;
  font-size: 4em;
  margin-top: 0.3em;
}

@media only screen and (max-width: 900px) {
  .playingCards .card {
    font-size: 1em;
  }

  .playingCards .privateCard90 {
    height: 4em;
    width: 2.8em;
    margin: -2.22em 0;
    font-size: 0.8em;
  }

  .cardBack90::after {
    -webkit-transform: none;
    transform: none;
  }

  .playingCards .privateCard0 {
    height: 4em;
    width: 2.8em;
    font-size: 0.8em;
  }

  .playingCards .playerName {
    font-size: 0.6em;
  }
  .playingCards .playerName.right {
    right: 0em;
    left: 0em;
    bottom: 8em;
  }
  .playingCards .playerName.left {
    left: 0.8em;
    bottom: 8em;
  }
  .playingCards .playerName.bottom {
    bottom: 1em;
  }
  .kozyr {
    position: relative;
    float: left;
    height: 7em;
    flex-direction: column;
  }

  .account {
    display: none;
  }

  .account-footer .account {
    display: block;
    float: left;
    font-size: 0.8em;
  }

  .chat {
    width: 7em;
    right: 0;
  }

  .chat input {
    width: 1em;
  }

  .kozyr .card {
    font-size: 0.5em;
  }

  .middleActoins .card {
    font-size: 0.8em;
  }

  .flex-child.tablePlace {
    position: absolute;
    right: 1em;
  }

  .playingCards .card.bez .suit:after {
    right: 0.1em;
  }

  .playingCards .callBlock .callUnit {
    margin: 0;
    padding: 0;
  }

  .footer-row {
    min-height: 8em;
  }

  .middleActoins .alignLeft {
    right: 2em;
  }

  .middleActoins .alignRight {
    left: 2em;
  }
}
</style>
