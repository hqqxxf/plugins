/**
 * Created by Administrator on 2015/9/1.
 */


    //var socket = new WebSocket("ws://172.16.1.110:8088/");
    //console.log(socket.readyState);
    //socket.onerror = function(error){
    //    console.log(socket.readyState,error);
    //};
    //socket.onopen = function(event) {
    //
    //    // 发送一个初始化消息
    //    socket.send("I am the client and I'm listening!");
    //
    //    // 监听消息
    //    socket.onmessage = function (event) {
    //        console.log("Client received a message", event);
    //    };
    //
    //    // 监听Socket的关闭
    //    socket.onclose = function (event) {
    //        console.log("Client notified socket has closed", event);
    //    };
    //}

var socket = io.connect('http://localhost:80');
socket.on('news', function (data) {//接收到服务器发送过来的名为'new'的数据
    console.log(data.hello);//data为应服务器发送过来的数据。
    socket.emit('my new event', { my:'new data' });//向服务器发送数据，实现双向数据传输
});
socket.on('other', function (data) {//接收另一个名为'other'数据，
    console.log(data.hello);
    socket.emit('event1', { my:'other data' });
});

