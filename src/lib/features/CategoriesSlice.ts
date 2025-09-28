import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/lib/store'
import { CategoriesState, Category } from '@/types'
import axios from 'axios';
import { getToken } from '../session';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

// Define the initial state using that type
const initialState: CategoriesState = {
    categoriesData: [
        // {
        //     id: 'c1',
        //     name: 'General',
        //     color: '#06b6d4',
        //     icon: 'globe',
        //     dateCreated: "2025-09-21T05:53:00.000Z",
        //     dateUpdated: "2025-09-21T05:53:00.000Z",
        // },
        // {
        //     id: 'c2',
        //     name: 'Docs',
        //     color: '#f59e0b',
        //     icon: 'book',
        //     dateCreated: "2025-09-21T05:53:00.000Z",
        //     dateUpdated: "2025-09-21T05:53:00.000Z",
        // },
        // {
        //     id: 'c3',
        //     name: 'Assets',
        //     color: '#ef4444',
        //     icon: 'image',
        //     dateCreated: "2025-09-21T05:53:00.000Z",
        //     dateUpdated: "2025-09-21T05:53:00.000Z",
        // }
    ],
    status: 'idle',
    error: null
}

let token: string | null;

/**
 * Async thunk to fetch categories from the API
 */
export const fetchCategories = createAsyncThunk<
    Category[],
    void,
    {
        state: RootState
        dispatch: AppDispatch
    } 
>(
    'categories/fetchCategories',
    async (_, thunkAPI) => {
        // // 1. Retrieve the token from localStorage
        // token = localStorage.getItem('token');
        token = await getToken()

        // 2. Handle the case where no token is found
        if (!token) {
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
            const response = await axios.get<any[]>(`${db_route}/api/categories`, config);
            if (response.data.length == 0) {
                const basic = {
                    id: "basic",
                    name: "Basic",
                    color: "#FFF",
                    icon: "",
                    description: "",
                    dateCreated: "2025-09-21T05:53:00.000Z",
                    dateUpdated: "2025-09-21T05:53:00.000Z"
                }

                axios.post(`${db_route}/api/categories`, JSON.stringify(basic), {
                    headers: { 
                        'Content-Type': 'application/json',
                        'x-auth-token': token
                    },
                })

                return [basic]
            }

            return response.data.map(p => ({
                id: p.id,
                name: p.name,
                color: p.color,
                icon: p.icon,
                description: p.description,
                dateCreated: p.dateCreated,
                dateUpdated: p.dateUpdated
            }));
        } catch (error) {
            // Handle network or server errors
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch categories.');
            }
            return thunkAPI.rejectWithValue('An unknown error occurred.');
        }
    }
);

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state: CategoriesState, action: PayloadAction<CategoriesState["categoriesData"][number]>) => {
            state.categoriesData.push(action.payload);

            if (!token) return

            axios.post(`${db_route}/api/categories`, JSON.stringify(action.payload), {
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
            })
        },
        deleteCategory: (state: CategoriesState, action: PayloadAction<{ id: string }>) => {
            state.categoriesData = state.categoriesData.filter(c => c.id !== action.payload.id);

            if (!token) return

            axios.delete(`${db_route}/api/categories/${action.payload.id}`, {
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            });
        },
        updateCategory: (state: CategoriesState, action: PayloadAction<CategoriesState["categoriesData"][number]>) => {
            const idx = state.categoriesData.findIndex(c => c.id === action.payload.id);
            if (idx !== -1) {
                state.categoriesData[idx] = action.payload;
            }

            if (!token) return

            axios.put(`${db_route}/api/categories/${action.payload.id}`, JSON.stringify(action.payload), {
                headers: { 
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }, 
            });
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categoriesData = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch categories';
            });
    },
})

export const { addCategory, deleteCategory, updateCategory } = categoriesSlice.actions

export const selectCategories = (state: RootState) => state.categories.categoriesData
export const selectCategoriesStatus = (state: RootState) => state.categories.status
export const selectCategoriesError = (state: RootState) => state.categories.error

export default categoriesSlice.reducer