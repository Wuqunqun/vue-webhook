let http = require('http')
let crypto = require('crypto')
let SECRET = '19961125'// 跟github里的一样
function sign (body) {
  return `sha1=`+crypto.createHmac('sha1',SECRET).update(body).digest('hex')
}
let server = http.createServer(function(req,res){
  console.log(req.method,req.url)
  if(req.method == 'POST' && req.url == '/webhook'){
    let buffers = []
    req.on('data',function(buffer){
      buffers.push(buffer)
    })

    req.on('end',(buffer)=>{
      let body = Buffer.concat(buffers)
      let event = req.header['x-gitHub-event'];// event=push
      let signature = req.headers['x-hub-signature']// github请求过来时，要传递请求体body，另外传一个sinature，你需要验证对不对
      if(signature !== sign(body)){
        return res.end('Not Allowd')
      }
      res.setHeader('Content-Type','application/json')
      res.end(JSON.stringify({ok:true}))
      
    })

   
  }else{
    res.end("Not Found")
  }
})



server.listen(4000,()=>{
  console.log('服务已经在4000端口启动')
})