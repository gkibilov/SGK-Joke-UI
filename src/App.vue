<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body{
  font-size: 24px;
  background-image: url('https://scontent-sjc3-1.xx.fbcdn.net/v/t1.0-9/74696607_573419690128341_92121795754196992_o.jpg?_nc_cat=103&_nc_sid=6e5ad9&_nc_ohc=jTWToAxeSMEAX8__gqy&_nc_ht=scontent-sjc3-1.xx&oh=cca189cb3ad31fad16f8069583ca4b01&oe=5EA0E6F4');
}

body, html{
margin: 0;
padding: 0;
height: 100%;}
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #080f17;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
