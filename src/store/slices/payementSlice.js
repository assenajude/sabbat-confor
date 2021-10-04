import {createSlice} from '@reduxjs/toolkit';

import {apiRequest} from '../actionsCreators/apiActionCreator'

const payementSlice = createSlice({
    name: 'payement',
    initialState: {
        list: [],
        loading: false,
        error: null,
        payementId: 1,
        selectedPayement: {},
        payementPlans: [],
        selectedPlan: {},
        currentPlan: {},
        userCashback: 0
    },
    reducers: {
        payementRequested: (state,action)=> {
            state.loading = true
        },
        getPayements: (state, action) => {
            state.loading = false
            state.list = action.payload
        },
        payementRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        payementAdded: (state, action) => {
           state.loading = false
            state.error = null
            const addedIndex = state.list.findIndex(pay => pay.id === action.payload.id)
            if(addedIndex !== -1) {
                state.list[addedIndex] = action.payload
            }else state.list.push(action.payload)
        },
        selectPlan: (state, action) => {
            let selectedPlan = state.payementPlans.find(plan => plan.id === action.payload.id);
            selectedPlan.checked = !selectedPlan.checked
            state.currentPlan = selectedPlan.checked?selectedPlan:{}
            const otherPlans = state.payementPlans.filter(plan => plan.id !== selectedPlan.id);
            otherPlans.forEach(plan => {
                plan.checked = false
            })
            if(selectedPlan.libelle.toLowerCase() === 'cashprime') {
                state.userCashback = action.payload.cashback
            }
        },
        activePayement: (state, action) => {
          let selectedPayement = state.list.find(item => item.id === action.payload)
            if(selectedPayement) {
                state.selectedPayement = selectedPayement
                state.currentPlan = {}
                selectedPayement.active = true
                const plansOfPayement = selectedPayement.Plans
                plansOfPayement.sort((a, b) => {
                    if(b.nombreMensualite < a.nombreMensualite ) return 1
                    if (b.nombreMensualite > a.nombreMensualite) return -1
                    return 0;
                })
                state.payementPlans = plansOfPayement
                const otherPayements = state.list.filter(item => item.id !== action.payload)
                otherPayements.forEach(item => item.active = false)
            }
        },
        disablePayement: (state, action)=> {
          let selectedPayement = state.list.find(item => item.id === action.payload)
            selectedPayement.isDisabled = true

        },
        resetPayement: (state) => {
            state.list[0].active = true
            const otherPayements = state.list.filter(item => item.id !== state.list[0].id)
            otherPayements.forEach(item => item.active = false)
             state.payementPlans.forEach(item => item.checked = false)
            state.currentPlan = {}
        },
        showPlanDetail: (state, action) => {
            let selectedPlan = state.payementPlans.find(plan => plan.id === action.payload)
            selectedPlan.showPlanDetail = !selectedPlan.showPlanDetail
            const otherPlans = state.payementPlans.filter(plan =>  plan.id !== action.payload)
            otherPlans.forEach(plan => plan.showPlanDetail = false)
        },
        showCurrentPlanDetail: (state) => {
            state.currentPlan.CurrentPlanDetail = !state.currentPlan.CurrentPlanDetail
        },
        payementDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newList = state.list.filter(item => item.id !== action.payload.payementId)
            state.list = newList
        }
    }
});

export default payementSlice.reducer;

 const {getPayements, resetPayement, payementAdded,
     payementRequested, payementRequestFailed,
      selectPlan, activePayement, disablePayement,
     showPlanDetail, showCurrentPlanDetail, payementDeleted} = payementSlice.actions;


// actions creators
const url = '/payements'

export const loadPayements = () => apiRequest({
   url,
    method: 'get',
    onStart:payementRequested.type ,
    onSuccess: getPayements.type,
    onError: payementRequestFailed.type
})

export const createPayement = (payement) => apiRequest({
    url,
    method: 'post',
    data: payement,
    onStart: payementRequested.type,
    onSuccess: payementAdded.type,
    onError: payementRequestFailed.type
})

export const deleteOnePayement = (data) => apiRequest({
    url: url+'/deleteOne',
    method: 'delete',
    data,
    onStart: payementRequested.type,
    onSuccess: payementDeleted.type,
    onError: payementRequestFailed.type
})

export const getSelectedPlan = (plan) => dispatch => {
    dispatch(selectPlan(plan))
}

export const getResetPayement = () => dispatch => {
    dispatch(resetPayement())
}
// selectors

export const getPayementActive = (payementId) => dispatch => {
    dispatch(activePayement(payementId))
}

export const getPayementDisabled = (payementId) => dispatch => {
    dispatch(disablePayement(payementId))
}

export const getPlanDetail = (planId) => dispatch => {
    dispatch(showPlanDetail(planId))
}

export const getCurrentPlanDetail = () => dispatch => {
    dispatch(showCurrentPlanDetail())
}