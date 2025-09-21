import { configureStore, createAsyncThunk } from '@reduxjs/toolkit'
import snippetsReducer from './features/SnippetsSlice'
import categoriesReducer from './features/CategoriesSlice'

export const makeStore = () => {
	return configureStore({
		reducer: {
			snippets: snippetsReducer,
			categories: categoriesReducer
		},
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  	state: RootState
  	dispatch: AppDispatch
}>()