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
                content: 'Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.'
            }
        }
    ],
    status: 'idle',
    error: null
}

export const SnippetsSlice = createSlice({
    name: 'snippets',
    initialState,
    reducers: {
        addSnippet: (state: SnippetsState, action: PayloadAction<SnippetsState["snippetsData"][number]>) => {
            state.snippetsData.push(action.payload);
        }, 
        deleteSnippet: (state: SnippetsState, action: PayloadAction<{ id: string }>) => {
            state.snippetsData = state.snippetsData.filter(s => s.id !== action.payload.id);
        },
        updateSnippet: (state: SnippetsState, action: PayloadAction<SnippetsState["snippetsData"][number]>) => {
            const idx = state.snippetsData.findIndex(s => s.id === action.payload.id);
            if (idx !== -1) {
                state.snippetsData[idx] = action.payload;
            }
        },
    },
})

export const { addSnippet, deleteSnippet, updateSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData
export const selectSnippetsStatus = (state: RootState) => state.snippets.status
export const selectSnippetsError = (state: RootState) => state.snippets.error

export default SnippetsSlice.reducer