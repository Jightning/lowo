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

export interface Category {
    id: string,
    name: string,
    color: string,
    icon: string
}