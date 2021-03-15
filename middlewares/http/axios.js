/*
 * @author: xiejiaxin
 * @Date: 2021-03-13 19:56:49
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-14 16:56:02
 * @description: 请求封装
 */
import axiosApi from 'axios';
import qs from 'qs';
// 设置接口请求域名
let axios = axiosApi.create({
    baseURL: 'http://testbackendapi.comjia.com',
    // baseURL: 'http://test12bbs.comjia.com',
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    // }
});
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// POST传参序列化(添加请求拦截器)
axios.interceptors.request.use((config) => {
    // 在发送请求之前做某件事x
    if (config.method === 'post') {
        config.data = qs.stringify(config.data)
    }
    return config
}, (error) => {
    console.log('错误的传参', 'fail')
    return Promise.reject(error)
})
// axios.interceptors.request.use((config) => {
//     // 在发送请求之前做某件事
//     if (config.method === 'post') {
//       if (config.headers['Content-Type'] === 'application/x-www-form-urlencoded;charset=UTF-8') {
//         config.data = qs.stringify(config.data)
//       } else {
//         config.data = config.data
//       }
//     }
//     return config
//   }, (error) => {
//     console.log('错误的传参', 'fail')
//     return Promise.reject(error)
//   })

export default axios;