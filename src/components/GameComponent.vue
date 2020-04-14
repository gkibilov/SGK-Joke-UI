<template>
  <div class="playingCards">
    <div class='some-page-wrapper'>
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
                        class='card'
                        v-bind:class="[isDisabled(card) ?
                                      'isDisabled' : '', deck[card.id].suite]"
                        @click="hitAction(card)">
                      <div v-if="isDisabled(card)"
                      class="maskCard"></div>
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
import { Component, Vue } from 'vue-property-decorator';
import AccountComponent from '@/components/AccountComponent.vue';
import ChatComponent from '@/components/ChatComponent.vue';
import Deck from '@/services/deck.service';

import { Player } from '../models/Player';
import { State, StateStatus } from '../models/State';
import { Card } from '../models/Card';
import Service from '../services/api.service';
import EventBus from '../services/eventBus.service';
import { Message, ActionType } from '../models/Message';

Vue.component('account', AccountComponent);
Vue.component('chat', ChatComponent);

@Component({
  components: { AccountComponent, ChatComponent },
})
export default class GameComponent extends Vue {
  public currentState: State = {} as State;

  private apiService: Service = new Service();

  public actions: Array<object> = [];

  public deck: { [key: string]: Card } = Deck;

  public me: Player = {};

  public players: Array<Player> = [];

  public opponents: Array<Player> = [];

  public kozyr = 'none';

  public gameId = '';

  public showJokerAction = false;

  public showJokerActionSuite = false;

  public jokerAction = '';

  public joker: Card = {};

  mounted() {
    EventBus.$on('app:user:reply', (data) => {
      if (data.requestType === ActionType.START
          || data.requestType === ActionType.CALL
          || data.requestType === ActionType.SET_KOZYR
          || data.requestType === ActionType.MESSAGE) {
        this.refreshState(data);
      } else if (data.requestType === ActionType.REACTION
                || data.requestType === ActionType.ACTION) {
        this.actionHandler(data);
      }
    });
    if (this['$ws'] && this['$ws'].connected) {
      this.startGame();
    } else {
      EventBus.$on('connected', () => {
        this.startGame();
      });
    }
  }

