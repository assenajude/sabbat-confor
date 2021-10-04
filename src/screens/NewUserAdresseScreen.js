import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";
import {View, ScrollView, StyleSheet, ToastAndroid} from 'react-native'
import * as Yup from 'yup'


import AppText from "../components/AppText";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import color from '../utilities/colors'
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {
    saveAdresse
} from '../store/slices/userAdresseSlice';
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppItemPicker from "../components/AppItemPicker";
import {getAllVilles} from "../store/slices/villeSlice";


const adressValidSchema = Yup.object().shape({
    nom: Yup.string(),
    tel: Yup.string(),
    email: Yup.string(),
    adresse: Yup.string()
})

function NewUserAdresseScreen({navigation, route}) {
    const dispatch = useDispatch()
    const store = useStore()
    const existingAdresse = route.params
    const currentAdresse = useSelector(state => state.entities.userAdresse.currentAdresse)
    const villes = useSelector(state => state.entities.ville.list)
    const listRelais = useSelector(state => state.entities.pointRelais.list)
    const user = useSelector(state => state.auth.user)
    const [selectedVille, setSelectedVille] = useState(villes[0]?.nom);
    const [selectedRelais, setSelectedRelais] = useState();
    const isLoading = useSelector(state => state.entities.userAdresse.loading)
    const [pointsRelais, setPointsRelais] = useState(villes[0]?.PointRelais)
    const [relaisValue, setRelaisValue] = useState(pointsRelais[0])
    const [loading, setLoading] = useState(false)



    const handleSaveAdress = async (userAdresse) => {
        const adressData = {
            adresseId: existingAdresse?.id,
            idUser: user.id,
            relaisId: relaisValue.id,
            nom: userAdresse.nom,
            tel: userAdresse.tel,
            email: userAdresse.email,
            adresse: userAdresse.adresse
        }
        await dispatch(saveAdresse(adressData))
        const error = store.getState().entities.userAdresse.error
        if(error !== null) {
            return alert("Erreur lors de l'enregistrement, veuillez reessayer plutard.")
        }
        ToastAndroid.showWithGravity("Enregistrement effectué avec succès.", ToastAndroid.LONG, ToastAndroid.CENTER)
        navigation.goBack()
    }

    const handleChangeVille = (ville) => {
        setSelectedVille(ville)
        const currentVille = villes.find(item => item.nom.toLowerCase() === ville.toLowerCase())
        const villesRelais = currentVille.PointRelais
        setPointsRelais(villesRelais)
        setSelectedRelais(villesRelais[0])
        setRelaisValue(villesRelais[0])
    }

    const handleChangeRelais = (relais) => {
        if(relais && listRelais.length>0) {
            setSelectedRelais(relais)
            const currentRelais = listRelais.find(item => item.nom.toLowerCase() ===relais.toLowerCase())
            setRelaisValue(currentRelais)
        }
    }

    const getExistAdressRelais = () => {
        const relais = listRelais.find(relais => relais.id === existingAdresse.PointRelaiId)
        if(relais) {
            setSelectedVille(relais.Ville?.nom)
            setSelectedRelais(relais.nom)
        }
    }

    const getStated = useCallback(async () => {
        setLoading(true)
        await dispatch(getAllVilles())
        setLoading(false)
    }, [])

    useEffect(() => {
        getStated()
        if(existingAdresse.PointRelai) getExistAdressRelais()
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading || loading}/>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
        <View>
            <AppItemPicker
                onValueChange={val => handleChangeVille(val)}
                selectedValue={selectedVille}
                label='Ville: '
                items={villes.map(item => item.nom)}
            />
            <View style={{
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {pointsRelais.length>0 && <AppItemPicker
                    onValueChange={val => handleChangeRelais(val)}
                    selectedValue={selectedRelais}
                    label='Points Relais: '
                    items={pointsRelais.map(item => item.nom)}
                />}
                {pointsRelais.length === 0 && <AppText
                    style={{
                        marginHorizontal: 10
                    }}>
                    Désolé, nous n'avons aucune réprensation dans cette ville.
                </AppText>}
            </View>

            <View style={styles.infoPerso}>
                <AppText style={{backgroundColor: color.rougeBordeau, color: color.blanc}}>Infos perso</AppText>
                    <AppForm initialValues={{
                        nom: existingAdresse?existingAdresse.nom : currentAdresse.nom,
                        tel:existingAdresse?existingAdresse.tel : currentAdresse.tel,
                        email:existingAdresse?existingAdresse.email : currentAdresse.email,
                        adresse:existingAdresse?existingAdresse.adresse : currentAdresse.adresse
                    }} validationSchema={adressValidSchema} onSubmit={handleSaveAdress}>
                        <AppFormField title='Nom' name='nom'/>
                        <AppFormField title='Phone' name='tel'/>
                        <AppFormField
                            autoCapitalize='none'
                            title='E-mail'
                            name='email'
                            keyboardType='email-address'/>
                        <AppFormField title='Autres Adresse' name='adresse'/>
                        {pointsRelais.length> 0 && <AppSubmitButton
                            style={{marginVertical: 40, alignSelf: 'center', width: 300}} title='Ajouter'/>}
                    </AppForm>

            </View>

        </View>
        </ScrollView>
            </>

    );
}


const styles = StyleSheet.create({
    container: {
      padding: 5
    },
    region: {
        flexDirection: 'row'
    },
    ville: {
        flexDirection: 'row'
    },
    relaisList: {
        width: 'auto',
        alignSelf: 'center'
    },
    relais: {
        flexDirection: 'row'
    },
    regionList: {
        padding: 5,
    },
    infoPerso: {
        borderTopWidth: 1,
        marginTop: 20
    },
    villeContainer: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: color.leger,
        alignItems: 'center',
        top: 60
    },
    relaisContainer: {
        position: 'absolute',
        alignItems: 'center',
        backgroundColor: color.leger,
        width: '100%',
        height: '100%',
        top: 120
    }
})
export default NewUserAdresseScreen;