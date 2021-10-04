import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";
import {View, StyleSheet, ScrollView, Alert, ToastAndroid} from "react-native";
import * as Yup from 'yup'

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import {deleteOneVille, saveVille} from '../store/slices/villeSlice'
import AppSubmitButton from "../components/forms/AppSubmitButton";
import ListItem from "../components/list/ListItem";
import ListFooter from "../components/list/ListFooter";
import AppButton from "../components/AppButton";
import AppFormItemPicker from "../components/forms/AppFormItemPicker";
import AppActivityIndicator from "../components/AppActivityIndicator";
import colors from "../utilities/colors";

const villeValideSchema = Yup.object().shape({
    nom: Yup.string(),
    kilometrage: Yup.number(),
    prixkilo: Yup.number(),
    region: Yup.string()
})

function VilleScreen(props) {
    const dispatch = useDispatch();
    const store = useStore()

    const regions = useSelector(state => state.entities.region.list);
    const villes = useSelector(state => state.entities.ville.list);
    const loading = useSelector(state => state.entities.ville.loading)
    const [listMode, setListMode] = useState(true);
    const [addMode, setAddMode] = useState(false)

    const [selectedRegion, setSelectedRegion] = useState(1)
    const [editingVille, setEditingVille] = useState(null)

    const handleSaveVille = async(ville) => {
        const villeData = {
            id: editingVille?editingVille.id : null,
            regionId: selectedRegion,
            nom: ville.nom,
            kilometrage: ville.kilometrage,
            prixKilo: ville.prixKilo

        }
        await dispatch(saveVille(villeData));
        const error = store.getState().entities.ville.error
        if(error !== null) {
            alert("Impossible dajouter la ville.")
        }else {
            alert("Ville ajoutée avec succès.")
        }
        setAddMode(false);
        setListMode(true);
    }

    const handleDeleteVille = (ville) => {
        Alert.alert("Attention","Voulez-vous suppimer cette ville?", [{
            text: 'non', onPress: () => null
        }, {
            text: 'oui', onPress: async () => {
                await dispatch(deleteOneVille({villeId: ville.id}))
                const error = store.getState().entities.ville.error
                if(error !== null) {
                    ToastAndroid.showWithGravity("Impossible de supprimer cette ville", ToastAndroid.LONG, ToastAndroid.CENTER)
                }else {
                    ToastAndroid.showWithGravity("Ville supprimée avec succès.", ToastAndroid.LONG, ToastAndroid.CENTER)
                }
            }
        }])

    }

    const handleChangeRegion = (region) => {
        const currentRegion = regions.find(item => item.nom.toLowerCase() === region.toLowerCase())
        setSelectedRegion(currentRegion.id)

    }

    useEffect(() => {
        if(editingVille) setAddMode(true)
    }, [editingVille])

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <ScrollView>
            {villes && villes.length>0 && <View>
                { villes.map((item, index) =>
                    <ListItem
                        key={index.toString()}
                    handleDeleteItem={() => handleDeleteVille(item)}
                    handleEditItem={() => setEditingVille(item)}
                    propriety1={item.id}
                    propriety2={item.nom}
                    propriety3={item.localisation}
                    propriety4={`${item.kilometrage}  km`}/>)}
            </View>}
      {  addMode && <View>
                <AppForm initialValues={{
                    nom:editingVille?editingVille.nom :  '',
                    kilometrage:editingVille?String(editingVille.kilometrage) : '',
                    prixKilo: editingVille? String(editingVille.prixKilo) : '',
                    regions : editingVille?regions.find(item => item.id === editingVille.RegionId).nom : regions[0]?regions[0].nom : ''
                }} validationSchema={villeValideSchema} onSubmit={handleSaveVille}>
                    <AppFormItemPicker
                        handleSelectedValue={handleChangeRegion}
                        name='region'
                        label='Regions: '
                        items={regions.map(item => item.nom)}/>
                    <AppFormField title='nom' name='nom'/>
                    <AppFormField title='distance' name='kilometrage'/>
                    <AppFormField title='prix au km' name='prixKilo'/>
                    <AppSubmitButton title='Ajouter'/>
                </AppForm>
         { addMode &&
         <AppButton
             style={{
                 alignSelf: 'flex-start',
                 marginVertical: 30,
                 marginHorizontal: 20,
                 backgroundColor: colors.leger
             }}
             height={30}
             title='retour'
             onPress={() => {
                setListMode(true);
                setAddMode(false)
            }}/>}
            </View>}
        </ScrollView>
            {listMode && <ListFooter
                onPress={() => {
                    setAddMode(true);
                    setListMode(false)
                }}/>}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    newButton: {
        alignSelf: 'flex-end',
        margin: 60
    }
})

export default VilleScreen;