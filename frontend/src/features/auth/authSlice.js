import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from './authService'

//Get user token from localStorage. It will be used to check whether user is signed in
const user= JSON.parse(localStorage.getItem('user'))


const initialState= {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''  
}

//Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try {
        //send the user as the payload which can be accessed inside callback of '.addCase()' as action.payload
        return await authService.register(user)
    } catch (error) {
        const message= (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        //send the eror message as the payload which can be accessed inside callback of '.addCase()' as action.payload
        return thunkAPI.rejectWithValue(message)
    }
})

//Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try {
        //send the user as the payload which can be accessed inside callback of '.addCase()' as action.payload
        return await authService.login(user)
    } catch (error) {
        const message= (error.response && error.response.data && error.response.data.message) || error.message || error.toString()

        //send the eror message as the payload which can be accessed inside callback of '.addCase()' as action.payload
        return thunkAPI.rejectWithValue(message)
    }
})

//Logout user (here we delete the local storage created by register() function above)
export const logout = createAsyncThunk('auth/logout', async() => {
    await authService.logout()
})

// CREATE AN AUTH SLICE
export const authSlice= createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading= false
            state.isSuccess= false
            state.isError= false
            state.message= ''
        }
    },

    // extraReducers deal with asyncThunk functions i.e. functions that deal with async data (data from backend)
    extraReducers: (builder) => {
        builder

            //for auth/register
            .addCase(register.pending, (state) => {
                state.isLoading= true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading= false
                state.isSuccess= true
                state.user= action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading= false
                state.isError= true
                state.message= action.payload

                //user is also set to 'null' as this is a case of 'register.rejected' i.e. something went wrong during the register process
                state.user= null
            })

            //for auth/login
            .addCase(login.pending, (state) => {
                state.isLoading= true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading= false
                state.isSuccess= true
                state.user= action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading= false
                state.isError= true
                state.message= action.payload

                //user is also set to 'null' as this is a case of 'register.rejected' i.e. something went wrong during the register process
                state.user= null
            })

            //for auth/logout. On logout sucess, set state.user = null so that the conditional rendering on Header.jsx works perfectly 
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    }
})

export const { reset } = authSlice.actions
export default authSlice.reducer