  play(src: string) {
    const audio = new Audio();
    audio.src = src;
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

  calculateCardPosition(card: Card): string {
    let nIndex = -1;
    this.opponents.forEach((opp, index) => {
      if (opp.position === card['playerPosition']) {
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
      const { gameId, id } = this.$route.params;
      const message: Message = {
        playerId: id,
        gameId,
        cardId: card.id,
      };
      if (this.currentState.currentTurnPosition !== this.currentState.actingPlayerPosition) {
        message.type = ActionType.REACTION;
        if (action && action !== '') message.jokerReaction = action;
        this['$ws'].send('/app/playerMessage', JSON.stringify(message));
      } else {
        message.type = ActionType.ACTION;
        if (action && action !== '') message.jokerAction = action;
        this['$ws'].send('/app/playerMessage', JSON.stringify(message));
      }
    }
  }

  private actionHandler(data: any) {
    this.play('placeCard.mp3');
    this.currentState = data.state;
    if (this.currentState && this.currentState.currentPlay
        && this.currentState.currentPlay.actions) {
      this.actions = this.currentState.currentPlay.actions;
    }
    this.me = data.player;
  }

  call(quantity: number) {
    if (this.currentState.currentTurnPosition) {
      const { gameId, id } = this.$route.params;
      const message = {
        type: ActionType.CALL,
        playerId: id,
        gameId,
        wantQty: quantity,
      };
      this['$ws'].send('/app/playerMessage', JSON.stringify(message));
    }
  }

  setKozyr(suit: string) {
    const { gameId, id } = this.$route.params;
    const message = {
      type: ActionType.SET_KOZYR,
      playerId: id,
      gameId,
      kozyrSuite: suit,
    };
    this['$ws'].send('/app/playerMessage', JSON.stringify(message));
  }

  startGame() {
    const { gameId, id } = this.$route.params;
    this.gameId = gameId;
    const message = {
      type: ActionType.START,
      playerId: id,
      gameId,
    };
    this['$ws'].send('/app/playerMessage', JSON.stringify(message));
  }

  refreshState(res: any) {
    this.currentState = res.state;
    if (this.currentState && this.currentState.currentPlay
        && this.currentState.currentPlay.actions) {
      this.actions = this.currentState.currentPlay.actions;
    }
    this.me = res.player;
    Vue.set(this.players, res.player.position, res.player);
    this.opponents = res.opponents;
    res.opponents.forEach((player: Player) => {
      if (player.position) {
        Vue.set(this.players, player.position, player);
      }
    });
    this.kozyr = res.state.currentPlay.kozyr;
    this.beepIfMyTurn(res);
    this.beepIfMyCall(res);
  }

  isDisabled(card: Card) {
    if (this.currentState.status === StateStatus.DEALT
        || this.currentState.currentTurnPosition !== this.me.position) {
      return true;
    }

    if (this.currentState.currentPlay
        && this.currentState.status === StateStatus.PLAY_STARTED
        && this.currentState.currentTurnPosition === this.me.position) {
      // exclud joker
      if (card.suite === 'BEZ') return false;
      // if only one card in hand
      if (this.me.cards && this.me.cards.length === 1) return false;
      const kozyr = this.currentState.currentPlay.kozyr.suite || '';
      if (this.currentState.currentPlay && this.currentState.currentPlay.jokerActionWant) {
        const highiestSuite = this.findHighiestSuite();
        // when user has highiest requested suite
        if (highiestSuite.id && card.id
            && highiestSuite.id !== -1
            && highiestSuite.id !== card.id) {
          return true;
        }

        if (!this.hasSuite(kozyr)) {
          return false;
        }

        // when user has no requisted suit but has kozyr
        if (highiestSuite.id === -1
            && card.suite !== this.currentState.currentPlay.kozyr.suite) {
          return true;
        }
      }

      if (this.currentState.currentPlay && this.currentState.currentPlay.actingSuite) {
        const { actingSuite } = this.currentState.currentPlay;

        if (!this.hasSuite(actingSuite) && !this.hasSuite(kozyr)) {
          return false;
        }

        if (this.hasSuite(actingSuite)) {
          if (card.suite !== this.currentState.currentPlay.actingSuite) {
            return true;
          }
        }

        if (!this.hasSuite(actingSuite) && this.hasSuite(kozyr)) {
          if (this.currentState.currentPlay
              && this.currentState.currentPlay.kozyr
              && card.suite !== this.currentState.currentPlay.kozyr.suite) {
            return true;
          }
        }
      }
    }

    return false;
  }

  hasSuite(actingSuite: string) {
    let has = false;
    if (this.currentState.currentPlay) {
      const { cards } = this.me;
      if (cards && cards.length) {
        cards.forEach((c) => {
          if (c.suite !== 'BEZ' && c.suite === actingSuite) {
            has = true;
          }
        });
      }
    }
    return has;
  }

  findHighiestSuite() {
    let card: Card = { id: -1 };
    if (this.currentState.currentPlay) {
      const { actingSuite } = this.currentState.currentPlay;
      const { cards } = this.me;
      if (cards && cards.length) {
        cards.forEach((c) => {
          if (c.id
            && card.id
            && c.suite === actingSuite
            && c.id > card.id) {
            card = c;
          }
        });
      }
    }
    return card;
  }

  beepIfMyTurn(data: any) {
    if ((data.state === StateStatus.CALLS_MADE
        || data.state.status === StateStatus.PLAY_DONE
        || data.state.status === StateStatus.PLAY_STARTED)
        && data.state.currentTurnPosition === data.player.position) {
      this.play('beepYourTurn.mp3');
    }
  }

  beepIfMyCall(data: any) {
    if (data.state.status === StateStatus.DEALT
        && data.state.currentTurnPosition === data.player.position
        && data.state.currentPlay.kozyr != null) {
      this.play('beepYourTurn.mp3');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.active {
  background-color: #f00 !important;
}
.some-page-wrapper {
  background-color: #243e54;
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
  pointer-events: none;
}

.middleActoins .card:hover {
  bottom: 0.5em;
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

.attribute.hunt,
.attribute.huntout {
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

.maskCard {
  position: absolute;
  top: 0;
  pointer-events: none;
  bottom: 0;
  pointer-events: none;
  right: 0;
  left: 0;
  background-color: #000;
  opacity: 0.2;
  border-radius: 0.3em;
}

.isDisabled {
  pointer-events: none;
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
