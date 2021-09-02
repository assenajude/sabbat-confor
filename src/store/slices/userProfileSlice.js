import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const profilSlice = createSlice({
    name: 'userProfile',
    initialState: {
       connectedUser: {},
        loading: false,
        error: null,
        avatar: null,
        notifCompter: 0,
    },
    reducers: {
        profileRequested: (state, action) => {
          state.loading = true
          state.error = null
        },
        profileRequestFailed: (state, action) => {
          state.loading = false
          state.error = action.payload
        },
        connectedUserData: (state, action) => {
            state.loading = false
            state.error = null
            state.connectedUser = action.payload
        },
        saveInfoEdit: (state, action) => {
            state.loading = false
            state.error = null
            state.connectedUser = action.payload
        },
        resetConnectedUser: (state) => {
            state.connectedUser = {}
            state.loading = false
            state.error = null
            state.avatar = null
            state.notifCompter = 0
        },
    }
})

export default profilSlice.reducer
const {connectedUserData, profileRequested,
    profileRequestFailed, saveInfoEdit, resetConnectedUser} = profilSlice.actions


const url = '/users/me'



export const getConnectedUserData = () => apiRequest({
    url,
    method: 'get',
    onStart: profileRequested.type,
    onSuccess: connectedUserData.type,
    onError: profileRequestFailed.type

})



export const getSaveEditInfo = (data) => apiRequest({
    url: url+'/update',
    data,
    method: 'patch',
    onStart: profileRequested.type,
    onSuccess: saveInfoEdit.type,
    onError: profileRequestFailed.type
})

export const getUserCompterReset = (data) => apiRequest({
    url:url+'/resetCompter',
    data,
    method: 'patch',
    onStart: profileRequested.type,
    onSuccess: saveInfoEdit.type,
    onError: profileRequestFailed.type
})

export const getConnectedUserReset = () => dispatch => {
    dispatch(resetConnectedUser())
}