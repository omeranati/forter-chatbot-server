import { Client } from '@elastic/elasticsearch';
import { Message } from './message';

const client = new Client({ node: 'http://localhost:9200' })

export class MessageHandler {
    public static async getLastMessage() {
        const { body } = await client.search({
            index: 'message',
            type: '_doc',
            body: {
                query: {
                    match_all: {}
                },
                size: 1,
                sort: [
                    {
                        timestamp: {
                            order: "desc"
                        }
                    }
                ]
            }
        })

        return body.hits.hits[0];
    }

    public static async getAllMessages(): Promise<Message[]> {
        const { body } = await client.search({
            index: 'message',
            type: '_doc',
            body: {
                query: {
                    match_all: {}
                },
                size: 100,
                sort: [
                    {
                        timestamp: {
                            order: "desc"
                        }
                    }
                ]
            },
        });

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
        message.answerId = "";

        console.log()
        if (message.content.charAt(message.content.length - 1).localeCompare('?') === 0) {
            message.isQuestion = true;

        } else {
            message.isQuestion = false;
        }

        const insertedDocument = await client.index({
            index: 'message',
            type: '_doc',
            body: message
        });

        if (!message.isQuestion) {
            const lastMessage = await MessageHandler.getLastMessage();

            if (lastMessage._source.isQuestion) {
                await MessageHandler.updateAnswer(lastMessage._id, insertedDocument.body._id);
            }
        }

        return insertedDocument;
    }
}