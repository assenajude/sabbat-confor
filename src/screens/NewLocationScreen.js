import React, {useState} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
import {ScrollView, Alert, View, StyleSheet} from "react-native";
import * as Yup from 'yup'
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addLocation} from '../store/slices/locationSlice'
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppFormSwitch from "../components/forms/AppFormSwitch";
import {getHomeCounterIncrement} from "../store/slices/mainSlice";
import FormImageListPicker from "../components/forms/FormImageListPicker";
import useDirectUpload from "../hooks/useDirectUpload";
import AppUploadProgress from "../components/AppUploadProgress";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";
import routes from "../navigation/routes";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppButton from "../components/AppButton";

const locationValideSchema = Yup.object().shape({
    libelle: Yup.string(),
    description: Yup.string(),
    adresse: Yup.string(),
    coutReel: Yup.number(),
    coutPromo: Yup.number(),
    frequence: Yup.string(),
    images: Yup.array().min(1, "Veuillez choisir au moins une image"),
    caution: Yup.number(),
    dispo: Yup.number(),
    aide: Yup.boolean(),
    categorie: Yup.string()
})

function NewLocationScreen({navigation, route}) {
    const selectedLocation = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const {dataTransformer, directUpload} = useDirectUpload()
    const categories = useSelector(state => {
        const list = state.entities.categorie.list
        const locationList = list.filter(item => item.typeCateg === 'location')
        return locationList
    })
    const selectedLocalisation = useSelector(state => state.entities.localisation.selectedLocalisation)
    const isLoading = useSelector(state => state.entities.location.loading)
    const[selectedCategorie, setSelectedCategorie] = useState(categories[0]?.id)
    const [locationProgress, setLocationProgress] = useState(0)
    const [uploadModal, setUploadModal] = useState(false)

    const addNew = async (location, imagesArray) => {
        const locationData = {
            locationId: selectedLocation?.id,
            categoryId: selectedCategorie,
            localisationId: selectedLocalisation?.id,
            libelle: location.libelle,
            description: location.description,
            adresse: location.adresse,
            coutReel: location.coutReel,
            coutPromo: location.coutPromo,
            locationImagesLinks: imagesArray,
            frequence: location.frequence,
            caution: location.caution,
            dispo: location.dispo,
            aide: location.aide
        }
        await dispatch(addLocation(locationData))
        const error = store.getState().entities.location.error
        if(error !== null) {
            Alert.alert('Erreur!', "Impossible de faire l'ajout,veillez reessayer plutard", [
                    {text:'ok', onPress: () =>{return;}}
                ], {cancelable: false}
            )
        } else {
            dispatch(getHomeCounterIncrement())
            navigation.goBack()
        }
    }

    const addNewLocation = async(location) => {
        const locationImages = location.images
        let urlsArray = selectedLocation?selectedLocation.imagesLocation : []
        if(locationImages[0].base64Data) {
            const transformerUlrs = dataTransformer(locationImages)
            setLocationProgress(0)
            setUploadModal(true)
            const uploadResult = await directUpload(transformerUlrs, locationImages, (progress) =>setLocationProgress(progress))
            setUploadModal(false)
            if(uploadResult) {
                const uploadSuccessUrls = store.getState().s3_upload.signedRequestArray
                urlsArray = uploadSuccessUrls.map(item => item.url)
            }else {
                Alert.alert("Alert", "Les images n'ont pas été chargées, voulez-vous continuer?", [{
                    text: 'oui', onPress: async () => {
                        await addNew(location, urlsArray)
                        return;
                    }
                }, {
                    text: 'non', onPress: () => {return;}
                }])
            }
        }
        await addNew(location, urlsArray)
    }


    const handleChangeCategorie = (categorie) => {
        const selectedCateg = categories.find(categ => categ.libelleCateg.toLowerCase() === categorie.toLowerCase())
        setSelectedCategorie(selectedCateg.id)
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            <AppUploadProgress startProgress={uploadModal} progress={locationProgress}/>
        <ScrollView contentContainerStyle={{paddingTop: 10, paddingBottom: 20}}>
            <View>
                <AppButton
                    style={{
                        alignSelf: 'flex-start',
                        marginVertical: 20
                    }}
                    title='Select Localisation'
                    onPress={() => navigation.navigate('AccueilNavigator',{screen: "OtherMain", params: {screen: routes.LOCALISATION}})}/>
                {selectedLocalisation &&
                <View>
                    <AppLabelWithValue label='Ville' labelValue={selectedLocalisation?.Ville?.nom}/>
                    <AppLabelWithValue label="Quartier" labelValue={selectedLocalisation?.quartier}/>
                    <AppLabelWithValue label="Autres adresse" labelValue={selectedLocalisation?.adresse}/>
                </View>}
            </View>
            <AppForm validationSchema={locationValideSchema} onSubmit={addNewLocation}
            initialValues={{
                libelle: selectedLocation?selectedLocation.libelleLocation : '',
                description: selectedLocation?selectedLocation.descripLocation :  '',
                adresse: selectedLocation?selectedLocation.adresseLocation : '',
                coutReel: selectedLocation?String(selectedLocation.coutReel) : '',
                coutPromo: selectedLocation?String(selectedLocation.coutPromo) : '',
                frequence: selectedLocation?selectedLocation.frequenceLocation : '',
                caution: selectedLocation?String(selectedLocation.nombreCaution) : '',
                dispo: selectedLocation?String(selectedLocation.qteDispo) : '',
                images: selectedLocation?selectedLocation.imagesLocation : [],
                aide: selectedLocation?selectedLocation.aide : false,
                categorie: selectedLocation?selectedLocation.Categorie.libelleCateg : categories[0]?.libelleCateg
            }}>
                <AppFormItemPicker
                    handleSelectedValue={handleChangeCategorie}
                    name='categorie'
                    label='Categorie :'
                    items={categories.map(item => item.libelleCateg)}/>
                <FormImageListPicker name='images'/>
                <AppFormField name='libelle' title='Libelle'/>
                <AppFormField name='description' title='Description'/>
                <AppFormField title='Disponible' name='dispo'/>
                <AppFormField name='adresse' title='Adresse'/>
                <AppFormField name='coutReel' title='Coût reel'/>
                <AppFormField name='coutPromo' title='Coût promo'/>
                <AppFormField name='caution' title='Nombre de part pour la caution'/>
                <AppFormField name='frequence' title='Frequence de location'/>
                <AppFormSwitch title='Possiblité de louer à credit?' name='aide'/>
                <AppSubmitButton
                    style={{marginVertical: 40}}
                    title='Ajouter'/>
            </AppForm>
        </ScrollView>
     </>
    );
}

export default NewLocationScreen;