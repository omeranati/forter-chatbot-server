export interface Message {
    timestamp: number,
    senderDisplayName: string,
    senderUUID: string,
    content: string,
    isQuestion: boolean,
    answerId: string
};