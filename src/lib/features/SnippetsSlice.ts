import {
    createSlice,
    PayloadAction,
    createAsyncThunk // Import the base function
} from '@reduxjs/toolkit'
// We still need the store's types
import type { RootState, AppDispatch } from '@/lib/store'
import { Snippet, SnippetBaseType, SnippetsState, StatusType } from '@/types'
import axios from 'axios';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

const initialState: SnippetsState = {
    snippetsData: [],
    status: StatusType.IDLE,
    error: null
}

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

                createdAt: p.createdAt,
                updatedAt: p.updatedAt
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

// Optimistic create without client-generated Mongo id.
export const createSnippet = createAsyncThunk<
    Snippet,
    SnippetBaseType,
    { state: RootState; dispatch: AppDispatch }
>(
    'snippets/createSnippet',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.post(`${db_route}/api/snippets`, JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            const doc = Array.isArray(data) ? data[0] : data;
            return {
                id: doc._id,
                title: doc.title,
                categoryId: doc.categoryId,
                tags: doc.tags,
                content: {
                    type: doc.content?.type,
                    content: doc.content?.content,
                    language: doc.content?.language
                },
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            } as Snippet;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to create snippet.');
            }
            return thunkAPI.rejectWithValue('An unknown error occurred.');
        }
    }
);

export const SnippetsSlice = createSlice({
    name: 'snippets',
    initialState,
    reducers: {
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
            })
            // Optimistic lifecycle for createSnippet
            .addCase(createSnippet.pending, (state, action) => {
                const { title, categoryId, tags, content } = action.meta.arg as any;
                
                // Creates a temporary snippet while we wait for a response from the server
                const temp: Snippet = {
                    id: `temp-${action.meta.requestId}`,
                    title,
                    categoryId: categoryId ?? undefined,
                    tags: tags ?? [],
                    content: {
                        type: content.type,
                        content: content.content,
                        language: content.language ?? 'plaintext'
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };

                state.snippetsData.push(temp);
            })
            .addCase(createSnippet.fulfilled, (state, action) => {
                const real = action.payload;
                // shared temp id from the pending case
                const tempId = `temp-${action.meta.requestId}`;
                const idx = state.snippetsData.findIndex(s => s.id === tempId);

                if (idx !== -1) {
                    state.snippetsData[idx] = real;
                } else {
                    state.snippetsData.push(real);
                }
            })
            .addCase(createSnippet.rejected, (state, action) => {
                const tempId = `temp-${action.meta.requestId}`;
                state.snippetsData = state.snippetsData.filter(s => s.id !== tempId);
                state.error = typeof action.payload === 'string' ? action.payload : (action.error.message ?? 'Failed to create snippet');
            });
    },
})

export const { deleteSnippet, updateSnippet } = SnippetsSlice.actions

export const selectSnippets = (state: RootState) => state.snippets.snippetsData
export const selectSnippetsStatus = (state: RootState) => state.snippets.status
export const selectSnippetsError = (state: RootState) => state.snippets.error

export default SnippetsSlice.reducer