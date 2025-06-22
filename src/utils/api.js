
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

//重发请求
apiClient.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
  var config = err.config;
  if (config.url.indexOf('api/') > -1 && config.method === 'get' && config.retry !== false) {
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount < 3) {
      config.__retryCount += 1;
      return new Promise(function(resolve) {
        setTimeout(function() {
          resolve(apiClient(config));
          console.log('重发请求');
        })
      })
    }
  }
})
export default apiClient;
