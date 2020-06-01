import { Client } from '@elastic/elasticsearch';
import './socket-handler'
const client = new Client({ node: 'http://localhost:9200' })



async function run() {
    const message = await client.index({
        index: 'message',
        type: '_doc',
        body: {
            created_at: new Date().getTime(),
            sender: 'Omer Anati',
            message: 'My name is lala',
            isQuestion: true,
            answerId: null
        }
    });

    console.log(message.body._id);

    await client.indices.refresh({ index: 'message' })

    // Let's search!
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
                    "created_at": {
                        "order": "desc"
                    }
                }
            ]
        }
    })

    console.log(body.hits.hits)
}

//run().catch(console.log)
