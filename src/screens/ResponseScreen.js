import React, {useEffect} from 'react';
import {ScrollView} from "react-native";
import * as Yup from 'yup'
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {useDispatch, useSelector, useStore} from "react-redux";
import {getResponseAdded} from "../store/slices/faqSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

const validResponse = Yup.object().shape({
    content: Yup.string()
})

function ResponseScreen({route, navigation}) {
    const store = useStore()
    const dispatch = useDispatch()
    const selectedQuestion = route.params
    const isLoading = useSelector(state => state.entities.faq.loading)

    const handleAddResponse = async (content) => {
        const data = {...content, questionId: selectedQuestion.id}
       await dispatch(getResponseAdded(data))
        const error = store.getState().entities.faq.error
        if(error !== null) {
            alert('Une erreur est apparue')
        } else {
            navigation.goBack()
        }

    }

    useEffect(()=> {
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView>
           <AppForm initialValues={{
               content: ''
           }} validationSchema={validResponse} onSubmit={handleAddResponse}>
               <AppFormField name='content' title='Reponse'/>
               <AppSubmitButton title='Ajouter la reponse'/>
           </AppForm>
        </ScrollView>
            </>
    );
}

export default ResponseScreen;