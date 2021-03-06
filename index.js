/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 17:47:23
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 21:26:35
 * @description: file content
 */
const Koa = require('koa');
const Router = require('koa-router'); // koa-router@7.x
const graphqlHTTP = require('koa-graphql');
import MyGraphQLSchema from './MyGraphQLSchema.js';
const app = new Koa()

const router = new Router();

router.all('/graphql', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')