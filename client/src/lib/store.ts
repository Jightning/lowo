import { configureStore } from '@reduxjs/toolkit'
import integrationsReducer from './features/integrationSlice'

export const makeStore = () => {
	return configureStore({
		reducer: {
			integrations: integrationsReducer,
		}
	})
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']