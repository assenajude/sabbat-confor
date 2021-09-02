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
    const loading = useSelector(state => state.auth.loading)
    const [registerFailed, setRegisterFailed] = useState(false)
    const [loginError, setLogginError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [tokenLoading, setTokenLoading] = useState(false)
    const [appLoading, setAppLoading] = useState(false)


    const dispatch = useDispatch();

    const passRef = useRef()
    const passConfirmRef = useRef()

    const handleSubmit = async(user, {resetForm}) => {
        const userData = {
            email: user.email,
            password: user.password
        }
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
                    setTokenLoading(true)
                    pushToken = await registerForPushNotificationsAsync()
                    setTokenLoading(false)
                }
                await dispatch(signin({...user, pushNotificationToken: pushToken}))
                const loginError = store.getState().auth.error
                if(loginError !== null) {
                    setLogginError(true)
                    setErrorMessage("Votre compte a été créé mais nous n'avons pas pu vous connecter")
                    return;
                } else {
                    setAppLoading(true)
                    await initUserDatas()
                    setAppLoading(false)
                }
            }
       navigation.navigate('AccueilNavigator', {screen: routes.HOME})
    }


    useEffect(() => {
        return () => {
            dispatch(getLoginReset())
        }
    }, [])

    return (
        <>
            <AppActivityIndicator visible={loading || tokenLoading || appLoading}/>
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

                    <AppSubmitButton style={{marginTop: 40}} title='Inscrivez-vous' />
                </AppForm>
                <View style={{
                    marginVertical: 20
                }}>
                    <AppText>Avez-vous déjà un compte?</AppText>
                    <Button
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