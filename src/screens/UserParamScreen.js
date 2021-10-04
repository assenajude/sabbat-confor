import React, {useRef, useState} from 'react';
import * as Yup from 'yup'
import {ScrollView,View, ToastAndroid, Alert} from "react-native";
import AppLinkIcon from "../components/AppLinkIcon";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import AppSubmitButton from "../components/forms/AppSubmitButton";
import {useDispatch, useSelector, useStore} from "react-redux";
import {getLogout, getSelectedUserDetails, getUserPassChanged, getUserPassReset} from "../store/slices/authSlice";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";
import ParrainageHeader from "../components/parrainage/ParrainageHeader";
import AppLabelWithValue from "../components/AppLabelWithValue";
import colors from "../utilities/colors";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";

const changePassValid = Yup.object().shape({
    oldPass: Yup.string().required('Ancien passe requis'),
    newPass: Yup.string().min(5,'Entrez au minimum 5 caractères').required('Nouveau passe requis'),
    newPassConfirm: Yup.string().when("newPass", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
            [Yup.ref("newPass")],
            "Les mots de passe  ne correspondent pas."
        )
    }).required("Veuillez confirmer le mot de passe.")

})
function UserParamScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {userRoleAdmin} = useAuth()

    const connectedUser = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)
    const allUsers = useSelector(state => state.auth.allUsers)

    const [editPass, setEditPass] = useState(false)
    const [resetParams, setResetParams] = useState(false)
    const newPassRef = useRef()
    const newConfirmref = useRef()

    const handleChangePassword = async (infos) => {
        Alert.alert('Attention!', "Voulez-vous changer votre mot de passe?", [{
            text: 'oui', onPress: async () => {
                const data = {
                    userId: connectedUser.id,
                    oldPass: infos.oldPass,
                    newPass: infos.newPass
                }
                await dispatch(getUserPassChanged(data))
                const error = store.getState().auth.error
                if(error !== null) {
                    return alert("Une erreur est apparue lors de l'enregistrement de vos nouveaux parametres, veuillez reessayer plutard ou contactez nous.")
                }
                ToastAndroid.showWithGravity("Felicitation, vous avez modifié votre paramètres avec succès.", ToastAndroid.LONG, ToastAndroid.CENTER)
                dispatch(getLogout())
                navigation.navigate(routes.LOGIN)
            }
        }, {text:'non', onPress: () => {return;}}])
    }

    const handleResetPassWord = (user) => {
        Alert.alert('Attention!',"Voulez-vous modifier le mot de passe de cet user?", [{
            text: 'oui', onPress: async () => {
                await dispatch(getUserPassReset({email: user.email}))
                const error = store.getState().auth.error
                if(error !== null ) {
                    ToastAndroid.showWithGravity("Erreur lors de la modifications des parametres.", ToastAndroid.LONG, ToastAndroid.CENTER)
                }else {
                    const newPass = store.getState().auth.resetCode
                    alert(`Le mot de passe de l'utilisateur dont l'adresse email est ${user.email} a été modifié avec succès. Le nouveau passe est ${newPass}`)
                }

            }
        }, {text:'non', onPress: () => {return;}}])
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <ScrollView>
            <View>
            <AppLinkIcon
                containerStyle={{
                    marginVertical:20
                }}
                details={editPass}
                onPress={() => setEditPass(!editPass)}
                title='Changer votre mot de passe'/>
               {editPass && <View>
                   <AppForm
                       initialValues={{
                           oldPass: '',
                           newPass: '',
                           newPassConfirm: ''
                       }}
                       validationSchema={changePassValid}
                       onSubmit={handleChangePassword}>
                       <AppFormField
                           secureTextEntry
                           autoCapitalize='none'
                           returnKeyType='next'
                           onSubmitEditing={() => newPassRef.current.focus()}
                           title='Ancien mot de passe'
                           name='oldPass'/>
                       <AppFormField
                           secureTextEntry
                           autoCapitalize='none'
                           returnKeyType='next'
                           onSubmitEditing={() => newConfirmref.current.focus()}
                           formfieldRef={newPassRef}
                           name="newPass"
                           title='Nouveau mot de passe'/>
                       <AppFormField
                           secureTextEntry
                           autoCapitalize='none'
                           formfieldRef={newConfirmref}
                           name='newPassConfirm'
                           title='Confirmez le nouveau passe'/>
                           <AppSubmitButton
                               style={{alignSelf: 'center', marginVertical: 40, width: 300}}
                               title='Valider'
                           />
                   </AppForm>
                </View>}
            </View>
            {userRoleAdmin() && <View>
                <AppLinkIcon
                    details={resetParams}
                    onPress={() => setResetParams(!resetParams)}
                    title='Reset user password'/>
                    {resetParams && <View>
                        {allUsers.map((user,index) =>
                            <View key={index.toString()}>
                                <ParrainageHeader
                                    parrainUser={user}
                                    getUserProfile={() => dispatch(getSelectedUserDetails(user))}
                                    ownerUsername={user.username}
                                    ownerEmail={user.email}
                                />
                                {user.showDetails &&
                                <View style={{
                                    backgroundColor: colors.blanc
                                }}>
                                    <AppLabelWithValue
                                        labelValue={user.nom}
                                        label='Nom: '/>
                                        <AppLabelWithValue
                                        labelValue={user.prenom}
                                        label='Prenom: '/>
                                        <AppLabelWithValue
                                        labelValue={user.username}
                                        label='Nom utilisateur: '/>
                                        <AppLabelWithValue
                                        labelValue={user.email}
                                        label='Email: '/>
                                        <AppButton
                                            style={{alignSelf: 'flex-start', marginVertical: 20, marginLeft: 10}}
                                            title='Reset Password'
                                            onPress={() => handleResetPassWord(user)}
                                        />
                                </View>}
                            </View>
                           )}
                    </View>}
            </View>}
        </ScrollView>
            </>
    );
}

export default UserParamScreen;