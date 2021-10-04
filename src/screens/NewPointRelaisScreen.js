import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
import {ScrollView, ToastAndroid} from 'react-native'
import * as Yup from 'yup'

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addRelais} from "../store/slices/pointRelaisSlice";
import AppItemPicker from "../components/AppItemPicker";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";
import {getRegions} from "../store/slices/regionSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";


const relaisValideSchema = Yup.object().shape({
    nom: Yup.string(),
    contact: Yup.string(),
    adresse: Yup.string(),
    email: Yup.string(),
    adresseLivraisonId: Yup.number(),
    ville: Yup.string()
})


function NewPointRelaisScreen({navigation, route}) {
    const selectedRelais = route.params
    const dispatch = useDispatch()
    const store = useStore()

const regions = useSelector(state => state.entities.region.list);
const villes = useSelector(state => state.entities.ville.list)
const [currentVilles, setCurrentVilles] = useState(() => {
    const firstRegion = regions[0]
    const startVilles = villes.filter(ville => ville.RegionId === firstRegion.id)
    return startVilles
})
const [selectedRegion, setSelectedRegion] = useState(selectedRelais?regions.find(item => item.id === selectedRelais.Ville.RegionId).nom : regions[0].nom)
const [selectedVille, setSelectedVille] = useState(1)
    const [startLoading, setStartLoading] = useState(false)

    const handleAddRelais = async (relais) => {
        const relaisData = {
            id: selectedRelais?selectedRelais.id : null,
            villeId: selectedVille,
            nom: relais.nom,
            contact: relais.contact,
            adresse: relais.adresse,
            email: relais.email
        }
        setStartLoading(true)
         await dispatch(addRelais(relaisData))
        setStartLoading(false)
         const error = store.getState().entities.pointRelais.error
        if(error !== null) {
             return alert('Erreur...Impossible dajouter le point relais')
         }else {
             ToastAndroid.showWithGravity("Point Relais ajouté", ToastAndroid.LONG, ToastAndroid.CENTER)
             navigation.goBack()
         }
    }

    const handleChangeVille = (ville) => {
    if(ville && villes.length>0) {
        const select = villes.find(item => item.nom.toLowerCase() === ville.toLowerCase())
        setSelectedVille(select.id)
    }
    }

    const handleChangeRegion = (region) => {
        setSelectedRegion(region)
         const villeList = villes.filter(item =>item.Region.nom.toLowerCase() === region.toLowerCase())
         setCurrentVilles(villeList)
        if(villeList.length>0) setSelectedVille(villeList[0].id)
    }

    const getStated = useCallback(async() => {
        setStartLoading(true)
        await dispatch(getRegions())
        setStartLoading(false)
    }, [])

    useEffect(() => {
        if(selectedRelais) {
            const selectedRegion = regions.find(item => item.id === selectedRelais.Ville.RegionId)
            handleChangeRegion(selectedRegion.nom)
        }
        getStated()
    }, [])


    return (
        <>
            <AppActivityIndicator visible={startLoading}/>
            <AppItemPicker
                selectedValue={selectedRegion}
                onValueChange={val => handleChangeRegion(val)}
                label='Regions'
                items={regions.map(item => item.nom)}/>
        <ScrollView
            contentContainerStyle={{
                paddingBottom: 50
            }}>
            <AppForm initialValues={{
                nom:selectedRelais?selectedRelais.nom:  '',
                contact: selectedRelais?selectedRelais.contact : '',
                adresse: selectedRelais?selectedRelais.adresse :'',
                email: selectedRelais?selectedRelais.email:  '',
                ville:selectedRelais?selectedRelais.Ville.nom : currentVilles[0].nom
            }}
                     validationSchema={relaisValideSchema}
                     onSubmit={handleAddRelais}>
                {currentVilles.length>0 &&
                <AppFormItemPicker
                    name='ville'
                    label='Ville: '
                    handleSelectedValue={handleChangeVille}
                    items={currentVilles.map(ville => ville.nom)}/>}
                {currentVilles.length===0 &&
                <AppText style={{alignSelf: 'center', marginHorizontal: 10}}>Desolé, nous n'avons aucune représentation dans cette région.</AppText>}
                <AppFormField title='Nom' name='nom' />
                <AppFormField title='Contact' name='contact' />
                <AppFormField title='Adresse' name='adresse' />
                <AppFormField title='E-mail' name='email' />
                {currentVilles.length > 0 && <AppSubmitButton title='Ajouter'/>}
            </AppForm>
        </ScrollView>
            </>
    );
}

export default NewPointRelaisScreen;