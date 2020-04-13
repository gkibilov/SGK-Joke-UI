<template>
  <div>
    <div id='actionBar'>
      <a class='createRoomButton' @click='create()'>Create Room</a>
      <div class="welcome" v-if="playersTempName">
        <h1> Welcome {{playersTempName}} </h1>
      </div>
    </div>
    <div class='room' v-for='(room) in rooms' v-bind:key='room.gameId'>
      <div class='roomHeader'>
        <div class="actionButtonsWrapper">
          <div><h1>{{ room.gameName }}</h1></div>
          <div><a v-if="isGameFull(room)"
            class='createRoomButton'
            @click='start(room.gameId)'>
            Start Game
          </a></div>
        </div>
      </div>
      <div class='participant' v-for='(player, playerIndex) in room.players' v-bind:key='player.id'>
        <template v-if='!player.name'>
          <div class='noParticipant' v-if='!disableSitForRoom(room.id)'
            @click="addPlayer(room, player, playerIndex)">
            <p>Click to sit</p>
          </div>
          <div class='noParticipant' v-else>
            <p>Wait for your opponent</p>
          </div>
          </template>
        <div class='reservedPlayer' v-else>
          {{player.name}}
          <img alt='Vue logo' src='../assets/person.png' />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Player } from '../models/Player';
import { Game } from '../models/Game';
import Service from '../services/api.service';
import EventBus from '../services/eventBus.service';

@Component
export default class RoomComponent extends Vue {
  public rooms: Array<Game> = [];

  private apiService = new Service();

  public gameId = '';

  public polling = -1;

  public showResumePolling = false;

  public playersTempName = '';

  private playerId: string;

  mounted() {
    EventBus.$on('connected', (playerId) => {
      this.playerId = playerId;
    });

    EventBus.$on('app:topic:game', (allGames) => {
      this.handleAllGames(allGames);
    });

    EventBus.$on('app:user:reply', (data) => {
      const { state, player } = data;
      if (data.requestType === null) {
        if (player && state) {
          localStorage[state.gameId] = player.id;
        }
      } else if (data.requestType === 'START') {
        this.$router.push({ name: 'Game', params: { id: player.id || '', gameId: state.gameId } });
      }
    });
  }

  created() {
    if (!localStorage.playersTempName) {
      this.$prompt('Your Name').then((name) => {
        this.playersTempName = name;
        localStorage.playersTempName = name;
      });
    } else {
      this.playersTempName = localStorage.playersTempName;
    }

    // this.getAllGames();
    /* this.polling = setInterval(() => {
      this.getAllGames();
    }, 5000); */
  }

  create() {
    const key = Math.floor(Math.random() * 100);
    const message = JSON.stringify({ name: `Room-${key}` });
    this['$ws'].send('/app/newGame', message);
    /* this.apiService.get(`/newGame?name=${`Room-${key}`}`).then((res) => {
      this.gameId = res.data;
      this.rooms.push({
        gameId: res.data,
        gameName: `Room-${key}`,
        players: [{} as Player, {} as Player, {} as Player, {} as Player],
      });
    }); */
  }

  isGameFull(game: Game) {
    let count = 0;
    if (game.players) {
      game.players.forEach((player) => {
        if (player.name) {
          count += 1;
        }
      });
    }
    return count === 4;
  }

  addPlayer(game: Game, player: Player, playerIndex: number) {
    const message = {
      gameId: game.gameId,
      name: this.playersTempName,
      pos: playerIndex + 1,
    };

    // TODO: change porsition
    /* if (player in game) {
      existingId: this.playerId,
    } */
    this['$ws'].send('/app/addPlayer', JSON.stringify(message));
  }

  joinRoom(room: Game, index: number, player: Player, playerIndex: number) {
    if (room.gameId && localStorage[room.gameId]) {
      this.$alert('You are already in');
      return;
    }
    if (this.playersTempName) {
      this.apiService.get(`/addPlayer?name=${this.playersTempName}&gameId=${room.gameId}&position=${playerIndex + 1}`).then((res) => {
        const state = room;
        if (state && state.players) {
          state.players[playerIndex] = res.data.player;
          state.me = res.data.player;
          Vue.set(this.rooms, index, state);
        }
        if (state.me && room.gameId) {
          localStorage[room.gameId] = state.me.id;
        }
      });
    } else {
      this.$alert('name pls!');
    }
  }

