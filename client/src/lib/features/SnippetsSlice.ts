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
    snippetsData: [],
    status: 'idle',
    error: null
}

/**
 * We now use the base `createAsyncThunk`.
 * We provide the types for its return value, arguments, and thunkAPI config directly.
 * Generic arguments are: <ReturnedValue, ThunkArg, ThunkApiConfig>
 */
export const fetchSnippets = createAsyncThunk<
    FetchedSnippet[], // This is the type of data we expect to return
    void,             // This is the type of the argument passed to the thunk (none in this case)
    {                 // This is the type for the thunkAPI
        state: RootState
        dispatch: AppDispatch
    }
>(
    'snippets/fetchSnippets',
    async () => {
        // The logic inside the thunk remains the same
        const response = await axios.get<FetchedSnippet[]>('https://jsonplaceholder.typicode.com/posts');
        return response.data;
    }
);

export const SnippetsSlice = createSlice({
    name: 'snippets',
    initialState,
    reducers: {
        addSnippet: (state: SnippetsState, action: PayloadAction<SnippetsState["snippetsData"][number]>) => {
            state.snippetsData.push(action.payload);
        }
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

export const { addSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData
export const selectSnippetsStatus = (state: RootState) => state.snippets.status
export const selectSnippetsError = (state: RootState) => state.snippets.error

export default SnippetsSlice.reducer