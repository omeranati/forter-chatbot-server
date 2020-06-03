import express from 'express';
import httpServer from 'http';
import socketIO from 'socket.io';
import { Message } from './message';
import { MessageHandler } from './message-handler';
import { throttle, debounce } from 'throttle-debounce';

type TypingUsersMap = { [key: string]: Function };

const app = express();
const http = httpServer.createServer(app);
const io = socketIO(http);
const typingUsers: TypingUsersMap = {};

const sendNoTypingUsers = debounce(3000, () => {
    io.emit('typing ended');
});

const sendTypingUsers = throttle(400, (typing: TypingUsersMap) => {
    io.emit("currently typing", Object.keys(typing).length);
});

const schedualUUIDDeletion = (uuid: string) => {
    if (!typingUsers[uuid]) {
        typingUsers[uuid] = debounce(2000, (uuid: string) => {
            delete typingUsers[uuid]
        });
    }

    typingUsers[uuid](uuid);
}

io.on('connection', (socket: SocketIO.Socket) => {
    socket.on('incoming message', async (message: Message) => {
        if (message.senderUUID !== 'BOT') {
            const result = await MessageHandler.indexIncomingMessage(message);

            if (!result) {
                return;
            }
        }

        io.emit('broadcast message', message)
    });

    socket.on('typing', (uuid: string) => {
        schedualUUIDDeletion(uuid);
        sendTypingUsers(typingUsers);
        sendNoTypingUsers();
    })
});



http.listen(3000, () => {
    console.log('listening on *:3000');
});