import {createSlice} from '@reduxjs/toolkit'
import {apiRequest} from "../actionsCreators/apiActionCreator";

const relaisSlice = createSlice({
    name: 'pointRelais',
    initialState: {
        list: [],
        loading: false,
        selectedRelais: {},
        error: null
    },
    reducers: {
        relaisRequested: (state, action) => {
            state.loading = true
        },
        relaisReceived: (state, action) => {
            state.loading = false
            state.list = action.payload
        },
        relaisRequestFailded: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        relaisAdded: (state, action) => {
            state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(item => item.id === action.payload.id)
            let newPoints = state.list
            if(addedIndex !== -1) {
                newPoints[addedIndex] = action.payload
            }else {
                newPoints.push(action.payload)
            }
            state.list = newPoints
        },
        selectedRelais: (state, action) => {
           state.selectedRelais = state.list.find(relais => relais.nom === action.payload)
        },
        relaisDeleted: (state, action) => {
            state.loading = false
            const newList = state.list.filter(item => item.id !== action.payload.relaisId)
            state.list = newList
        }
    }

});


export default relaisSlice.reducer;
const {relaisAdded, relaisReceived, relaisRequested, relaisRequestFailded, relaisDeleted} = relaisSlice.actions;

const url = '/pointRelais'

export const loadRelais = () => apiRequest({
    url,
    method: 'get',
    onStart: relaisRequested.type,
    onSuccess: relaisReceived.type,
    onError: relaisRequestFailded.type
});

export const deleteOneRelais = (data) => apiRequest({
    url: url+'/deleteOne',
    method: 'delete',
    data,
    onStart: relaisRequested.type,
    onSuccess: relaisDeleted.type,
    onError: relaisRequestFailded.type
});


export const addRelais = (relais) => apiRequest({
    url,
    method: 'post',
    data: relais,
    onStart: relaisRequested.type,
    onSuccess: relaisAdded.type,
    onError: relaisRequestFailded.type
})



