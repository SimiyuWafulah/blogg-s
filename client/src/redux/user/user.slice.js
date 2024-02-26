import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading: false,
    error: null,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        signInStart : (state) => {
            state.loading = true
            state.error = null
        },
        signInSuccess : (state, action) => {
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        }, 
        signInFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        updateUserStart : (state) => {
            state.loading = true
            state.error = null
        },
        updateUserSuccess : (state, action) => {
            state.currentUser =action.payload
            state.loading = false
            state.error = null
        },
        updateUserFailure : (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        deleteUserStart : (state) => {
            state.loading =true
            state.error = null
        },
        deleteUserSuccess : (state, action) => {
            state.currentUser = null
            state.loading = false
            state.error = null
        },
        deleteUserFailure : (action, state) => {
            state.loading = false
            state.error = action.payload
        },
        signOutSuccess : (state, action) => {
            state.currentUser = null
            state.loading =false
            state.error = null
        },
    }
});

export const {
    signInStart,
    signInSuccess,
    signInFailure, 
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
     deleteUserFailure,
     deleteUserStart,
     deleteUserSuccess,
     signOutSuccess,
    } = userSlice.actions;

export default userSlice.reducer;

