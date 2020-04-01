import Vue from 'vue';
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export default class Service {
  axiosInstance!: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.VUE_APP_SERVER,
      timeout: 2000,
    });

    this.axiosInstance.interceptors.response.use((response) => response, (error: AxiosError) => {
      if (error.response) {
        Vue.alert(error.response.data.message);
      }
      return Promise.reject(error);
    });
  }

  get(path: string): Promise<AxiosResponse<any>> {
    return this.axiosInstance.get(path);
  }
}
