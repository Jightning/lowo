import {
    createSlice,
    PayloadAction,
    createAsyncThunk // Import the base function
} from '@reduxjs/toolkit'
// We still need the store's types
import type { RootState, AppDispatch } from '@/lib/store'
import { SnippetsState } from '@/types'
import axios from 'axios';

type FetchedSnippet = SnippetsState["snippetsData"][number];

const initialState: SnippetsState = {
    snippetsData: [
        {
            id: 's1',
            title: 'Hello World (JS)',
            categoryId: 'c1',
            dateCreated: "2025-09-21T05:53:00.000Z",
            dateUpdated: "2025-09-21T05:53:00.000Z",
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
            dateCreated: "2025-09-21T05:53:00.000Z",
            dateUpdated: "2025-09-21T05:53:00.000Z",
            content: {
                type: 'text',
                content: 'Remember to update the README with setup and run instructions.'
            }
        },
        {
            id: 's3',
            title: 'App Logo',
            categoryId: 'c3',
            dateCreated: "2025-09-21T05:53:00.000Z",
            dateUpdated: "2025-09-21T05:53:00.000Z",
            content: {
                type: 'text',
                content: 'Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.Lorem Ipsum Dolor Met Fet Etc.'
            }
        }
    ],
    status: 'idle',
    error: null
}

/**
 * We now use the base `createAsyncThunk`.
 * We provide the types for its return value, arguments, and thunkAPI config directly.
 * Generic arguments are: <ReturnedValue, ThunkArg, ThunkApiConfig>
 */
export const fetchSnippets = createAsyncThunk<
    FetchedSnippet[],
    void,
    {
        state: RootState
        dispatch: AppDispatch
    }
>(
    'snippets/fetchSnippets',
    // The second argument, thunkAPI, allows us to handle failures gracefully
    async (_, thunkAPI) => {
        // 1. Retrieve the token from localStorage
        const token = localStorage.getItem('token');

        // 2. Handle the case where no token is found
        if (!token) {
            // Use rejectWithValue to send a specific error payload
            return thunkAPI.rejectWithValue('No authentication token found.');
        }

        // 3. Create a config object with the required headers
        const config = {
            headers: {
                'x-auth-token': token
            }
        };

        try {
            // 4. Make the GET request with the config object
            const response = await axios.get<FetchedSnippet[]>('http://3.141.114.4:5000/api/snippets', config);
            console.log(JSON.stringify(response.data, null, 2))
            return response.data;
        } catch (error) {
            // Handle network or server errors
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch snippets.');
            }
            return thunkAPI.rejectWithValue('An unknown error occurred.');
        }
    }
);

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
        // The extraReducers logic does not need to change
    extraReducers: (builder) => {
        builder
            .addCase(fetchSnippets.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchSnippets.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.snippetsData = action.payload;
            })
            .addCase(fetchSnippets.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch snippets';
            });
    },
})

export const { addSnippet, deleteSnippet, updateSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData
export const selectSnippetsStatus = (state: RootState) => state.snippets.status
export const selectSnippetsError = (state: RootState) => state.snippets.error

export default SnippetsSlice.reducer