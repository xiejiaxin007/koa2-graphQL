/*
 * @author: xiejiaxin
 * @Date: 2021-03-06 17:47:23
 * @LastEditors: xiejiaxin
 * @LastEditTime: 2021-03-06 17:48:15
 * @description: file content
 */
const Koa = require('koa')
const app = new Koa()

app.use( async ( ctx ) => {
  ctx.body = 'hello koa2'
})

app.listen(3000)
console.log('[demo] start-quick is starting at port 3000')