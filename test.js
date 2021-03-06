/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 22:58:11
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 22:59:16
 * @description: file content
 */
/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 17:47:23
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 22:43:27
 * @description: file content
 */
const Koa = require('koa');
// koa-router@7.x
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
import MyGraphQLSchema from './MyGraphQLSchema.js';
import axios from './axios.js';

// 登录接口
const loginInfo = () => {
    return axios.post('/backend-api/api-user/login', {
        job_number: '25',
        password: "Julive@666"
    })
}

const app = new Koa()

const router = new Router();
// 先登录
loginInfo().then(result => {
    let cookieVal = result.headers['set-cookie'];
    // 设置请求cookie
    axios.defaults.headers['cookie'] = cookieVal;
    router.all('/graphql', graphqlHTTP({
      schema: MyGraphQLSchema,
      graphiql: true
    }));
    
    app.use(router.routes()).use(router.allowedMethods());
});

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');