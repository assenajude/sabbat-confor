import React, {useState} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
import {ScrollView, ToastAndroid} from 'react-native'
import * as Yup from 'yup'

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addRelais} from "../store/slices/pointRelaisSlice";
import AppItemPicker from "../components/AppItemPicker";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";


const relaisValideSchema = Yup.object().shape({
    nom: Yup.string(),
    contact: Yup.string(),
    adresse: Yup.string(),
    email: Yup.string(),
    adresseLivraisonId: Yup.number(),
    ville: Yup.string()
})


function NewPointRelaisScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()

const regions = useSelector(state => state.entities.region.list);
const villes = useSelector(state => state.entities.ville.list)
const [currentVilles, setCurrentVilles] = useState(() => {
    const firstRegion = regions[0]
    const startVilles = villes.filter(ville => ville.RegionId === firstRegion.id)
    return startVilles
})
const [selectedRegion, setSelectedRegion] = useState(regions[0].nom)
const [selectedVille, setSelectedVille] = useState(1)

    const handleAddRelais = async (relais) => {
        const relaisData = {
            villeId: selectedVille,
            nom: relais.nom,
            contact: relais.contact,
            adresse: relais.adresse,
            email: relais.email
        }
         await dispatch(addRelais(relaisData))
         const error = store.getState().entities.pointRelais.error
         if(error !== null) {
             return alert('Erreur...Impossible dajouter le point relais')
         }else {
             ToastAndroid.showWithGravity("Point Relais ajouté", ToastAndroid.LONG, ToastAndroid.CENTER)
             navigation.goBack()
         }
    }

    const handleChangeVille = (ville) => {
    const select = villes.find(item => item.nom.toLowerCase() === ville.toLowerCase())
        setSelectedVille(select.id)
    }

    const handleChangeRegion = (region) => {
        setSelectedRegion(region)
         const villeList = villes.filter(item =>item.Region.nom.toLowerCase() === region.toLowerCase())
         setCurrentVilles(villeList)
        setSelectedVille(villeList[0].id)
    }


    return (
        <>
            <AppItemPicker
                selectedValue={selectedRegion}
                onValueChange={val => handleChangeRegion(val)}
                label='Regions'
                items={regions.map(item => item.nom)}/>
        <ScrollView>
            <AppForm initialValues={{
                nom: '',
                contact: '',
                adresse: '',
                email: '',
                ville: currentVilles[0]?currentVilles[0].nom : ''
            }} validationSchema={relaisValideSchema} onSubmit={handleAddRelais}>
                <AppFormItemPicker
                    name='ville'
                    label='Ville: '
                    handleSelectedValue={handleChangeVille}
                    items={currentVilles.map(ville => ville.nom)}/>
                <AppFormField title='Nom' name='nom' />
                <AppFormField title='Contact' name='contact' />
                <AppFormField title='Adresse' name='adresse' />
                <AppFormField title='E-mail' name='email' />
                <AppSubmitButton title='Ajouter'/>
            </AppForm>
        </ScrollView>
            </>
    );
}

export default NewPointRelaisScreen;