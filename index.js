/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 17:47:23
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 23:26:04
 * @description: file content
 */
const Koa = require('koa');
// koa-router@7.x
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
import BBSchema from './BBSchema.js';
import axios from './axios.js';

// 登录接口
const getLoginInfo = () => {
    return axios.post('/api/bbs-api-user/login', {
        "job_number": "35",
        "password": "Julive@888"
    });
};

const app = new Koa()

const router = new Router();
// 先登录
getLoginInfo().then(result => {
    let cookieVal = result.headers['set-cookie'];
    // 设置请求cookie
    axios.defaults.headers['cookie'] = cookieVal;
    router.all('/graphql', graphqlHTTP({
      schema: BBSchema,
      graphiql: true
    }));
    
    app.use(router.routes()).use(router.allowedMethods());
});

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');