  start(gameId: string) {
    const playerId = localStorage[gameId];
    const message = {
      type: 'START',
      playerId,
      gameId,
    };
    this['$ws'].send('/app/playerMessage', JSON.stringify(message));
    /* this.apiService.get(`/startGame?playerId=${playerId}&gameId=${gameId}`).then(() => {
      // this.apiService.get(`/testFastForward?roundNumber=24&gameId=${gameId}`);
      this.$router.push({ name: 'Game', params: { id: playerId || '', gameId } });
    }); */
  }

  disableSitForRoom(gameId: number) {
    if (localStorage[gameId]) {
      return true;
    }
    return false;
  }

  handleAllGames(allGames: Game[]) {
    console.log(allGames);
    allGames.forEach((game: Game) => {
      if (game.players) {
        const arr = [{} as Player, {} as Player, {} as Player, {} as Player];
        game.players.forEach((player) => {
          if (player && player.position) {
            arr[player.position - 1] = player;
          }
        });
        game.players = arr;
      }
    });
    this.rooms = allGames;
  }

  getAllGames() {
    this['$ws'].send('/app/getAllGames');
    /* this.apiService.get('/getAllGames').then((res) => {
      const { data } = res;
      data.forEach((game: Game) => {
        if (game.players) {
          const arr = [{} as Player, {} as Player, {} as Player, {} as Player];
          game.players.forEach((player) => {
            if (player && player.position) {
              arr[player.position - 1] = player;
            }
          });
          game.players = arr;
        }
      });
      this.rooms = data;
    }); */
  }

  beforeDestroy() {
    clearInterval(this.polling);
    this.polling = -1;
  }

  /* setTestNumCards(gameId: string) {
    const numCards = 9;
    axios.get(`${this.appHost}/setTestNumCards?gameId=${gameId}&numCards=${numCards}`)
    .then((res) => {
    }).catch((error: AxiosError) => {
      this.handleError(error);
    });
  } */
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
.welcome h1 {
  color: #fff;
  font-size: 1.5em;
}

.createRoomButton {
  border: 1px solid grey;
  padding: 0.3em;
  font-size: 0.8em;
  margin: 0.4em;
  width: 200px;
  display: inline-block;
  background-color: #e8e8e8;
}

.createRoomButton:hover {
  background-color: green;
  cursor: pointer;
  color: #ffffff;
}

.roomHeader h1 {
  font-size: 1em;
  text-align: left;
  margin: 0.1em 0.6em;
}
.room {
  width: 40%;
  margin: 1em auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #e8e8e8;
}

.participant {
  display: inline-flex;
  min-height: 7em;
  border: 1px solid grey;
  margin: 0.4em 0.2em;
  padding: 0.3em;
  cursor: pointer;
  width: 20%;
}

.noParticipant {
  width: 100%;
}

.noParticipant:hover {
  background-color: #e51f59;
}

.noParticipant input {
  width: 100px;
  height: 30px;
  font-size: 0.5em;
}

.noParticipant p {
  font-size: 0.5em;
}

.reservedPlayer {
  width: 100%;
  background-color: #e8e8e8;
}

.reservedPlayer img {
  width: 100%;
}

.actionButtonsWrapper {
  display: flex;
  align-items: center;
}

.actionButtonsWrapper div {
  flex: 1 1 0px;
}

.actionButtonsWrapper input {
  height: 30px;
  width: 150px;
  font-size: 0.7em;
}

@media only screen and (max-width: 768px) {
  .room {
    width: 90%;
    padding: 0.5em;
  }

  .actionButtonsWrapper {
    flex-direction: column;
  }

  .actionButtonsWrapper input {
    width: 80%;
  }

  .participant {
    display: table-cell;
  }
}
</style>
