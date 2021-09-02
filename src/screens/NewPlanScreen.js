import React, {useState} from 'react';
import {ScrollView, Alert, ToastAndroid} from 'react-native'
import * as Yup from 'yup'
import {useDispatch, useSelector, useStore} from 'react-redux';

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addPlan} from '../store/slices/planSlice'
import FormImageListPicker from "../components/forms/FormImageListPicker";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useDirectUpload from "../hooks/useDirectUpload";
import AppUploadProgress from "../components/AppUploadProgress";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";


const planValideSchema = Yup.object().shape({
    libelle: Yup.string(),
    description: Yup.string(),
    mensualite: Yup.number(),
    compensation: Yup.number(),
    images: Yup.array(),
    payement: Yup.string()
})

function NewPlanScreen({navigation, route}) {
    const selectedPlan = route.params
    const dispatch = useDispatch();
    const store = useStore()
    const {dataTransformer, directUpload} = useDirectUpload()

    const listPayements = useSelector(state => state.entities.payement.list)
    const isLoading = useSelector(state => state.entities.plan.loadingPlan)
    const [payementId, setPayementId]  = useState(1);
    const [planUploadModal, setPlanUploadModal] = useState(false)
    const [planUploadProgress, setPlanUploadProgress] = useState(0)

    const newPlan = async (plan, planImagesUrls) => {
        const planData = {
            payementId,
            planId: selectedPlan?.id,
            libelle: plan.libelle,
            description: plan.description,
            mensualite: plan.mensualite,
            compensation: plan.compensation,
            planImagesLinks: planImagesUrls
        }
        await dispatch(addPlan(planData));
        const error = store.getState().entities.plan.error
        if(error !== null) {
            return alert('Impossible dajouter le plan, une erreur est apparue.')
        }else {
            ToastAndroid.showWithGravity("Plan ajouté avec succès", ToastAndroid.LONG, ToastAndroid.CENTER)
        }
        navigation.goBack();
    }

    const addNewPlan = async(plan) => {
        const planImages = plan.images
        let planUrls = selectedPlan?selectedPlan.imagesPlan : []
        if(planImages && planImages[0]?.base64Data) {
            const transformedData = dataTransformer(planImages)
            setPlanUploadProgress(0)
            setPlanUploadModal(true)
            const uploadResult = await directUpload(transformedData, planImages, (progress) => setPlanUploadProgress(progress))
            setPlanUploadModal(false)
            if(uploadResult){
                const imagesData = store.getState().s3_upload.signedRequestArray
                const urls = imagesData.map(item => item.url)
                planUrls = urls
            } else {
                Alert.alert("Alert", "Des images n'ont pas été chargées, voulez-vous continuer quand meme?",
                    [{text: 'oui', onPress: async () => {
                        await newPlan(plan, planUrls)
                            return;
                        }},
                        {text: 'non', onPress: () => {return;}}])
            }
        }

        await newPlan(plan, planUrls)

    };
    const handleChangePayement = (payement) => {
        const currentPayement = listPayements.find(item => item.mode.toLowerCase() === payement.toLowerCase())
        setPayementId(currentPayement.id)
    }
            return (
                <>
                    <AppActivityIndicator visible={isLoading}/>
                    <AppUploadProgress startProgress={planUploadModal} progress={planUploadProgress}/>
                    <ScrollView>
                        <AppForm initialValues={{
                            libelle:selectedPlan?selectedPlan.libelle : '',
                            description: selectedPlan?selectedPlan.descripPlan : '',
                            mensualite: selectedPlan?String(selectedPlan.nombreMensualite) : '',
                            compensation:selectedPlan?String(selectedPlan.compensation) : '',
                            images: selectedPlan?selectedPlan.imagesPlan : [],
                            payement: selectedPlan?selectedPlan?.Payement?.mode : listPayements[0]?.mode
                        }} validationSchema={planValideSchema} onSubmit={addNewPlan}>
                            <AppFormItemPicker
                                handleSelectedValue={handleChangePayement}
                                name='payement'
                                label='Mode Payement :'
                                items={listPayements.map(item => item.mode)}/>
                            <FormImageListPicker name='images'/>
                            <AppFormField title='Libelle' name='libelle'/>
                            <AppFormField title='Description' name='description'/>
                            <AppFormField title='Nombre de mensualité' name='mensualite'/>
                            <AppFormField title='Compensation' name='compensation'/>
                            <AppSubmitButton title='Ajouter'/>
                        </AppForm>
                    </ScrollView>
                </>
            )
}

export default NewPlanScreen;