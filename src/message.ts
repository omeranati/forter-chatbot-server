export interface Message {
    timestamp: number,
    sender: string,
    content: string,
    isQuestion: boolean,
    answerId: string
};