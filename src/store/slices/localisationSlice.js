import {apiRequest} from "../actionsCreators/apiActionCreator";
import {createSlice} from "@reduxjs/toolkit";

const localisationSlice = createSlice({
    name: 'localisation',
    initialState: {
        loading: false,
        error: null,
        list: [],
        selectedLocalisation: null
    },
    reducers: {
        localisationRequested: (state) => {
            state.loading = true
            state.error = null
        },
        localisationReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.list = action.payload
        },
        localisationAdded: (state, action) => {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(item => item.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else {
                state.list.push(action.payload)
            }
        },
        localisationRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload.message
        },
        localisationDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const deletedIndex = state.list.findIndex(item => item.id === action.payload.localisationId)
            if(deletedIndex !== -1) {
                const newList = state.list.filter(item => item.id !== action.payload.localisationId)
                state.list = newList
            }
        },
        localisationSelected: (state, action) => {
            let selectedItem = state.list.find(item => item.id === action.payload.id)
            if(action.payload.selected) {
                state.selectedLocalisation = {}
                selectedItem.selected = false
            }else {
                state.selectedLocalisation = action.payload
                selectedItem.selected = true
            }
            const otherLocalisation = state.list.filter(item => item.id !== action.payload.id)
            otherLocalisation.forEach(item => item.selected = false)
        }
    }
})

export default localisationSlice.reducer
const {localisationAdded, localisationReceived, localisationDeleted,
    localisationRequested, localisationRequestFailed, localisationSelected} = localisationSlice.actions


const url = '/localisations'
export const addLocalisation = (data) => apiRequest({
    method: 'post',
    url,
    data,
    onStart: localisationRequested.type,
    onSuccess: localisationAdded.type,
    onError: localisationRequestFailed.type
})

export const getLocalisations = () => apiRequest({
    method: 'get',
    url,
    onStart: localisationRequested.type,
    onSuccess: localisationReceived.type,
    onError: localisationRequestFailed.type
})

export const deleteLocalisation = (data) => apiRequest({
    method: 'delete',
    url: url+'/deleteOne',
    data,
    onStart: localisationRequested.type,
    onSuccess: localisationDeleted.type,
    onError: localisationRequestFailed.type
})

export const selectLocalisation = (localisation) => dispatch => {
    dispatch(localisationSelected(localisation))
}