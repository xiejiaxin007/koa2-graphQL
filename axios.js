/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 22:29:16
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 23:24:59
 * @description: file content
 */
import axiosApi from 'axios';
import qs from 'qs';
// 设置接口请求域名
let axios = axiosApi.create({
    baseURL: 'http://test12bbs.comjia.com',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    // baseURL: 'http://test24backend.comjia.com'
});
axios.interceptors.request.use((config) => {
    // 在发送请求之前做某件事
    if (config.method === 'post') {
      if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
        config.data = qs.stringify(config.data)
      } else {
        config.data = config.data
      }
    }
    return config
  }, (error) => {
    console.log('错误的传参', 'fail')
    return Promise.reject(error)
  })

export default axios;