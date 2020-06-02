export const LAST_MESSAGE_QUERY = {
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
};

export const ALL_MESSAGES_QUERY = {
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
};