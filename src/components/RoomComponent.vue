<template>
  <div class="gameWrapper">
    <div class="login" v-if="user.unauthorized">
      <div class="logoLoginWrapper">
        <div class="logoWrapper">
          <img src="../assets/SGKLogo.png"/>
        </div>
        <div class="loginWrapper">
          <div id="customNameWrapper">
            <input v-model="user.name" placeholder="Type your name">
            <button @click="join()">Join</button>
          </div>
          <div class="divider">OR</div>
          <button class="fbButton" @click="logInWithFacebook()"> Login with Facebook</button>
        </div>
      </div>
    </div>
    <template v-if="!user.unauthorized">
    <div id='actionBar'>
      <button class="fbButton" @click="logout()"> Log Out</button>
      <button class='fbButton' @click='create()'>Create Room</button>
      <div class="welcome" v-if="user.name">
        <h1> Welcome {{user.name}} </h1>
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
      <div class="participantsWrapper">
        <div class="personWrapper" v-for='(player, playerIndex) in room.players'
              v-bind:key='player.id'>
          <div class="playerName">{{player.name}}</div>
          <div class="participant">
            <template v-if='!player.name'>
              <div class='noParticipant' v-if='!disableSitForRoom(room.id)'
                @click="addPlayer(room, player, playerIndex)">
                <p>Click to sit</p>
              </div>
            </template>
            <template v-else>
              <div class='reservedPlayer'>
                <img v-if="user.picture" v-bind:src="user.picture"/>
                <img v-else src="../assets/noPersonImage.png"/>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator';
import { Player } from '../models/Player';
import { Game } from '../models/Game';
import EventBus from '../services/eventBus.service';

@Component
export default class RoomComponent extends Vue {
  public rooms: Array<Game> = [];

  public gameId = '';

  public polling = -1;

  public showResumePolling = false;

  private playerId: string;

  public user: any = { unauthorized: true };

  logout() {
    localStorage.removeItem('user');
    document.location.reload();
  }

  async logInWithFacebook() {
    const self = this;
    window.FB.login((response) => {
      if (response.authResponse) {
        window.FB.api('/me', { fields: 'id,name,email,picture' }, (res: any) => {
          if (res) {
            console.log(res);
            Vue.set(self.user, 'name', res.name);
            window.FB.api(`/${res.id}/picture?redirect=false`, 'get', { width: 100 }, (pict: any) => {
              console.log(pict);
              if (pict) {
                Vue.set(self.user, 'picture', pict.data.url);
                Vue.set(self.user, 'unauthorized', false);
                localStorage.setItem('user', JSON.stringify(self.user));
              }
            });
          }
        });
        // Now you can redirect the user or do an AJAX request to
        // a PHP script that grabs the signed request from the cookie.
      } else {
        alert('User cancelled login or did not fully authorize.');
      }
    });
    return false;
  }

  async initFacebook() {
    window['fbAsyncInit'] = () => {
      window.FB.init({
        appId: '711898786218668', // You will need to change this
        cookie: true, // This is important, it's not enabled by default
        version: 'v3.1',
      });
    };
  }

  async loadFacebookSDK(d, s, id) {
    let js: any = {};
    const fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    console.log(id);
    js = d.createElement(s);
    js.id = id;
    js.src = 'https://connect.facebook.net/en_US/sdk.js';
    fjs.parentNode.insertBefore(js, fjs);
  }

  mounted() {
    if (this['$ws'] && this['$ws'].connected) {
      this.getAllGames();
    } else {
      EventBus.$on('connected', (playerId) => {
        this.playerId = playerId;
        this.getAllGames();
      });
    }

    EventBus.$on('app:topic:game', (allGames) => {
      this.handleAllGames(allGames);
    });

    EventBus.$on('app:user:reply', (data) => {
      const { state, player } = data;
      if (data.requestType === null) {
        if (player && state) {
          localStorage[state.gameId] = player.id;
        }
      }
    });
  }

