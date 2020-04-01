<template>
  <div class="container">
    <RoomComponent></RoomComponent>
  </div>
</template>

<script>
// @ is an alias to /src
import RoomComponent from '@/components/RoomComponent.vue';

export default {
  name: 'Home',
  components: {
    RoomComponent,
  },
};
</script>
