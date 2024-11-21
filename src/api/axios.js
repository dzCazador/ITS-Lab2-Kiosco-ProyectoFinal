import axios from 'axios';

const instance = axios.create({
  //baseURL: 'http://localhost:3000/api',
  baseURL: 'https://kioskojuanita-backend-production.up.railway.app/api'
});

export default instance;
