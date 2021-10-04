import React, {useEffect, useState} from 'react';
import {ScrollView} from "react-native";
import * as Yup from 'yup'
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {useDispatch, useSelector, useStore} from "react-redux";
import {askQuestion, getQuestionEdit} from "../store/slices/faqSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormSwitch from "../components/forms/AppFormSwitch";

const validQuestion = Yup.object().shape({
    libelle: Yup.string(),
    isValid: Yup.boolean()
})
function QuestionScreen({navigation, route}) {
    const selectedQuestion = route.params?route.params:{}
    const dispatch = useDispatch()
    const store = useStore()
    const isLoading = useSelector(state => state.entities.faq.loading)
    const [mode, setMode] = useState('addNew')
    const editingQuestion = Object.keys(selectedQuestion).length> 0
    useEffect(() => {
        if(editingQuestion) {
            setMode('edit')
        }
    }, [])

    const handleAskQuestion = async (question, {resetForm}) => {
        if(mode === 'addNew') {
        await dispatch(askQuestion(question))
        } else {
            await dispatch(getQuestionEdit({...question, id: selectedQuestion.id}))
        }
        const error = store.getState().entities.faq.error
        if(error !== null) {
            alert("une erreur est apparue")
        } else {
            resetForm()
            navigation.goBack()
        }
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView>
            <AppForm initialValues={{
                libelle:editingQuestion?selectedQuestion.libelle: '',
                isValid: editingQuestion.isValid
            }} validationSchema={validQuestion} onSubmit={handleAskQuestion}>
                <AppFormField title='Votre question' name='libelle'/>
                {mode === 'edit' && <AppFormSwitch name='isValid' title='Valider la Question?'/>}
                <AppSubmitButton style={{alignSelf: 'center'}} title='Poser votre question'/>
            </AppForm>
        </ScrollView>
            </>
    );
}

export default QuestionScreen;