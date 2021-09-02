import React, { useState} from 'react';
import {useDispatch, useStore,useSelector} from "react-redux";
import {ScrollView, Alert} from "react-native"
import * as Yup from 'yup'

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addService} from '../store/slices/serviceSlice'
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormSwitch from "../components/forms/AppFormSwitch";
import FormImageListPicker from "../components/forms/FormImageListPicker";
import useDirectUpload from "../hooks/useDirectUpload";
import AppUploadProgress from "../components/AppUploadProgress";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";

const serviceValideSchema = Yup.object().shape({
    libelle: Yup.string(),
    description: Yup.string(),
    montantMin: Yup.number(),
    montantMax: Yup.number(),
    images: Yup.array().min(1, "Veuillez choisir au moins une image"),
    isDispo: Yup.boolean(),
    categorie: Yup.string()
})

function NewServiceScreen({navigation, route}) {
    const selectedService = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {dataTransformer, directUpload} = useDirectUpload()

    const categories = useSelector(state => {
        const list = state.entities.categorie.list
        const serviceList = list.filter(item => item.typeCateg === 'service')
        return serviceList
    })
    const [selectedCategorie, setSelectedCategorie] = useState(categories[0]?.id)
    const loading = useSelector(state => state.entities.service.loading)
    const [serviceUploadProgress, setServiceUploadProgress] = useState(0)
    const [serviceUploadModal, setServiceUploadModal] = useState(false)


    const addNewService = async (service, urlsArray) => {

        const serviceData = {
            serviceId: selectedService?selectedService.id: null,
            categoryId: selectedCategorie,
            libelle: service.libelle,
            description: service.description,
            montantMin: service.montantMin,
            montantMax: service.montantMax,
            serviceImagesLinks: urlsArray,
            isDispo:service.isDispo
        }
        await dispatch(addService(serviceData))
    }

    const handleNewService = async (service) => {
        const serviceImages = service.images
        let signedUrls = selectedService?selectedService.imagesService: []
        if(serviceImages[0].base64Data) {
            const transformArray = dataTransformer(serviceImages)
            setServiceUploadProgress(0)
            setServiceUploadModal(true)
            const uploadResult = await directUpload(transformArray, serviceImages, (progress) => setServiceUploadProgress(progress))
            setServiceUploadModal(false)
            if(uploadResult) {
                const signedData = store.getState().s3_upload.signedRequestArray
                signedUrls = signedData.map(item => item.url)
            } else {
                Alert.alert("Alert", "Les images n'ont pas été chargées, voulez-vous continuer?",
                    [{text: 'oui', onPress: async() => {
                        await addNewService(service, signedUrls)
                        }},
                        {text: 'non', onPress: () => {return;}}])
            }
        }
        await addNewService(service, signedUrls)
        const error = store.getState().entities.service.error
        if(error !== null) {
            alert("Impossible de faire l'ajout, une erreur est apparue.")
        }else {
            alert('Service ajouté')
            navigation.goBack()
        }
    }

    const handleChangeCategorie = (categorie) => {
        const currentCateg = categories.find(categ => categ.libelleCateg.toLowerCase() === categorie.toLowerCase())
        setSelectedCategorie(currentCateg.id)
    }

    return (
        <>
        <AppActivityIndicator visible={loading}/>
        <AppUploadProgress startProgress={serviceUploadModal} progress={serviceUploadProgress}/>
        <ScrollView>
            <AppForm initialValues={{
                libelle:selectedService?selectedService.libelle : '',
                description:selectedService?selectedService.description : '',
                montantMin:selectedService?String(selectedService.montantMin) : '',
                montantMax:selectedService?String(selectedService.montantMax) : '',
                images:selectedService?selectedService.imagesService : [],
                isDispo:selectedService?selectedService.isDispo : false,
                categorie: selectedService?selectedService.Categorie.libelleCateg : categories[0]?.libelleCateg
            }} validationSchema={serviceValideSchema} onSubmit={handleNewService}>
                <AppFormItemPicker
                    handleSelectedValue={handleChangeCategorie}
                    name='categorie'
                    label='Categorie :'
                    items={categories.map(item => item.libelleCateg)}/>
                <FormImageListPicker name='images'/>
                <AppFormField name='libelle' title='Libelle'/>
                <AppFormField name='description' title='Description'/>
                <AppFormField name='montantMin' title='Montant minimum'/>
                <AppFormField name='montantMax' title='Montant Maximum'/>
                <AppFormSwitch title='Service disponible? ' name='isDispo'/>
                <AppSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
       </>
    );
}

export default NewServiceScreen;