export interface TaskType {
    id: string,
    title: string,
    description: string,
    dueDate: string,
    urgency: number,
    memberIds: string[]
    discussionId: string
}

export interface MessageType {
    id: string,
    authorId: string,
    content: {
        type: 'text' | 'image' | 'video'
        content: string
    },
}
export interface ThreadType {
    id: string,
    authorId: string,
    header: {
        type: 'text' | 'image' | 'video'
        content: string
    }[],
    replies: MessageType[]
}
export interface DiscussionType {
    id: string,
    messages: {
        type: 'thread' | 'message'
        content: ThreadType | MessageType
    }[]
}
