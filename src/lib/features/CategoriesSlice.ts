import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/lib/store'
import { CategoriesState, Category, CategoryBaseType, StatusType } from '@/types'
import axios from 'axios';
import { nullCategory } from '../definitions';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

// Define the initial state using that type
const initialState: CategoriesState = {
    categoriesData: [nullCategory],
    status: StatusType.IDLE,
    error: null
}

/**
 * Async thunk to fetch categories from the API
 * returns list of categories which get added to slice categoriesData
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
        try {
            // Cookies are sent automatically for same-origin requests; middleware reads the session cookie
            const response = await axios.get<any[]>(`${db_route}/api/categories`);
            return response.data.map(p => ({
                id: p._id,
                name: p.name,
                color: p.color,
                icon: p.icon,
                description: p.description,
                createdAt: p.createdAt,
                updatedAt: p.updatedAt
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

// Optimistic create without client-generated Mongo id.
export const createCategory = createAsyncThunk<
    Category,
    CategoryBaseType,
    { state: RootState; dispatch: AppDispatch }
>(
    'categories/createCategory',
    async (payload, thunkAPI) => {
        try {
            const response = await axios.post(`${db_route}/api/categories`, JSON.stringify(payload), {
                headers: { 'Content-Type': 'application/json' },
            });

            const data = response.data;
            const doc = Array.isArray(data) ? data[0] : data;
            
            return {
                id: doc._id,
                name: doc.name,
                color: doc.color,
                icon: doc.icon,
                description: doc.description,
                createdAt: doc.createdAt,
                updatedAt: doc.updatedAt
            } as Category;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to create category.');
            }
            return thunkAPI.rejectWithValue('An unknown error occurred.');
        }
    }
);


export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        deleteCategory: (state: CategoriesState, action: PayloadAction<{ id: string }>) => {
            state.categoriesData = state.categoriesData.filter(c => c.id !== action.payload.id);

            axios.delete(`${db_route}/api/categories/${action.payload.id}`, {
                headers: { 
                    'Content-Type': 'application/json'
                }
            });
        },
        updateCategory: (state: CategoriesState, action: PayloadAction<CategoriesState["categoriesData"][number]>) => {
            const idx = state.categoriesData.findIndex(c => c.id === action.payload.id);
            if (idx !== -1) {
                state.categoriesData[idx] = action.payload;
            }

            axios.put(`${db_route}/api/categories/${action.payload.id}`, JSON.stringify(action.payload), {
                headers: { 
                    'Content-Type': 'application/json'
                }, 
            });
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetching categories
            .addCase(fetchCategories.pending, (state) => {
                state.status = StatusType.PENDING;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state: CategoriesState, action: { payload: Category[] }) => {
                state.status = StatusType.SUCCEEDED;
                state.categoriesData = [...state.categoriesData, ...action.payload];
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = StatusType.FAILED;
                state.error = action.error.message ?? 'Failed to fetch categories';
            })
            // Creating category
            // When creating, have a temporary category until confirmed by server
            .addCase(createCategory.pending, (state, action) => {
                const { name, description, color, icon } = action.meta.arg as { name: string; description: string; color: string; icon?: string };

                // Creates a temporary category while we wait for a response from the server
                const temp: Category = {
                    id: `temp-${action.meta.requestId}`,
                    name,
                    description,
                    color,
                    icon,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                state.categoriesData.push(temp);
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                const real = action.payload;
                // shared temp id from the pending case
                const tempId = `temp-${action.meta.requestId}`;
                const idx = state.categoriesData.findIndex(c => c.id === tempId);

                if (idx !== -1) {
                    state.categoriesData[idx] = real;
                } else {
                    state.categoriesData.push(real);
                }
            })
            .addCase(createCategory.rejected, (state, action) => {
                const tempId = `temp-${action.meta.requestId}`;
                state.categoriesData = state.categoriesData.filter(c => c.id !== tempId);
                state.error = typeof action.payload === 'string' ? action.payload : (action.error.message ?? 'Failed to create category');
            });
    },
})

export const { deleteCategory, updateCategory } = categoriesSlice.actions

export const selectCategories = (state: RootState) => state.categories.categoriesData
export const selectCategoriesStatus = (state: RootState) => state.categories.status
export const selectCategoriesError = (state: RootState) => state.categories.error

export default categoriesSlice.reducer