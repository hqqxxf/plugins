/**
 * Created by Administrator on 2015/9/1.
 */
var http = require('http'),
    app = http.createServer(),
    io = require('socket.io').listen(app);
app.listen(8088);

io.socket.on("connection", function(socket){
    socket.emit("start",{debug:true});
    socket.on("message", function(data){
        console.log(data);
    })
});
