import {createSlice} from '@reduxjs/toolkit'
import decode from 'jwt-decode'
import authStorage from '../persistStorage'
import {apiRequest} from "../actionsCreators/apiActionCreator";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: {},
        loading: false,
        isLoggedIn: false,
        error: null,
        success: false,
        pushNotificationToken: null,
        resetCode: null,
        allUsers : []
    },
    reducers:{
        authRequested: (state, action) => {
            state.loading = true;
            state.error = null
            state.isLoggedIn = false
        },
        authSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.loading = false;
           const newUser = decode(action.payload.accessToken)
            state.user = newUser;
        },
        registerSucccess: (state, action) => {
            state.loading = false;
            state.succcess = true
            state.error = null
        },
        authFailed: (state, action) => {
            state.loading = false;
            state.isLoggedIn = false;
            state.error = action.payload
        },
        logout: (state) =>{
                state.user = {}
                state.isLoggedIn = false
                state.loading = false
                state.error = null
        },
        changeAvatar: (state, action) => {
            state.user.avatar = action.payload.avatar
            state.loading = false
            state.error = null
        },
        resetLogin: (state) => {
            state.loading = false
            state.error = null
        },
        pieceUpdated: (state, action) => {
            state.error = null
            state.loading = false
            const pieceArray = action.payload
            state.user.pieceIdentite = pieceArray
        },
        paramsChanged: (state,action) => {
            state.loading = false
            state.error = null
            if(action.payload.randomCode) state.resetCode = action.payload.randomCode
        },
        allUsersReceived: (state,action) => {
            state.loading = false
            state.error = null
            state.allUsers = action.payload
        },
        userDetailsShown: (state, action) => {
            let selectedUser = state.allUsers.find(user => user.id === action.payload.id)
            if(selectedUser) selectedUser.showDetails = !selectedUser.showDetails
            const otherUsers = state.allUsers.filter(user => user.id !== action.payload.id)
            otherUsers.forEach(user => user.showDetails = false)
        }
    }
})

export default authSlice.reducer
const {authFailed, authRequested, authSuccess,logout, changeAvatar,
    registerSucccess, resetLogin, pieceUpdated, paramsChanged, allUsersReceived, userDetailsShown} = authSlice.actions


 //action creators

const signupUrl = '/auth/signup';
const loginUrl = '/auth/signin'
const autoUrl = '/auth/autoLogin'



export const signin = (user) => apiRequest({
    url: loginUrl,
    method: 'post',
    data: user,
    onStart: authRequested.type,
    onSuccess: authSuccess.type,
    onError: authFailed.type
})

export const register = (user) => apiRequest({
    url: signupUrl,
    method: 'post',
    data: user,
    onStart: authRequested.type,
    onSuccess: registerSucccess.type,
    onError: authFailed.type
})

export const autoLoginUser = (user) => apiRequest({
    url: autoUrl,
    method: 'post',
    data: user,
    onStart: authRequested.type,
    onSuccess: authSuccess.type,
    onError: authFailed.type
})

export const getLogout = () => dispatch => {
    dispatch(logout())
    authStorage.removeToken()
}
const avatarUrl = '/users/me'
export const getAvatarChange = (data) => apiRequest({
    url:avatarUrl+'/avatar',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: changeAvatar.type,
    onError: authFailed.type
})


export const getUserPieceUpdate = (data) =>apiRequest({
    url: avatarUrl+'/piece',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: pieceUpdated.type,
    onError: authFailed.type
})

export const getUserPassChanged = (data) =>apiRequest({
    url: avatarUrl+'/changePassWord',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: paramsChanged.type,
    onError: authFailed.type
})

export const getUserPassReset = (data) =>apiRequest({
    url:'/users/resetPassword',
    data,
    method: 'patch',
    onStart: authRequested.type,
    onSuccess: paramsChanged.type,
    onError: authFailed.type
})

export const getAllUsers = () =>apiRequest({
    url:'/users',
    method: 'get',
    onStart: authRequested.type,
    onSuccess: allUsersReceived.type,
    onError: authFailed.type
})

export const getLoginReset = () => dispatch => {
    dispatch(resetLogin())
}

export const getSelectedUserDetails = (user) => dispatch => {
    dispatch(userDetailsShown(user))
}

