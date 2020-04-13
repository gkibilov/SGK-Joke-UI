import { Client } from 'webstomp-client';

declare module 'vue/types/vue' {
  interface Vue {
    $ws: Client
  }
}