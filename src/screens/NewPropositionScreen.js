import React, {useEffect, useState} from 'react';
import {ScrollView, View, Alert} from "react-native";
import * as Yup from 'yup'
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import FormImageListPicker from "../components/forms/FormImageListPicker";
import {
    addNewProposition,
    getPropositionEdit,
    getSelectedPropositionReset
} from "../store/slices/propositionSlice";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormSwitch from "../components/forms/AppFormSwitch";
import AppFormOption from "../components/forms/AppFormOption";
import useAuth from "../hooks/useAuth";
import useDirectUpload from "../hooks/useDirectUpload";
import AppUploadProgress from "../components/AppUploadProgress";

const propositionValidSchema = Yup.object().shape({
    images: Yup.array().min(1, 'Vous devez choisir au moins une image'),
    descriptionList: Yup.array(),
    designation:Yup.string()
})

function NewPropositionScreen({navigation, route}) {
    const mode = route.params.mode
    const dispatch = useDispatch()
    const store = useStore()
    const {userRoleAdmin} = useAuth()
    const {dataTransformer, directUpload} = useDirectUpload()

    const selected = useSelector(state => state.entities.proposition.selected)
    const isLoading = useSelector(state => state.entities.proposition.loading)
    const [propUploadProgress, setPropUploadProgress] = useState(0)
    const [propUploadModal, setPropUploadModal] = useState(false)

    const saveProposition = async (proposition, propImagesUrls) => {
        let formData = {
            designation: proposition.designation,
            propImagesLinks: propImagesUrls,
            type: proposition.type,
            idReference: proposition.idReference,
            isOk: proposition.isOk
        }

        const optionsList = proposition.descriptionList
        optionsList.forEach(proposition => {
            formData[proposition.label] = proposition.value
        })
        if(mode === 'add'){
            await dispatch(addNewProposition(formData))
        } else {
            const data = {...formData, id: selected.id}
            await dispatch(getPropositionEdit(data))
        }
        const error = store.getState().entities.proposition.error
        if(error !== null) {
            return   alert('Impossible de faire lajout, une erreur est apparue.')
        } else {
            Alert.alert('Félicitation', 'Votre proposition a été envoyée et est en cours de traitement.',[
                {text:'ok', onPress: () => {return;}}
            ])
            return navigation.goBack()
        }
    }

    const handleSaveProposition = async (proposition) => {
        if(mode === 'edit') {
            const urlsArray = proposition.images.map(item => item.url)
          return await saveProposition(proposition, urlsArray)
        }
        const propImages = proposition.images
        const transformedData = dataTransformer(propImages)
        setPropUploadProgress(0)
        setPropUploadModal(true)
        const propUloadSuccess = await directUpload(transformedData, propImages, (progress) => setPropUploadProgress(progress))
        setPropUploadModal(false)
        if(propUloadSuccess) {
            const imagesData= store.getState().s3_upload.signedRequestArray
            const imagesUrls = imagesData.map(item => item.url)
            await saveProposition(proposition, imagesUrls)
        } else {
            Alert.alert("Alert", "Des images n'ont pas été chargées, voulez-vous continuer quand meme?",
                [{text: 'oui', onPress: async() => await saveProposition(proposition, [])},
                    {text: 'non', onPress: ()=>{return;}}])
        }
    }


    useEffect(()=> {
        return () => {
            dispatch(getSelectedPropositionReset())
        }
    }, [])



    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <AppUploadProgress startProgress={propUploadModal} progress={propUploadProgress} dismissUploadModal={() => setPropUploadModal(false)}/>
        <ScrollView>
            <View style={{margin: 10}}>
           <AppForm validationSchema={propositionValidSchema} initialValues={{
               designation: selected.designation,
               descriptionList: selected.description || [],
               images: selected.images || [],
               type: selected.type || '',
               idReference: String(selected.idReference) || '',
               isOk: selected.isOk

           }} onSubmit={handleSaveProposition}>
               <FormImageListPicker name='images'/>
               <AppFormField name='designation' title='Nom de votre produit'/>
               <AppFormOption name='descriptionList' />
               {userRoleAdmin() && mode==='edit' && <AppFormSwitch name='isOk' title='is Ok?'/>}
               {userRoleAdmin() && mode==='edit' && <AppFormField name='idReference' title='Id de la reference'/>}
               {userRoleAdmin() && mode==='edit' && <AppFormField name='type' title='Type de la proposition'/>}
               <AppSubmitButton title='Proposer'/>
           </AppForm>

            </View>
        </ScrollView>
        </>
    );
}

export default NewPropositionScreen;