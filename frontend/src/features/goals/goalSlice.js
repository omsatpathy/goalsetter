import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from './goalService'

const initialState = {
    goals: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: ''
}

//Create goal
export const createGoal = createAsyncThunk('goals/create', async(goalData, thunkAPI) => {
    try {
        //getting token from 'auth/user' state. (Yes, user is not defiend here but using thunkAPI we can access any state from anywhere)
        const token = thunkAPI.getState().auth.user.token

        //as all goal routes are protected, we also pass the token
        return await goalService.createGoal(goalData, token)
    } catch (error) {
        const message= (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Get user goals
export const getGoals = createAsyncThunk('goals/getAll', async(_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await goalService.getGoals(token)
    } catch (error) {
        const message= (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Delete user goal
export const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await goalService.deleteGoal(id, token)
    } catch (error) {
        const message= (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const goalSice = createSlice({
    name: 'goals',
    initialState,
    reducers: {

        //as we also set state.goals = [] here
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder

        // creating goal
        .addCase(createGoal.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createGoal.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.goals.push(action.payload)
        })
        .addCase(createGoal.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.goals.push(action.payload) 
        })

        // getting user goals
        .addCase(getGoals.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getGoals.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.goals = action.payload
        })
        .addCase(getGoals.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })

        //deleting user goals
        .addCase(deleteGoal.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteGoal.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.goals = state.goals.filter((goal) => goal._id !== action.payload.id)
        })
        .addCase(deleteGoal.rejected, (state, action) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const { reset } = goalSice.actions
export default goalSice.reducer