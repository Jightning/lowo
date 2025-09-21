import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createAppAsyncThunk, RootState } from '@/lib/store'
import { SnippetsState } from '@/types'
import axios from 'axios';

// Define the initial state using that type
const initialState: SnippetsState = {
    snippetsData: [
        {
            id: 's1',
            title: 'Hello World (JS)',
            categoryId: 'c1',
            content: {
                type: 'code',
                content: "console.log('Hello, world!');",
                language: 'javascript'
            }
        },
        {
            id: 's2',
            title: 'Update README',
            categoryId: 'c2',
            content: {
                type: 'text',
                content: 'Remember to update the README with setup and run instructions.'
            }
        },
        {
            id: 's3',
            title: 'App Logo',
            categoryId: 'c3',
            content: {
                type: 'text',
                content: 'Lorem Ipsum Dolor Met Fet Etc.'
            }
        }
    ],
    status: 'idle',
    error: null
}

// export const fetchData = createAppAsyncThunk(
//   'snippets/fetchData',
//   async () => {
//     const response = await axios.get('https://your-aws-api-endpoint.com/data'); 
//     return response.data;
//   }
// );

export const SnippetsSlice = createSlice({
    name: 'snippets',
    initialState,
    reducers: {
        addSnippet: (state: SnippetsState, action: PayloadAction<SnippetsState["snippetsData"][number]>) => {
            state.snippetsData.push(action.payload);
        }
    },
    // extraReducers: (builder) => {
    //     builder
    //         .addCase(fetchData.pending, (state) => {
    //             state.status = 'pending';
    //         })
    //         .addCase(fetchData.fulfilled, (state, action) => {
    //             state.status = 'succeeded';
    //             state.snippetsData = action.payload; // Set the fetched data
    //         })
    //         .addCase(fetchData.rejected, (state, action) => {
    //             state.status = 'failed';
    //             state.error = action.error.message ?? null;
    //         });
    // },
})

// export const fetchPosts = createAppAsyncThunk('posts/fetchPosts', async () => {
//     const response = await client.get<Post[]>('/fakeApi/posts')
//     return response.data
// })

export const { addSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData
export const selectSnippetsStatus = (state: RootState) => state.snippets.status
export const selectSnippetsError = (state: RootState) => state.snippets.error

export default SnippetsSlice.reducer