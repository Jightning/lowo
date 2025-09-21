import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState, createAppAsyncThunk } from '@/lib/store'
import { CategoriesState } from '@/types'

// Define the initial state using that type
const initialState: CategoriesState = {
    categoriesData: [
        {
            id: 'c1',
            name: 'General',
            color: '#06b6d4',
            icon: 'globe'
        },
        {
            id: 'c2',
            name: 'Docs',
            color: '#f59e0b',
            icon: 'book'
        },
        {
            id: 'c3',
            name: 'Assets',
            color: '#ef4444',
            icon: 'image'
        }
    ],
    status: 'idle',
    error: null
}

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: (state: CategoriesState, action: PayloadAction<CategoriesState["categoriesData"][number]>) => {
            state.categoriesData.push(action.payload);
        }
    }
})

export const { addCategory } = categoriesSlice.actions

export const selectCategories = (state: RootState) => state.categories.categoriesData

export default categoriesSlice.reducer