import React, {useCallback, useEffect} from 'react';
import {StyleSheet,ScrollView} from 'react-native'
import AppButton from "../components/AppButton";
import routes from '../navigation/routes'
import {useDispatch} from "react-redux";
import {loadCategories} from "../store/slices/categorieSlice";
import {loadRelais} from '../store/slices/pointRelaisSlice'
import {getRegions} from '../store/slices/regionSlice';
import {getAllVilles} from '../store/slices/villeSlice'
import {getAdresse} from '../store/slices/userAdresseSlice'
import colors from "../utilities/colors";


function OtherFileMain({navigation}) {

    const dispatch = useDispatch();

    const getCategories = useCallback(async () => {
        await dispatch(loadCategories())
    }, [])

    const getVilles = useCallback(async () => {
        await dispatch(getAllVilles())
    }, [])

    const getPointRelais = useCallback(async () => {
        await dispatch(loadRelais())
    }, [])

    const getAllRegions = useCallback(async () => {
        await dispatch(getRegions())
    }, [])

const getUserAdresses = useCallback(async () => {
        await dispatch(getAdresse())
    }, [])

    useEffect(() => {
            getCategories();
        getPointRelais()
        getAllRegions()
        getVilles()
        getUserAdresses()
    }, [])

    return (
        <ScrollView>
            <AppButton title='Espace' style={styles.buttonStyle} onPress={() =>navigation.navigate(routes.ESPACE)}/>
           <AppButton title='Categorie' style={styles.buttonStyle} onPress={() =>navigation.navigate(routes.CATEGORIE)}/>
           <AppButton title='Payement' style={styles.buttonStyle} onPress={() =>navigation.navigate(routes.PAYEMENT)}/>
           <AppButton title='Plan' style={styles.buttonStyle} onPress={() => navigation.navigate('AccueilNavigator',{screen: routes.PLAN})}/>
           <AppButton title='Region' style={styles.buttonStyle} onPress={() => navigation.navigate(routes.REGION)}/>
           <AppButton title='Ville' style={styles.buttonStyle} onPress={() => navigation.navigate(routes.VILLE)}/>
           <AppButton title='Localisation' style={styles.buttonStyle} onPress={() => navigation.navigate(routes.LOCALISATION)}/>
            <AppButton title='Point relais' style={styles.buttonStyle} onPress={() => navigation.navigate(routes.POINT_RELAIS)}/>
            <AppButton title='Adresse utilisateur' style={styles.buttonStyle} onPress={() => navigation.navigate(routes.USER_ADDRESS)}/>

        </ScrollView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonStyle: {
        backgroundColor: colors.bleuFbi,
        width: '90%',
        padding: 10,
        margin: 20
    }
})
export default OtherFileMain;