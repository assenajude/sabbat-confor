import React, {useRef, useState} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux'
import {ScrollView, StyleSheet, Image, View} from 'react-native';
import * as yup from 'yup'
import * as Linking from "expo-linking";
import {Button} from "react-native-paper";

import Color from "../utilities/colors"
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import AppForm from "../components/forms/AppForm";
import AppText from "../components/AppText";
import AppErrorMessage from "../components/forms/AppErrorMessage";
import {signin} from '../store/slices/authSlice'
import routes from '../navigation/routes'
import useAuth from "../hooks/useAuth";
import AppActivityIndicator from "../components/AppActivityIndicator";
import {getOrdersByUser} from "../store/slices/orderSlice";
import {getFacturesByUser} from "../store/slices/factureSlice";
import {getUserParrainageCompte} from "../store/slices/parrainageSlice";


const loginValidationSchema = yup.object().shape({
    username: yup.string().required("Nom d'utilisateur requis"),
    password: yup.string().min(4, 'Le mot de passe doit contenir au moins 4 caratères').required('le mot de passe est requis')
})

function LoginScreen({navigation, route}) {
    const connexionParams = route.params
    const store = useStore()
    const dispatch = useDispatch();
    const {initUserDatas, isValidEmail} = useAuth()

    const isLoading = useSelector(state => state.auth.loading)
    const pushToken = useSelector(state => state.profile.connectedUser.pushNotificationToken)
    const [error, setError] = useState(null)
    const [appLoading, setAppLoading] = useState(false)

    const passRef = useRef()

    const handleLogin = async (user) => {
        setAppLoading(true)
        const isEmail = isValidEmail(user.username)
        let data = {}
        if(isEmail) {
            data = {email: user.username, password: user.password}
        }else {
            data = {username: user.username, password: user.password}
        }
        const userData = {...data, pushNotificationToken: pushToken}
        await dispatch(signin(userData))
        const error = store.getState().auth.error
        if(error !== null) {
            setError(error)
            setAppLoading(false)
            return;
        }
        await initUserDatas()
        setAppLoading(false)
        if(connexionParams) {
            const paramsType = connexionParams.type
            const moreInfo = connexionParams.moreInfo
            if(paramsType && paramsType === 'order') {
                setAppLoading(true)
                await dispatch(getOrdersByUser())
                setAppLoading(false)
                const userOrders = store.getState().entities.order.currentUserOrders
                const selectedOrder = userOrders.find(order => order.id === connexionParams.orderId)
                if(selectedOrder) navigation.navigate('OrderDetailsScreen', selectedOrder)
                else navigation.navigate(routes.HOME)
            }
            if(paramsType && paramsType === 'facture') {
                setAppLoading(true)
                await dispatch(getFacturesByUser())
                setAppLoading(false)
                const userFactures = store.getState().entities.facture.list
                const selectedFacture = userFactures.find(facture => facture.id === connexionParams.factureId)
                if(selectedFacture) navigation.navigate('FactureDetailsScreen', selectedFacture)
                else navigation.navigate(routes.HOME)
            }
            if(paramsType && paramsType === 'parrainage') {
                if(moreInfo) {
                 switch (moreInfo) {
                     case 'activation':
                         navigation.navigate('AccueilNavigator',
                             {screen : 'Parrainage', params: {
                                     screen: 'CompteParrainScreen'
                                 }})
                         break;
                     case 'order':
                         navigation.navigate('AccueilNavigator', {screen: 'Parrainage', params:{
                                 screen: 'UserParrainageScreen'
                             }})
                         break;
                     case 'demande':
                         navigation.navigate('AccueilNavigator', {screen: 'Parrainage', params:{
                                 screen: 'ListeParrainScreen'
                             }})
                     default:
                         navigation.navigate('AccueilNavigator', {screen: routes.HOME})
                 }
                }else navigation.navigate('AccueilNavigator', {screen: routes.HOME})
            }
        }else {
            navigation.navigate('AccueilNavigator', {screen: routes.HOME})
        }
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading || appLoading}/>
            <ScrollView contentContainerStyle={{
                paddingBottom: 50
            }}>
                 <Image resizeMode='contain' style={styles.logoStyle} source={require('../assets/icon.png')} />
                    <AppErrorMessage visible={error !== null} error="Le nom d'utilisateur ou le mot de passe n'est pas correct"/>
                    <AppForm
                        initialValues={{username: '', password: ''}}
                        onSubmit={handleLogin}
                        validationSchema={loginValidationSchema}
                    >
                        <AppFormField
                            keyboardType='email-address'
                            returnKeyType='next'
                            onSubmitEditing={() => passRef.current.focus()}
                            title='Username ou email'
                            name='username'
                            iconName='email'
                            autoCapitalize='none'/>
                        <AppFormField
                            formfieldRef={passRef}
                            title='Password'
                            secureTextEntry
                            iconName='lock'
                            name='password'
                            autoCapitalize='none'
                        />
                        <AppSubmitButton
                            style={{width: 300,marginTop: 40, alignSelf: 'center'}}
                            title='Connectez-vous'/>
                    </AppForm>
                <View style={{
                    marginTop: 20
                }}>
                    <AppText>email/mot de passe oublié?</AppText>
                    <Button
                        style={{alignSelf: 'center', width: 300}}
                        onPress={() => Linking.openURL('tel:0708525827')}
                        mode='text'
                    >
                        Contacez-nous
                    </Button>
                </View>
                     <View>
                         <AppText style={{color:Color.dark}}>Vous n'avez pas de compte?</AppText>
                         <Button
                             style={{alignSelf: 'center', width: 300}}
                             onPress={() => navigation.navigate('AccueilNavigator', {screen: routes.REGISTER})}
                             mode='text'
                         >
                             Créer un compte
                         </Button>
                     </View>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    logoStyle: {
        width:150,
        height: 150,
        alignSelf: 'center',
        marginVertical: 30,
    },
})

export default LoginScreen;