import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState, AppDispatch } from '@/lib/store'
import { StatusType, User, UserState } from '@/types'
import axios from 'axios';
import { getToken } from '../session';

const db_route = process.env.NEXT_PUBLIC_DB_ROUTE

// Define the initial state using that type
const initialState: UserState = {
    userData: {
        id: 'test1', 
        user: 'test2',
    },
    isAuthenticated: false,
    status: StatusType.IDLE,
    error: null
}

/**
 * Async thunk to fetch user from the API
 */
export const fetchUser = createAsyncThunk<
    User,
    void,
    {
        state: RootState
        dispatch: AppDispatch
    }
>(
    'User/fetchUser',
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
            const response = await axios.get(`${db_route}/api/user`, config);
            return response.data
        } catch (error) {
            // Handle network or server errors
            if (axios.isAxiosError(error) && error.response) {
                return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to fetch user.');
            }
            return thunkAPI.rejectWithValue('An unknown error occurred.');
        }
    }
);

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser: (state: UserState, action: PayloadAction<UserState["userData"]>) => {
            state.userData = action.payload;
        },
        deleteUser: (state: UserState) => {
            state.userData = initialState["userData"]
        },
        updateUser: (state: UserState, action: PayloadAction<UserState["userData"]>) => {
            state.userData = action.payload;
        },
        setIsAuthenticated: (state: UserState, action: PayloadAction<UserState["isAuthenticated"]>) => {
            state.isAuthenticated = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchUser.pending, (state) => {
                state.status = StatusType.PENDING;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.status = StatusType.SUCCEEDED;
                state.isAuthenticated = true
                state.userData = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.status = StatusType.FAILED;
                state.isAuthenticated = false
                state.error = action.error.message ?? 'Failed to fetch user';
            });
    },
})

export const { addUser, deleteUser, updateUser, setIsAuthenticated } = userSlice.actions

export const selectUser = (state: RootState) => state.user.userData
export const selectUserStatus = (state: RootState) => state.user.status
export const selectUserError = (state: RootState) => state.user.error
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated

export default userSlice.reducer
