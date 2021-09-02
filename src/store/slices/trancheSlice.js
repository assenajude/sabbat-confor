import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const trancheSlice = createSlice({
    name: 'tranche',
    initialState: {
      list: [],
      newAdded: {},
        newPayed: {},
      loading: false,
      error: null
    },
    reducers: {
        trancheRequested: (state, action) => {
            state.loading = true
            state.error = null
        },
        trancheAdded: (state, action) => {
            state.loading = false
            state.error = null
            state.list.push(action.payload)
            state.newAdded = action.payload

        },
        trancheRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        trancheReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.list = action.payload
        },
        payTranche: (state, action) => {
            state.loading = false
            state.error = null
            const trancheIndex = state.list.findIndex(tranche => tranche.id === action.payload.id)
             state.list[trancheIndex] = action.payload
        },
        showDetials: (state, action) => {
            let selectedTranche = state.list.find(item => item.id === action.payload.item.id)
            if(selectedTranche){
                if(action.payload.label === 'showDetail') selectedTranche.showDetails = !selectedTranche.showDetails
                else selectedTranche.payingTranche = !selectedTranche.payingTranche
            }
        }
    }
})


export default trancheSlice.reducer
const {trancheAdded, trancheReceived, trancheRequested, trancheRequestFailed, payTranche, showDetials} = trancheSlice.actions

// actions creator
const url = '/tranches';
const updateUrl = '/tranches/update'
export const addTranche = (tranche) => apiRequest({
    url,
    method: 'post',
    data: tranche,
    onStart: trancheRequested.type,
    onSuccess: trancheAdded.type,
    onError: trancheRequestFailed.type

})

export const getTranches = () => apiRequest({
    url,
    method: 'get',
    onStart: trancheRequested.type,
    onSuccess: trancheReceived.type,
    onError: trancheRequestFailed.type
})

export const getTranchePayed = (tranche) =>apiRequest({
    url:updateUrl,
    method: 'patch',
    data: tranche,
    onStart: trancheRequested.type,
    onSuccess: payTranche.type,
    onError: trancheRequestFailed.type
})

export const showTrancheDetails = (tranche) => dispatch => {
    dispatch(showDetials(tranche))
}