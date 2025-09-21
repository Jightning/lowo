import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, createAppAsyncThunk } from '@/lib/store'
import { CategoriesState } from '@/types'


// Define the initial state using that type
const initialState: CategoriesState = {
    categoriesData: [],
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