import { Client } from '@elastic/elasticsearch';
import { Message } from './message';
import { LAST_MESSAGE_QUERY, ALL_MESSAGES_QUERY } from './elasticsearch-queries';

const ELASTICSEARCH_PORT = 9200;
const client = new Client({ node: `http://localhost:${ELASTICSEARCH_PORT}` })

export class MessageHandler {
    public static async getLastMessage() {
        const { body } = await client.search(LAST_MESSAGE_QUERY);

        return body.hits.hits[0];
    }

    public static async getAllMessages(): Promise<Message[]> {
        const { body } = await client.search(ALL_MESSAGES_QUERY);

        return body.hits.hits.map((message: any) => message._source);
    }

    public static async updateAnswer(questionId: string, answerId: string) {
        return await client.update({
            index: 'message',
            type: '_doc',
            id: questionId,
            body: {
                doc: {
                    answerId
                }
            }
        });
    }

    public static async indexIncomingMessage(message: Message) {
        message.timestamp = new Date().getTime();
        message.isQuestion =
            message.content.charAt(message.content.length - 1) === '?';

        const insertedDocument = await client.index({
            index: 'message',
            type: '_doc',
            body: message
        });

        if (!message.isQuestion) {
            const lastMessage = await MessageHandler.getLastMessage();

            if (lastMessage._source.isQuestion) {
                await MessageHandler.updateAnswer(
                    lastMessage._id,
                    insertedDocument.body._id
                );
            }
        }

        return insertedDocument;
    }
}