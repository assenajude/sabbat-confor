import React, {useState} from 'react';
import {ScrollView} from "react-native";
import * as Yup from 'yup'
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";
import {useDispatch, useSelector, useStore} from "react-redux";
import {addLocalisation} from "../store/slices/localisationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

const localisationValid = Yup.object().shape({
    quartier: Yup.string(),
    adresse: Yup.string(),
    ville: Yup.string()
})
function NewLocalisationScreen({route, navigation}) {
    const selectedLocal = route.params
    const store = useStore()
    const dispatch = useDispatch()
    const villes = useSelector(state => state.entities.ville.list)
    const [loading, setLoading] = useState(false)
    const [selectedVille, setSelectedVille] = useState(villes[0].id)

    const handleChangeLocal = (ville) => {
        const currentVille = villes.find(item => item.nom.toLowerCase() === ville.toLowerCase())
        setSelectedVille(currentVille.id)

    }
    const handleValidateLocal = async (localisation, {resetForm}) => {
        const data = {
            localisationId: selectedLocal?selectedLocal.id : null,
            villeId: selectedVille,
            quartier: localisation.quartier,
            adresse: localisation.adresse
        }
        setLoading(true)
        await dispatch(addLocalisation(data))
        setLoading(false)
        const error = store.getState().entities.localisation.error
        if(error !== null) return alert("Impossible d'ajouter la localisation")
        alert("Localisation ajoutée avec succès.")
        resetForm()
        navigation.goBack()
    }


    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <ScrollView>
            <AppForm
                initialValues={{
                ville: selectedLocal?selectedLocal.Ville.nom: villes[0].nom,
                quartier: selectedLocal?selectedLocal.quartier: '',
                adresse: selectedLocal?selectedLocal.adresse : ''
            }}
                validationSchema={localisationValid}
                onSubmit={handleValidateLocal}>
                <AppFormItemPicker
                    items={villes.map(item => item.nom)}
                    label='Ville: ' name='ville'
                    handleSelectedValue={handleChangeLocal}
                />
                <AppFormField title='Quartier' name='quartier'/>
                <AppFormField title='Adresse' name='adresse'/>
                <AppSubmitButton title='Valider' width={200}/>
            </AppForm>
        </ScrollView>
            </>
    );
}

export default NewLocalisationScreen;