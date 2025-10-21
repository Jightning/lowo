import {
    createSlice,
    PayloadAction,
    createAsyncThunk // Import the base function
} from '@reduxjs/toolkit'
// We still need the store's types
import type { RootState, AppDispatch } from '@/lib/store'
import { Snippet, SnippetsState, StatusType } from '@/types'
import axios from 'axios';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

const initialState: SnippetsState = {
    snippetsData: [],
    status: StatusType.IDLE,
    error: null
}

let token: string | null; // retained variable, but API calls no longer depend on it

/**
 * We now use the base `createAsyncThunk`.
 * We provide the types for its return value, arguments, and thunkAPI config directly.
 * Generic arguments are: <ReturnedValue, ThunkArg, ThunkApiConfig>
 */
export const fetchSnippets = createAsyncThunk<
    Snippet[],
    void,
    {
        state: RootState
        dispatch: AppDispatch
    }
>(
    'snippets/fetchSnippets',
    // The second argument, thunkAPI, allows us to handle failures gracefully
    async (_, thunkAPI) => {
        try {
            // Cookies are automatically sent for same-origin; middleware reads session cookie
            const response = await axios.get<any[]>(`${db_route}/api/snippets`);

            return response.data.map(p => ({
                id: p._id,
                title: p.title,
                categoryId: p.categoryId,
                content: {
                    type: p.content.type,
                    content: p.content.content,
                    language: p.content.language
                },

                dateCreated: p.dateCreated,
                dateUpdated: p.dateUpdated
            }));
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
            state.snippetsData.push(action.payload)

            axios.post(`${db_route}/api/snippets`, JSON.stringify(action.payload), {
                headers: { 
                    'Content-Type': 'application/json'
                },
            })
        }, 
        deleteSnippet: (state: SnippetsState, action: PayloadAction<{ id: string }>) => {
            state.snippetsData = state.snippetsData.filter(s => s.id !== action.payload.id);

            axios.delete(`${db_route}/api/snippets/${action.payload.id}`, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
        },
        updateSnippet: (state: SnippetsState, action: PayloadAction<SnippetsState["snippetsData"][number]>) => {
            const idx = state.snippetsData.findIndex(s => s.id === action.payload.id);
            if (idx !== -1) {
                state.snippetsData[idx] = action.payload;
            }

            axios.put(`${db_route}/api/snippets/${action.payload.id}`, JSON.stringify(action.payload), {
                headers: { 
                    'Content-Type': 'application/json'
                },
            });
        },
    },
        // The extraReducers logic does not need to change
    extraReducers: (builder) => {
        builder
            .addCase(fetchSnippets.pending, (state) => {
                state.status = StatusType.PENDING;
                state.error = null;
            })
            .addCase(fetchSnippets.fulfilled, (state, action) => {
                state.status = StatusType.SUCCEEDED;
                state.snippetsData = action.payload;
            })
            .addCase(fetchSnippets.rejected, (state, action) => {
                state.status = StatusType.FAILED;
                state.error = action.error.message ?? 'Failed to fetch snippets';
            });
    },
})

export const { addSnippet, deleteSnippet, updateSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData
export const selectSnippetsStatus = (state: RootState) => state.snippets.status
export const selectSnippetsError = (state: RootState) => state.snippets.error

export default SnippetsSlice.reducer