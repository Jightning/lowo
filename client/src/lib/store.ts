import { configureStore } from '@reduxjs/toolkit'
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

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

// REMOVED `createAppAsyncThunk` export from this file