/**
 * Created by Administrator on 2015/9/1.
 */
var http= require('http'),
    app = http.createServer(),
    io = require('socket.io').listen(app);

app.listen(80);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });//监听，一旦客户端连接上，即发送数据，第一个参数'new'为数据名，第二个参数既为数据
    socket.on('my new event', function (data) {//捕获客户端发送名为'my other event'的数据
        console.log(data.my);
    });
    socket.emit('other', { hello: 'other world' });//发送另一个数据
    socket.on('event1', function (data) {//捕获另外一个数据
        console.log(data.my);
    });
});