import { Client } from '@elastic/elasticsearch';
import { Message } from './message';
import { createSearchQuery } from './elasticsearch-queries';
import io from 'socket.io-client';

export const BOT_ID = 'BOT';
export const BOT_DISPLAY_NAME = 'BOT';

const ELASTICSEARCH_PORT = 9200;
const client: Client = new Client({ node: `http://localhost:${ELASTICSEARCH_PORT}` })
const socket: SocketIOClient.Socket = io.connect('http://localhost:3000');
const prefixes: Array<string> = [
    '🙏🏼 I found this: ',
    'Glad to help! 💡 ',
    'Of course I remember. 😜 There: ',
    '🤪 Here: ',
    'Oh. gosh. 😂 Here: ',
    'OMG 🤦🏽‍♂️ Its: ',
    'Are you serious? Its: '
];
const jokes: { [key: string]: any } = {
    'who are you?': {
        content: '🤫 I am your assistant, ',
        displayName: true
    },
    'are you the best assistant?': {
        content: 'Are there any others? 🤭',
        displayName: false
    }
};

socket.on('broadcast message', async (message: Message) => {
    if (message.isQuestion) {
        if (jokes[message.content.toLocaleLowerCase()]) {
            const joke = jokes[message.content.toLocaleLowerCase()];

            let name = '';

            if (joke.displayName) {
                name = message.senderDisplayName;
            }

            const messageToSend = {
                content: joke.content + name,
                senderDisplayName: BOT_DISPLAY_NAME,
                senderUUID: BOT_ID
            }

            setTimeout(() => { socket.emit('incoming message', messageToSend); }, 2000);
        } else {
            const { body } = await client.search(createSearchQuery(message.content));

            if (body.hits.hits.length !== 0 &&
                body.hits.hits[0]._source.answerId) {
                const answerId = body.hits.hits[0]._source.answerId;
                const answer = await client.get({
                    index: 'message',
                    type: '_doc',
                    id: answerId
                });

                const chosen = prefixes[Math.floor(Math.random() * prefixes.length)];
                const messageToSend = {
                    content: chosen + '\"' + answer.body._source.content + '\"',
                    senderDisplayName: 'BOT',
                    senderUUID: 'BOT',
                }

                setTimeout(() => { socket.emit('incoming message', messageToSend); }, 2000);
            }
        }
    }
});