  async created() {
    await this.loadFacebookSDK(document, 'script', 'facebook-jssdk');
    await this.initFacebook();
    console.log(localStorage.user);
    if (!localStorage.user) {
      this.user.unauthorized = true;
    } else {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user);
      }
    }
  }

  create() {
    const key = Math.floor(Math.random() * 100);
    const message = JSON.stringify({ name: `Room-${key}` });
    this['$ws'].send('/app/newGame', message);
  }

  join() {
    this.user.unauthorized = false;
    localStorage.setItem('user', JSON.stringify(this.user));
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
      name: this.user.name,
      pos: playerIndex + 1,
    };

    if (game.players && game.players.length) {
      game.players.forEach((pl) => {
        if (pl.id === player.id) {
          message['existingId'] = player.id;
        }
      });
    }

    this['$ws'].send('/app/addPlayer', JSON.stringify(message));
  }

  start(gameId: string) {
    const playerId = localStorage[gameId];
    this.$router.push({ name: 'Game', params: { id: playerId || '', gameId } });
  }

  disableSitForRoom(gameId: number) {
    if (localStorage[gameId]) {
      return true;
    }
    return false;
  }

  handleAllGames(allGames: Game[]) {
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
.gameWrapper {
  background-color: #3f4259;
  padding: 1px;
}

.welcome h1 {
  color: #fff;
  font-size: 1.5em;
}

.createRoomButton {
  padding: 0.3em;
  font-size: 0.8em;
  margin: 0.4em 0.7em;
  width: 200px;
  float: right;
  display: inline-block;
  background-color: #3a92cc;
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
  border-radius: 5px;
  background-color: #40425a;
  box-shadow: 0 0 20px #000;
  color: #fff;
}

.participantsWrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  flex-flow: wrap;
}

.personWrapper {
  position: relative;
  min-height: 5em;
  margin: 0.4em 0.2em;
  cursor: pointer;
  width: 125px;
  border-radius: 50%;
}

.participant {
  position: relative;
  min-height: 5em;
  margin: 0.4em 0.2em;
  cursor: pointer;
  width: 100%;
  border-radius: 50%;
  -webkit-box-shadow: inset 0 0 8px #000;
  box-shadow: inset 0 0 8px #000;
}

.playerName {
  min-height: 30px;
  font-size: 0.5em;
  box-shadow: inset 0 0 7px #000;
  text-align: center;
  line-height: 26px;
}

.noParticipant {
  width: 90%;
  border-radius: 50%;
  height: 90%;
  position: absolute;
  z-index: 0;
  top: 6px;
  left: 6px;
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
  margin-top: 45%;
}

.reservedPlayer {
  width: 100%;
  background-color: #e8e8e800;
  border-radius: 50%;
  padding-top: 8px;
}

.reservedPlayer img {
  width: 80%;
  border: 1px solid;
  border-radius: 50%;
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

.fbButton {
  color: white;
  min-width: 150px;
  background-color: #2655daa1;
  height: 2.5rem;
  border-radius: 0;
  border: 0;
  cursor: pointer;
  font-weight: 400;
  font-size: 0.8rem;
  margin: 2px;
}

.logoLoginWrapper {
  display: flex;
  justify-content: flex-start;
}

.login {
  padding: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  -webkit-box-shadow: 0 0 15px #000000;
  box-shadow: 0 0 15px #000000;
  border-radius: 5px;
}

.login .divider {
  font-size: 0.8em;
  margin: 5px;
}

.loginWrapper {
  display: flex;
  flex-direction: column;
  color: #fff;
  padding: 1em;
}

.logoWrapper img{
  width: 300px;
}

.loginWrapper input {
  height: 30px;
  font-size: 0.8em;
  color: #fff;
  border: 0;
  background-color: #37384e;
  -webkit-box-shadow: 1 0 15px #000000;
  box-shadow: 0 0 15px #000000;
  box-shadow: inset 11px 7px 19px rgba(0, 0, 0, 0.2);
  padding: 5px;
}

.loginWrapper input::-webkit-input-placeholder { /* Chrome/Opera/Safari */
  color: #fff;
  font-size: 0.8em;
}

#customNameWrapper {
  display: flex;
}

#customNameWrapper button{
  background-color: #314fab;
  border: 0;
  width: 100px;
  color: #fff;
  cursor: pointer;
}

@media only screen and (max-width: 768px) {
  .room {
    width: 80%;
    padding: 0.5em;
  }

  .actionButtonsWrapper {
    flex-direction: column;
  }

  .actionButtonsWrapper input {
    width: 80%;
  }

  .participant {
    width: 115px;
  }
}
</style>
