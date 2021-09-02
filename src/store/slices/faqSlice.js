import {createSlice} from "@reduxjs/toolkit";
import {apiRequest} from "../actionsCreators/apiActionCreator";

const faqSlice = createSlice({
    name: 'faq',
    initialState: {
        questions: [],
        responses: [],
        loading: false,
        error: null,
        helpCompter: 0
    },
    reducers: {
        faqResquested: (state) => {
            state.loading = true
            state.error = null
        },
        faqRequestFailed: (state, action) => {
            state.loading = false
            state.error = action.payload
        },
        questionReceived: (state, action) => {
          state.loading = false
          state.error = null
          state.questions = action.payload
            state.helpCompter = 0
        },
        askQuestionSuccess: (state, action) => {
            state.loading = false
            state.error = null
            state.questions.push(action.payload)
            state.helpCompter ++
        },
        showQuestionResponse: (state, action) => {
            let selectedQuestion = state.questions.find(item => item.id === action.payload.id)
            selectedQuestion.showResponse = !selectedQuestion.showResponse
        },
        addResponse: (state, action) => {
            state.loading = false
            state.error = null
            state.responses = action.payload
            state.helpCompter++
            let selectedQuestion = state.questions.find(item => item.id === action.payload.QuestionId)
            const questionResponses = selectedQuestion.Responses
            questionResponses.push(action.payload)
            selectedQuestion.Responses = questionResponses
        },
        editQuestionSuccess: (state, action) => {
           state.loading = false
            state.error = null
            state.helpCompter++
            let selectedQuestion = state.questions.find(question => question.id === action.payload.id)
            selectedQuestion.libelle = action.payload.libelle
            selectedQuestion.isValid = action.payload.isValid
        },
        questionDeleted: (state, action) => {
            state.loading = false
            state.error = null
            const newQuestions = state.questions.filter(quest => quest.id !== action.payload.id)
            state.questions = newQuestions
        }
    }
})

export default faqSlice.reducer
const {faqResquested, askQuestionSuccess, faqRequestFailed, questionReceived,
    showQuestionResponse, addResponse, editQuestionSuccess, questionDeleted} = faqSlice.actions

const url = 'faq'

export const askQuestion = (question) => apiRequest({
    url: url+'/questions',
    method: 'post',
    data: question,
    onStart: faqResquested.type,
    onSuccess: askQuestionSuccess.type,
    onError: faqRequestFailed.type
})

export const getAllQuestions = () => apiRequest({
    url: url+'/questions',
    method: 'get',
    onStart: faqResquested.type,
    onSuccess: questionReceived.type,
    onError: faqRequestFailed.type
})

export const getResponseShow = (question) => dispatch => {
    dispatch(showQuestionResponse(question))
}

export const getResponseAdded = (data) => apiRequest({
    url: url+'/responses',
    method: 'post',
    data,
    onStart: faqResquested.type,
    onSuccess: addResponse.type,
    onError: faqRequestFailed.type
})

export const getQuestionEdit = (data) => apiRequest({
    url: url+'/questions/edit',
    data,
    method: 'patch',
    onStart: faqResquested.type,
    onSuccess: editQuestionSuccess.type,
    onError: faqRequestFailed.type
})

export const getQuestionDelete = (question) => apiRequest({
    url:url+'/delete',
    method: 'delete',
    data:question,
    onStart: faqResquested.type,
    onSuccess: questionDeleted.type,
    onError: faqRequestFailed.type
})