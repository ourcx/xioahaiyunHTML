
import axios from 'axios';

const apiClient = axios.create({
  // baseURL: 'http://127.0.0.1:8085',
  // timeout: 10000,
});

// 请求拦截器（自动添加JWT）
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;
