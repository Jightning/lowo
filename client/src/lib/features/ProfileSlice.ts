import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/lib/store'
import { Profile, ProfileState } from '@/types'
import axios from 'axios';


// Define the initial state using that type
const initialState: ProfileState = {
    profileData: [],
    status: 'idle',
    error: null
}

/**
 * Async thunk to fetch profiles from the API
 */
export const fetchProfiles = createAsyncThunk<
    Profile[],
    void,
    {
        state: RootState
        dispatch: AppDispatch
    }
>(
    'profile/fetchProfiles',
    async (_, thunkAPI) => {
        // 1. Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        
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
            const response = await axios.get<any[]>('http://3.141.114.4:5000/api/profiles', config);
            return response.data.map(p => ({
                id: p._id,
                user: p.user,
            }));
        } catch (error) {
            // Handle network or server errors
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch profiles.');
            }
            return thunkAPI.rejectWithValue('An unknown error occurred.');
        }
    }
);

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        addProfile: (state: ProfileState, action: PayloadAction<ProfileState["profileData"][number]>) => {
            state.profileData.push(action.payload);
        },
        deleteProfile: (state: ProfileState, action: PayloadAction<{ id: string }>) => {
            state.profileData = state.profileData.filter(c => c.id !== action.payload.id);
        },
        updateProfile: (state: ProfileState, action: PayloadAction<ProfileState["profileData"][number]>) => {
            const idx = state.profileData.findIndex(c => c.id === action.payload.id);
            if (idx !== -1) {
                state.profileData[idx] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfiles.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profileData = action.payload;
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch profiles';
            });
    },
})

export const { addProfile, deleteProfile, updateProfile } = profileSlice.actions

export const selectProfiles = (state: RootState) => state.profile.profileData
export const selectProfilesStatus = (state: RootState) => state.profile.status
export const selectProfilesError = (state: RootState) => state.profile.error

export default profileSlice.reducer
