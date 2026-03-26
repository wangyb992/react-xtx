import axios from 'axios'
import { useUserStore } from '@/stores/user';

const notifyRequestError = async (text) => {
  const messageText = text || '请求失败，请稍后重试'
  try {
    const { message } = await import('antd')
    message.error(messageText)
  } catch {
    console.error(messageText)
  }
}

// 创建axios实例
const http = axios.create({
  baseURL: 'http://pcapi-xiaotuxian-front-devtest.itheima.net',
  timeout: 5000
})
// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    // 1. 从pinia获取token数据
  // const { userInfo } = useUserStore()
  // 2. 按照后端的要求拼接token数据
  const token = useUserStore.getState().userInfo.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    notifyRequestError(error?.response?.data?.message)
    // 401 状态码，说明token失效
    if (error?.response?.status === 401) {
      // 1. 清空失效的token
      useUserStore.getState().clearUserInfo()
      // 2. 跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(error);
  });



// 导出实例
export default http;

