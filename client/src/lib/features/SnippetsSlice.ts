import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk, type RootState } from '@/lib/store'
import { SnippetsState } from '@/types'

// Define the initial state using that type
const initialState: SnippetsState = {
    snippetsData: [],
    status: 'idle',
    error: null
}

export const SnippetsSlice = createSlice({
    name: 'snippets',
    initialState,
    reducers: {
        addSnippet: (state: SnippetsState, action: PayloadAction<SnippetsState["snippetsData"][number]>) => {
            state.snippetsData.push(action.payload);
        }
    }
})

// export const fetchPosts = createAppAsyncThunk('posts/fetchPosts', async () => {
//     const response = await client.get<Post[]>('/fakeApi/posts')
//     return response.data
// })

export const { addSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData

export default SnippetsSlice.reducer