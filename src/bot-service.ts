import { Client } from '@elastic/elasticsearch';
import { Message } from './message';
import { LAST_MESSAGE_QUERY, ALL_MESSAGES_QUERY, createSearchQuery } from './elasticsearch-queries';
import io from 'socket.io-client';

const ELASTICSEARCH_PORT = 9200;
const client = new Client({ node: `http://localhost:${ELASTICSEARCH_PORT}` })
const socket = io.connect('http://localhost:3000');

socket.on('broadcast message', async (message: Message) => {
    console.log(message.senderDisplayName + " " + message.content + " " + message.isQuestion);

    if (message.isQuestion) {
        const { body } = await client.search(createSearchQuery(message.content));

        if (body.hits.hits.length !== 0 &&
            body.hits.hits[0]._source.answerId) {
            const answerId = body.hits.hits[0]._source.answerId;
            const answer = await client.get({
                index: 'message',
                type: '_doc',
                id: answerId
            });

            const messageToSend = {
                content: answer.body._source.content,
                senderDisplayName: 'BOT',
                senderUUID: 'BOT',
            }

            socket.emit("incoming message", messageToSend);
        }
    }
});