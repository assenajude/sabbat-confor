import React from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";
import {ScrollView, StyleSheet, View} from "react-native";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import * as Yup from 'yup'
import { addOption} from "../store/slices/mainSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

const detailValideSchema = Yup.object().shape({
    couleur: Yup.string(),
    taille: Yup.string(),
    modele: Yup.string(),
    quantite: Yup.number(),
    prix: Yup.number()
})

function NewOptionScreen({route}) {
    const selectedItem = route.params
    const dispatch = useDispatch()
    const store = useStore()

    const loading = useSelector(state => state.entities.main.loading)

    const handleAddOption = async (data) => {
        const articleData = {
            itemId: selectedItem.id,
            type: selectedItem.Categorie.typeCateg,
            couleur: data.couleur,
            taille: data.taille,
            modele: data.modele,
            quantite: data.quantite,
            prix: data.prix
        }
        await dispatch(addOption(articleData))
        const error = store.getState().entities.main.error
        if(error !== null) {
            return alert("Impossible d'ajouter l'option.")
        }
        alert("Option ajouté avec succès.")
    }
    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <ScrollView>
            <View style={styles.container}>
            <AppForm initialValues={{
                couleur: '',
                taille: '',
                modele: '',
                quantite: '',
                prix: ''

            }} validationSchema={detailValideSchema} onSubmit={handleAddOption}>

                <AppFormField title='Couleur' name='couleur'/>
                <AppFormField title='Size' name='taille'/>
                <AppFormField title='Modele' name='modele'/>
                <AppFormField title='Quantite' name='quantite'/>
                <AppFormField title='Prix' name='prix'/>

                <AppSubmitButton title='Ajouter'/>
            </AppForm>
            </View>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 20
    }
})

export default NewOptionScreen;