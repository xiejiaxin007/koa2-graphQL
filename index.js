/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 17:47:23
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-07 22:11:25
 * @description: file content
 */
const Koa = require('koa');
// koa-router@7.x
const Router = require('koa-router');
const graphqlHTTP = require('koa-graphql');
import {
    graphql
} from 'graphql';
import BBSchema from './BBSchema.js';
import axios from './axios.js';

// 登录接口
const getLoginInfo = () => {
    return axios.post('/api/bbs-api-user/login', {
        "job_number": "35",
        "password": "Julive@888"
    });
};

// 请求node中router未命中的所有路由
const getOtherInfo = (ctx) => {
    return axios({
        method: ctx.request.method,
        url: ctx.request.url
    });
}

const app = new Koa()

const router = new Router();
// 先登录
// TODO 放到真正的登录请求处，分离页面需要提前请求，单独封装登录controller
getLoginInfo().then(result => {
    let cookieVal = result.headers['set-cookie'];
    // 设置请求cookie
    axios.defaults.headers['cookie'] = cookieVal;
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
    // 拦截中间层没有的请求
    app.use(async (ctx, next) => {
        await next();
        if (parseInt(ctx.status) === 404) {
            // TODO 静态资源或者是node层没有做的接口，需要中间请求后端接口
            let res = await getOtherInfo(ctx);
            ctx.response.body = res.data;
        }
    });
    router.all('/graphql', graphqlHTTP({
        schema: BBSchema,
        graphiql: true
    }));

    // 测试客户端发送过来的请求
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
});

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000');