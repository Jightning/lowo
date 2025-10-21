import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/lib/store'
import { CategoriesState, Category, StatusType } from '@/types'
import axios from 'axios';
import { nullCategory } from '../definitions';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

// Define the initial state using that type
const initialState: CategoriesState = {
    categoriesData: [nullCategory],
    status: StatusType.IDLE,
    error: null
}

let token: string | null; // no longer required for API calls when using cookie auth

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

            axios.post(`${db_route}/api/categories`, JSON.stringify(action.payload), {
                headers: { 
                    'Content-Type': 'application/json'
                },
            })
        },
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
            });
    },
})

export const { addCategory, deleteCategory, updateCategory } = categoriesSlice.actions

export const selectCategories = (state: RootState) => state.categories.categoriesData
export const selectCategoriesStatus = (state: RootState) => state.categories.status
export const selectCategoriesError = (state: RootState) => state.categories.error

export default categoriesSlice.reducer