import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const propositionSlice = createSlice({
    name: 'proposition',
    initialState: {
        list: [],
        loading: false,
        error: null,
        selected: {},
        newPropositionCompter: 0
    },
    reducers: {
        propositionRequested: (state) => {
            state.loading = true
            state.error = null
        },
        propositionReceived: (state, action) => {
            state.list = action.payload
            state.loading = false
            state.error = null
            state.newPropositionCompter = 0
        },
        propositionRequestFailed: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        propositionAdded: (state, action) => {
            state.list.push(action.payload)
            state.loading = false
            state.error = null
            state.newPropositionCompter++
        },
        propositionEdited: (state, action) => {
            state.error = null
            state.loading = false
            state.newPropositionCompter++
            const selectedItemIndex = state.list.findIndex(item => item.id === action.payload.id)
            state.list.splice(selectedItemIndex, 1, action.payload)
        },
        selectedProposition: (state, action) => {
              let currentSelected = {};
              const selectedProposition  = action.payload
            const imageArray = []
            const selectedImagePropArray = selectedProposition.imagesProposition
            selectedImagePropArray.forEach(item => {
                imageArray.push({url: item})
            })
            currentSelected.id = selectedProposition.id
            currentSelected.designation = selectedProposition.designation
            currentSelected.description = selectedProposition.description
            currentSelected.images = imageArray
            currentSelected.type = ''
            currentSelected.idReference = ''
            currentSelected.isOk = false
            state.selected = currentSelected
        },
        resetSelectedProposition:(state) => {
            state.selected = {}
        }

    }
})

export default propositionSlice.reducer
const {propositionAdded, propositionReceived, propositionRequestFailed, propositionRequested,
    propositionEdited, selectedProposition, resetSelectedProposition} = propositionSlice.actions

const url = '/propositions'
export const getAllPropositions = () => apiRequest({
    url,
    method: 'get',
    onStart: propositionRequested.type,
    onSuccess: propositionReceived.type,
    onError: propositionRequestFailed.type
})

export const addNewProposition = (data) => apiRequest({
    url,
    method:'post',
    data,
    onStart: propositionRequested.type,
    onSuccess: propositionAdded.type,
    onError: propositionRequestFailed.type
})

export const getPropositionEdit = (data) => apiRequest({
    url: url+'/update',
    data,
    method: 'patch',
    onStart: propositionRequested.type,
    onSuccess: propositionEdited.type,
    onError: propositionRequestFailed.type
})

export const getSelectedProposition = (proposition) => dispatch=> {
    dispatch(selectedProposition(proposition))
}

export const getSelectedPropositionReset = () => dispatch => {
    dispatch(resetSelectedProposition())
}