import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/lib/store'
import { Profile, ProfileState } from '@/types'
import axios from 'axios';
import { getToken } from '../session';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

// Define the initial state using that type
const initialState: ProfileState = {
    profileData: {
        id: 'test1', 
        user: 'test2',
    },
    isAuthenticated: false,
    status: 'idle',
    error: null
}

/**
 * Async thunk to fetch profiles from the API
 */
export const fetchProfile = createAsyncThunk<
    Profile,
    void,
    {
        state: RootState
        dispatch: AppDispatch
    }
>(
    'profile/fetchProfile',
    async (_, thunkAPI) => {
        // 1. Retrieve the token from localStorage
        const token = await getToken()
        
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
            // const response = await axios.get<any[]>(`$[db_route}/api/profiles`, config);
            return {
                id: 'test',
                user: "test"
            }
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
        addProfile: (state: ProfileState, action: PayloadAction<ProfileState["profileData"]>) => {
            state.profileData = action.payload;
        },
        deleteProfile: (state: ProfileState) => {
            state.profileData = initialState["profileData"]
        },
        updateProfile: (state: ProfileState, action: PayloadAction<ProfileState["profileData"]>) => {
            state.profileData = action.payload;
        },
        setIsAuthenticated: (state: ProfileState, action: PayloadAction<ProfileState["isAuthenticated"]>) => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.profileData = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message ?? 'Failed to fetch profiles';
            });
    },
})

export const { addProfile, deleteProfile, updateProfile, setIsAuthenticated } = profileSlice.actions

export const selectProfile = (state: RootState) => state.profile.profileData
export const selectProfilesStatus = (state: RootState) => state.profile.status
export const selectProfilesError = (state: RootState) => state.profile.error
export const selectIsAuthenticated = (state: RootState) => state.profile.isAuthenticated

export default profileSlice.reducer
