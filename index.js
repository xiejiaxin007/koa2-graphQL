/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 17:47:23
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-14 17:01:26
 * @description: file content
 */
const Koa = require('koa');
// koa-router@7.x
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
const bodyparser = require('koa-bodyparser');
import {
    graphql
} from 'graphql';
import BBSchema from './controllers/bbs/BBSchema.js';
import MyGraphQLSchema from './controllers/backend/MyGraphQLSchema';
import axios from './middlewares/http/axios';
import loginFn from './controllers/common/login';


// 请求node中router未命中的所有路由
const getOtherInfo = (ctx) => {
    const {
        method,
        url,
        body
    } = ctx.request;
    return axios({
        method: method,
        url: url,
        data: body
    });
}

const app = new Koa()

const router = new Router();
// 设置跨域
app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
// post请求参数解析中间件
app.use(bodyparser());
// 拦截中间层没有的请求
app.use(async (ctx, next) => {
    await next();
    if (parseInt(ctx.status) === 404) {
        // TODO 静态资源或者是node层没有做的接口，需要中间请求后端接口
        let res = await getOtherInfo(ctx);
        ctx.response.body = res.data;
    }
});
// 先登录文件
loginFn(router);
// bbs--测试graphql
router.all('/graphql', graphqlHTTP({
    schema: BBSchema,
    graphiql: true
}));

// 支撑系统
router.all('/backend-graphql', graphqlHTTP({
    schema: MyGraphQLSchema,
    graphiql: true
}));

// 测试bbs客户端发送过来的请求
router.get('/test-graphql', async (ctx) => {
    const query = `{
        info{
            employee_name
            job_number
            info{
              active
              track_url
              menu{
                id
                is_new
                is_out_url
                menu_name
                role
                route
              }
              track_common_property{
                city_id
                ip
                login_employee_id
                product_id
                role
                
              }
            }
          }
      }`
    let {
        data
    } = await graphql(BBSchema, query);
    ctx.body = {
        code: 0,
        data: data.info
    };
});
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');