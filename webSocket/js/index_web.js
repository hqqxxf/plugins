/**
 * Created by Administrator on 2015/9/1.
 */
var socket = io.connect('http://localhost:8088');
socket.on("message",function(data){
    console.log(data);
    socket.on("start", function(data){
        socket.emit('message',{name: 'hqq'});
    });

});
