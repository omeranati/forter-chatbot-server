export interface Message {
    senderDisplayName: string,
    senderUUID: string,
    content: string,
    isQuestion?: boolean,
    answerId?: string,
    timestamp?: number
};