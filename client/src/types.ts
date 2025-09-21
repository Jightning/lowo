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
export interface SnippetsState {
    snippetsData: Snippet[],
    status: 'idle' | 'pending' | 'succeeded' | 'failed',
    error: string | null
}

export interface Category {
    id: string,
    name: string,
    color: string,
    icon: string
}

export interface CategoriesState {
    categoriesData: Category[],
    status: 'idle' | 'pending' | 'succeeded' | 'failed',
    error: string | null
}