import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux'
import {ScrollView, StyleSheet, Image, View} from 'react-native';
import * as yup from 'yup'
import {Button} from "react-native-paper";

import AppText from "../components/AppText";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import AppForm from "../components/forms/AppForm";
import AppErrorMessage from "../components/forms/AppErrorMessage";
import {getLoginReset,register, signin} from '../store/slices/authSlice'
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useNotification from "../hooks/useNotification";
import useAuth from "../hooks/useAuth";

const registerValidationSchema = yup.object().shape({
    email: yup.string().email('Adresse email invalide').required("L'adresse email est requise"),
    password: yup.string().min(5, 'Le mot de passe doit contenir au moins 5 caractères').required('Le mot de passe est requis'),
    confirmation: yup.string().when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Les mots de passe  ne correspondent pas."
        )
    }).required("Veuillez confirmer le mot de passe.")
})

function RegisterScreen({navigation}) {
    const store = useStore()
    const {registerForPushNotificationsAsync} = useNotification()
    const {initUserDatas} = useAuth()
    const [registerFailed, setRegisterFailed] = useState(false)
    const [loginError, setLogginError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [appLoading, setAppLoading] = useState(false)


    const dispatch = useDispatch();

    const passRef = useRef()
    const passConfirmRef = useRef()

    const handleSubmit = async(user, {resetForm}) => {
        const userData = {
            email: user.email,
            password: user.password
        }
        setAppLoading(true)
            await dispatch(register(userData));
            const error = store.getState().auth.error
            if(error !== null) {
                setRegisterFailed(true)
                setErrorMessage("Désolé, nous n'avons pas pu créer votre compte, veuillez réessayer plutard.")
                return;
            } else {
                resetForm()
                let pushToken
                const registeredToken = store.getState().profile.connectedUser.pushNotificationToken
                if(registeredToken) pushToken = registeredToken
                else {
                    pushToken = await registerForPushNotificationsAsync()
                }
                await dispatch(signin({...user, pushNotificationToken: pushToken}))
                const loginError = store.getState().auth.error
                if(loginError !== null) {
                    setAppLoading(false)
                    setLogginError(true)
                    setErrorMessage("Votre compte a été créé mais nous n'avons pas pu vous connecter")
                    return;
                } else {
                    await initUserDatas()
                }
            }
            setAppLoading(false)
       navigation.navigate('AccueilNavigator', {screen: routes.HOME})
    }


    useEffect(() => {
        return () => {
            dispatch(getLoginReset())
        }
    }, [])

    return (
        <>
            <AppActivityIndicator visible={appLoading}/>
            <ScrollView style={{marginBottom: 20}}>
            <Image resizeMode='contain' style={styles.logoStyle} source={require('../assets/icon.png')} />
                <AppErrorMessage visible={registerFailed || loginError} error={errorMessage}/>
                <AppForm initialValues={{
                    email: '',
                    password: '',
                    confirmation: ''
                }}
                   onSubmit={handleSubmit}
                  validationSchema={registerValidationSchema}
                >

                    <AppFormField
                        iconName='mail'
                        returnKeyType='next'
                        onSubmitEditing={() => passRef.current.focus()}
                        title='E-mail'
                        name='email'
                        keyboardType='email-address'
                        autoCapitalize='none'/>

                    <AppFormField
                        iconName='lock'
                        returnKeyType='next'
                        onSubmitEditing={() => passConfirmRef.current.focus()}
                        formfieldRef={passRef}
                        title='password'
                        name='password'
                        secureTextEntry
                        autoCapitalize='none'
                    />

                    <AppFormField
                        iconName='lock'
                        formfieldRef={passConfirmRef}
                        title='password-confirmation'
                        name='confirmation'
                        secureTextEntry autoCapitalize='none'/>

                    <AppSubmitButton
                        style={{marginTop: 40, alignSelf: 'center', width: 300}} title='Inscrivez-vous' />
                </AppForm>
                <View style={{
                    marginVertical: 20,
                    alignItems: 'center'
                }}>
                    <AppText>Avez-vous déjà un compte?</AppText>
                    <Button
                        style={{width: 300}}
                        onPress={() => navigation.navigate(routes.LOGIN)}
                        mode='text'
                    >
                        Connectez-vous
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
        marginVertical: 30,
        alignSelf: 'center'
    }

})

export default RegisterScreen;