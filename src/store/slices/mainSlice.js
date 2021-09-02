import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        list: [],
        searchList: [],
        loading: false,
        error: null,
        homeCounter: 0,
        newOption: {},
        selectedItemOptions: [],
        selectedColorSizes: [],
        selectedOption: {}
    },
    reducers: {
        mainRequested: (state) =>{
            state.loading = true
        },
        mainRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        mainReceived: (state, action) => {
            state.loading = false
            state.error = null
            state.homeCounter = 0
            state.list = action.payload
            state.searchList = action.payload
        },

        incrementHomeCounter: (state) => {
            state.homeCounter+=1
        },
        optionAdded: (state, action) => {
            state.error = null
            state.loading = false
            state.newOption = action.payload
        },
        deleteItemSuccess: (state, action) => {
            state.loading = false
            state.error = null
            const selectedItem = action.payload
            const newList = state.list.filter(item => item.id !== selectedItem.id)
            const newSearchList = state.searchList.filter(item => item.id !== selectedItem.id)
            state.list = newList
            state.searchList = newSearchList

        },
        selectedOptions: (state, action) => {
            const selectedItemOptions = action.payload.ProductOptions
            const colorTab = selectedItemOptions.map(option => option.couleur)
            state.selectedItemOptions = [...new Set(colorTab)]
        },
        colorSize: (state, action) => {
            const selectedItem = action.payload.item
            const selectedOptions = selectedItem.ProductOptions
            const filteredOptions = selectedOptions.filter(opt => opt.couleur === action.payload.couleur)
            const optionsSizes = filteredOptions.map(opt => opt.taille)
            state.selectedColorSizes = optionsSizes
            state.selectedOption = {}
        },
        selectOption: (state, action) => {
            const selectedItem = action.payload.item
            const itemOptions = selectedItem.ProductOptions
            const selectedOption = itemOptions.find(opt => opt.couleur === action.payload.couleur && opt.taille === action.payload.taille)
            if(selectedItem.Categorie.typeCateg === 'location') {
               state.selectedOption = selectedOption.LocationOption
           } else {
            state.selectedOption = selectedOption.ArticleOption
           }
        }

    }
})

const {mainReceived, mainRequested, mainRequestFailed, incrementHomeCounter,
    colorSize, selectedOptions, optionAdded, selectOption,deleteItemSuccess} = mainSlice.actions
export default mainSlice.reducer

const url = '/mainDatas'
export const getAllMainData = () => apiRequest({
    url,
    method: 'get',
    onStart: mainRequested.type,
    onSuccess: mainReceived.type,
    onError: mainRequestFailed.type

})


export const getHomeCounterIncrement = () => dispatch => {
    dispatch(incrementHomeCounter())
}


export const addOption = (data) => apiRequest({
    url: '/options',
    data,
    method: 'post',
    onStart: mainRequested.type,
    onSuccess: optionAdded.type,
    onError: mainRequestFailed.type
})

export const getSelectedOptions = (data) => dispatch => {
    dispatch(selectedOptions(data))
}

export const getColorSizes = (data) => dispatch => {
    dispatch(colorSize(data))
}

export const getSelectOption = (data) => dispatch => {
    dispatch(selectOption(data))
}


export const getItemDeleted = (item) => apiRequest({
    url:url+'/delete',
    method: 'delete',
    data: item,
    onStart: mainRequested.type,
    onSuccess: deleteItemSuccess.type,
    onError: mainRequestFailed.type
})
