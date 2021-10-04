import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";


const regionSlice = createSlice({
    name: 'region',
    initialState: {
        list: [],
        loading: false,
        error: '',
        regionVilles: [],
    },
    reducers: {
        regionRequested: (state, action) => {
            state.loading = true
        },
        regionReceived: (state, action) => {
            state.loading = false;
            state.list = action.payload
        },
        regionRequestFailed: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        regionAdded: (state, action) => {
           state.loading = false
            let newList = state.list
            const addedIndex = newList.findIndex(item => item.id  === action.payload.id)
            if(addedIndex !== -1) {
                newList[addedIndex] = action.payload
            }else{
             newList.push(action.payload)
            }
            state.list = newList
        },
        regionDeleted: (state, action)=> {
           state.loading = false
            const newList = state.list.filter(item => item.id !== action.payload.regionId)
            state.list = newList
        }
    }
})

export default regionSlice.reducer;

const {regionReceived, regionRequested, regionRequestFailed, regionAdded, regionDeleted} = regionSlice.actions

const url = '/regions'

export const addRegion = (region) => apiRequest({
  url,
    method: 'post',
    data: region,
    onStart: regionRequested.type,
    onSuccess: regionAdded.type,
    onError: regionRequestFailed.type
});

export const getRegions = () => apiRequest({
    url,
    method: 'get',
    onStart:regionRequested.type,
    onSuccess: regionReceived.type,
    onError: regionRequestFailed.type
});

export const deleteOneRegion = (data) => apiRequest({
    url:url+'/deleteOne',
    method: 'delete',
    data,
    onStart:regionRequested.type,
    onSuccess: regionDeleted.type,
    onError: regionRequestFailed.type
});