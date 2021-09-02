import {apiRequest} from "../actionsCreators/apiActionCreator";
import {createSlice} from "@reduxjs/toolkit";

const espaceSlice = createSlice({
    name: 'espace',
    initialState: {
        list: [],
        loading: false,
        error: null
    },
    reducers: {
        espaceRequested: (state) => {
            state.loading = true
            state.error = null
        },
        espaceRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        espaceCreated: (state, action) => {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(espace => espace.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else {
                const currentList =  state.list
                currentList.push(action.payload)
                state.list = currentList
            }
        },
        espaceReceived: (state, action) => {
            state.loading = false
            state.error = null
            const newList = action.payload
            state.list = newList
        },
        espaceDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list.filter(espace => espace.id !== action.payload.espaceId)
            state.list = newList
        }
    }
})

export default espaceSlice.reducer
const {espaceCreated, espaceReceived, espaceRequested, espaceRequestFailed, espaceDeleted} = espaceSlice.actions

const url = '/espaces'

export const addNewEspace = (data) => apiRequest({
    url,
    method:'post',
    data,
    onStart: espaceRequested.type,
    onSuccess: espaceCreated.type,
    onError: espaceRequestFailed.type
})

export const getAllEspaces = () => apiRequest({
    url,
    method: 'get',
    onStart: espaceRequested.type,
    onSuccess: espaceReceived.type,
    onError: espaceRequestFailed.type

})

export const deleteOneEspace = (data) => apiRequest({
    url:url+'/deleteOne',
    method: 'delete',
    data,
    onStart: espaceRequested.type,
    onSuccess: espaceDeleted.type,
    onError: espaceRequestFailed.type

})