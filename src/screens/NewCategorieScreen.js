import React, {useState} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux'
import {ScrollView, View, StyleSheet} from 'react-native'

import AppForm from "../components/forms/AppForm";
import AppErrorMessage from "../components/forms/AppErrorMessage";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import * as Yup from "yup";
import {addCategorie} from '../store/slices/categorieSlice'
import FormImageListPicker from "../components/forms/FormImageListPicker";
import useDirectUpload from "../hooks/useDirectUpload";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppUploadProgress from "../components/AppUploadProgress";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";


const categorieSchema = Yup.object().shape({
    libelle: Yup.string(),
    description: Yup.string(),
    images: Yup.array(),
    espace: Yup.string()

})

function NewCategorieScreen({navigation, route}) {
    const selectedCateg = route.params
    const dispatch = useDispatch();
    const store = useStore()
    const {dataTransformer, directUpload} = useDirectUpload()
    const espaces = useSelector(state => state.entities.espace.list)
    const addFailed = useSelector(state => state.entities.categorie.error)
    const loading = useSelector(state => state.entities.categorie.loading)
    const [uploadModal, setUploadModal] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)

    const addNew = async (categorie, imagesTab) => {
        const selectedSpace = espaces.find(item => item.nom === categorie.espace)
        const categorieData = {
            categorieId: selectedCateg?.id,
            libelle: categorie.libelle,
            description: categorie.description,
            categImagesLinks: imagesTab,
            idEspace: selectedSpace?.id
        }
               await dispatch(addCategorie(categorieData))
               const error = store.getState().entities.categorie.error
               if(error !== null){
                   alert('Impossible de faire lajour')
               } else navigation.goBack()
    }

    const AddNewCategorie = async (categorie) => {
        const images = categorie.images
        let imagesUrls = selectedCateg?.imagesCateg?[selectedCateg.imagesCateg] : []
        if(images[0].base64Data) {
            const transformedArray = dataTransformer(images)
            setUploadProgress(0)
            setUploadModal(true)
            const uploadResult =  await directUpload(transformedArray, images, (progress) => {
                setUploadProgress(progress)
            })
            setUploadModal(false)
            if(uploadResult) {
                let signedUrl = store.getState().s3_upload.signedRequestArray
                 imagesUrls = signedUrl.map(item => item.url)
            }
        }
            await addNew(categorie, imagesUrls)
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
            <AppUploadProgress progress={uploadProgress} startProgress={uploadModal}/>
        <View style={styles.container}>
        <ScrollView>
            <AppForm initialValues={{
                libelle:selectedCateg?selectedCateg.libelleCateg :  '',
                description: selectedCateg?selectedCateg.descripCateg : '',
                images:selectedCateg?.imagesCateg?[selectedCateg.imagesCateg] : [],
                espace: selectedCateg?.Espace?selectedCateg.Espace.nom : espaces[0].nom
            }} validationSchema={categorieSchema} onSubmit={AddNewCategorie}>
                <AppErrorMessage error='Impossible de faire lajout' visible={addFailed}/>
                <AppFormItemPicker handleSelectedValue={() => null} name='espace' items={espaces.map(item => item.nom)} label='Espace'/>
                <FormImageListPicker name='images'/>
                <AppFormField title='Libellé' name='libelle'/>
                <AppFormField title='Description' name='description'/>
                <AppSubmitButton title='Ajouter' showLoading={loading}/>
            </AppForm>

        </ScrollView>
        </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 50
    }
})

export default NewCategorieScreen;