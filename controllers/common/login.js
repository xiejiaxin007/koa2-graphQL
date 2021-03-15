/*
 * @author: xiejiaxin
 * @Date: 2021-03-13 22:00:09
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-14 16:56:14
 * @description: 登录相关文件
 */
import axios from '../../middlewares/http/axios';

export default function (router) {
    router.post('/backend-api/login', async (ctx, next) => {
        const result = await axios.post('/backend-api/api-user/login', {
            job_number: 130,
            password: "Julive@888"
        });
        // const result = await axios.post('/api/bbs-api-user/login', {
        //     job_number: 35,
        //     password: "Julive@888"
        // });
        let cookieVal = result.headers['set-cookie'];
        // 设置请求cookie
        axios.defaults.headers['cookie'] = cookieVal;
        ctx.body = result.data;
    })
};
 