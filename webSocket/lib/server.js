/**
 * Created by Administrator on 2015/9/1.
 */
var http= require('http'),
    app = http.createServer(),
    io = require('socket.io').listen(app);

app.listen(80);

io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });//������һ���ͻ��������ϣ����������ݣ���һ������'new'Ϊ���������ڶ���������Ϊ����
    socket.on('my new event', function (data) {//����ͻ��˷�����Ϊ'my other event'������
        console.log(data.my);
    });
    socket.emit('other', { hello: 'other world' });//������һ������
    socket.on('event1', function (data) {//��������һ������
        console.log(data.my);
    });
});