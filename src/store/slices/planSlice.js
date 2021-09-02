import {createSlice} from "@reduxjs/toolkit";


import {apiRequest} from "../actionsCreators/apiActionCreator";

const planSlice = createSlice({
    name: 'plan',
    initialState: {
        loadingPlan: false,
        error: null,
        list: [],
        plansPayement:[],
    },
    reducers: {
        planRequested: (state, action)=> {
            state.loadingPlan = true
        },
        planReceived: (state,action)=> {
           state.list = action.payload
           state.loadingPlan = false
        },
        planRequestfailed: (state, action)=> {
            state.loadingPlan = false
            state.error = action.payload
        },
        planAdded: (state, action) => {
            state.loadingPlan = false
            const addedIndex = state.list.findIndex(item => item.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else {
            state.list.push(action.payload)
            }
        },
        planDeleted: (state, action) => {
            state.error = null
            state.loading = false
            const deletedIndex = state.list.findIndex(plan => plan.id === action.payload.planId)
            if(deletedIndex !== -1) {
                const newList  = state.list.filter(item => item.id !== action.payload.planId)
                state.list = newList
            }
        }
    }
})

export default planSlice.reducer
const {planAdded,planReceived, planRequested, planRequestfailed, planDeleted} = planSlice.actions

//actions creators

const url = '/plans'

export const loadPlans = () => apiRequest({
    url,
    method:'get',
    onStart: planRequested.type,
    onSuccess: planReceived.type,
    onError: planRequestfailed.type
})


export const addPlan = (plan) => apiRequest({
    url,
    method: 'post',
    data: plan,
    onStart: planRequested.type,
    onSuccess: planAdded.type,
    onError: planRequestfailed.type
});


export const deleteOnePlan = (data) => apiRequest({
    url: url+'/deleteOne',
    method: 'delete',
    data: data,
    onStart: planRequested.type,
    onSuccess: planDeleted.type,
    onError: planRequestfailed.type
});
