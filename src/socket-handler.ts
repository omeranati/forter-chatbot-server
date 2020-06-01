import express from 'express';
import httpServer from 'http';
import socketIO from 'socket.io';

const app = express();
const http = httpServer.createServer(app);
const io = socketIO(http);

io.on('connection', (socket: any) => {
    socket.emit("event", "You connected");
    console.log('a user connected');
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});