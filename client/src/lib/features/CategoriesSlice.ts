import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { CategoriesState } from '@/types'

// Define the initial state using that type
const initialState: CategoriesState = {
    categoriesData: [
        {
            id: 'c1',
            name: 'General',
            color: '#06b6d4',
            icon: 'globe',
            dateCreated: "2025-09-21T05:53:00.000Z",
            dateUpdated: "2025-09-21T05:53:00.000Z",
        },
        {
            id: 'c2',
            name: 'Docs',
            color: '#f59e0b',
            icon: 'book',
            dateCreated: "2025-09-21T05:53:00.000Z",
            dateUpdated: "2025-09-21T05:53:00.000Z",
        },
        {
            id: 'c3',
            name: 'Assets',
            color: '#ef4444',
            icon: 'image',
            dateCreated: "2025-09-21T05:53:00.000Z",
            dateUpdated: "2025-09-21T05:53:00.000Z",
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
        },
        deleteCategory: (state: CategoriesState, action: PayloadAction<{ id: string }>) => {
            state.categoriesData = state.categoriesData.filter(c => c.id !== action.payload.id);
        },
        updateCategory: (state: CategoriesState, action: PayloadAction<CategoriesState["categoriesData"][number]>) => {
            const idx = state.categoriesData.findIndex(c => c.id === action.payload.id);
            if (idx !== -1) {
                state.categoriesData[idx] = action.payload;
            }
        },
    }
})

export const { addCategory, deleteCategory, updateCategory } = categoriesSlice.actions

export const selectCategories = (state: RootState) => state.categories.categoriesData

export default categoriesSlice.reducer