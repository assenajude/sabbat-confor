import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";
import {ScrollView, View, StyleSheet, FlatList, ToastAndroid, Alert} from 'react-native'
import * as Yup from 'yup'

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {addRegion, deleteOneRegion} from '../store/slices/regionSlice'
import ListItem from "../components/list/ListItem";
import ListFooter from "../components/list/ListFooter";
import AppButton from "../components/AppButton";
import AppActivityIndicator from "../components/AppActivityIndicator";

const valideRegionSchema = Yup.object().shape({
    nom: Yup.string(),
    localisation: Yup.string()
})

function RegionScreen(props) {
    const dispatch = useDispatch()
    const store = useStore()
    const regions = useSelector(state => state.entities.region.list);
    const loading = useSelector(state => state.entities.region.loading)

    const [addNew, setAddNew] = useState(false)
    const [listMode, setListMode] = useState(true)
    const [editingRegion, setEditingRegion] = useState(null)

   const handleAddRegion = async (region) => {
        const data = {
            id: editingRegion?editingRegion.id: null,
            nom: region.nom,
            localisation: region.localisation
        }
        await dispatch(addRegion(data))
       setEditingRegion(null)
       setAddNew(false);
        setListMode(true)

    }

    const handleDeleteRegion = async (region) => {
        Alert.alert("Attention", "Voulez-vous supprimer cette region?",
            [{
            text: 'non', onPress: () => null
            }, {
            text: 'oui', onPress: async () => {
                await dispatch(deleteOneRegion({regionId: region.id}))
                    const error = store.getState().entities.region.error
                    if(error !== null) {
                        ToastAndroid.showWithGravity('Impossible de supprimer cette region', ToastAndroid.LONG, ToastAndroid.CENTER)
                    }else {
                        ToastAndroid.showWithGravity('Region supprimer avec succès.', ToastAndroid.LONG, ToastAndroid.CENTER)
                    }
            }
            }])
    }

    useEffect(() => {
        if(editingRegion) setAddNew(true)
    }, [editingRegion])

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <ScrollView>
            <FlatList data={regions} keyExtractor={item => item.id.toString()}
            renderItem={({item}) =>
                <ListItem
                    handleDeleteItem={() => handleDeleteRegion(item)}
                    handleEditItem={() => setEditingRegion(item)}
                    propriety1={item.id}
                    propriety2={item.nom}
                    propriety3={item.localisation}/>}/>
           {addNew && <View>

                <AppForm initialValues={{
                    nom:editingRegion?editingRegion.nom : '',
                    localisation: editingRegion?editingRegion.localisation: ''
                }} validationSchema={valideRegionSchema} onSubmit={handleAddRegion}>
                    <AppFormField title='Nom' name='nom'/>
                    <AppFormField title='Localisation' name='localisation'/>
                    <AppSubmitButton title='Ajouter'/>
                </AppForm>
               <AppButton
                   title='retour' style={{width: 80, backgroundColor: 'green'}}
                          onPress={() => {
                              setAddNew(false);
                              setListMode(true)
                          }} />
            </View>}
        </ScrollView>
            {listMode && <ListFooter
                onPress={() => {
                setAddNew(true)
                setListMode(false)
            }}/>}
            </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    buttonStyle: {
        alignSelf: 'flex-end',
        margin: 60
    }
})
export default RegionScreen;