import express from 'express';
import httpServer from 'http';
import socketIO from 'socket.io';
import { Message } from './message';
import { MessageHandler } from './message-handler';

const app = express();
const http = httpServer.createServer(app);
const io = socketIO(http);

io.on('connection', (socket: any) => {
    socket.on('incoming message', async (message: Message) => {
        if (await MessageHandler.indexIncomingMessage(message)) {
            io.emit('broadcast message', message)
        }
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});