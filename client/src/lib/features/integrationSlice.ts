import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/store'
import { IntegrationState } from '@/types'

// Define the initial state using that type
const initialState: IntegrationState = {
    integrationsData: [{
        name: 'Canvas LMS',
        id: 'canvas_lms', 
        color: '#E04A3F',
        connected: true
    }, {
        name: 'Brightspace',
        id: 'brightspace',
        color: '#000000',
        connected: false
    }, {
        name: 'Google Classroom',
        id: 'google-classroom',
        color: '#0F0',
        connected: true
    }]
}

export const integrationsSlice = createSlice({
    name: 'integrations',
    initialState,
    reducers: {
        addIntegration: (state: IntegrationState, action: PayloadAction<IntegrationState["integrationsData"][number]>) => {
            state.integrationsData.push(action.payload);
        }
    }
})

export const { addIntegration } = integrationsSlice.actions

export const selectIntegrations = (state: RootState) => state.integrations.integrationsData

export default integrationsSlice.reducer