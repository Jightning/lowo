export interface Snippet {
    id: string,
    title: string,
    categoryId: string,
    content: {
        type: 'text' | 'code' | 'image',
        content: string,
        language?: string
    }
}

