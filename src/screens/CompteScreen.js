import React, {useCallback, useEffect, useState} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
import {View, ScrollView, StyleSheet, Image} from 'react-native'

import AppText from "../components/AppText";
import AppActivityIndicator from "../components/AppActivityIndicator";
import colors from "../utilities/colors";
import {getConnectedUserData} from "../store/slices/userProfileSlice";
import AppAvatar from "../components/user/AppAvatar";
import useAuth from "../hooks/useAuth";
import AppLabelWithContent from "../components/AppLabelWithContent";
import AppIconButton from "../components/AppIconButton";
import LottieView from 'lottie-react-native'
import AppLabelLink from "../components/AppLabelLink";
import routes from "../navigation/routes";
import AppLinkIcon from "../components/AppLinkIcon";
import {getAllUsers} from "../store/slices/authSlice";
import AppButton from "../components/AppButton";
import AppFundInfo from "../components/AppFundInfo";

function CompteScreen({navigation, route}) {
    const selectedParams = route.params
    const dispatch = useDispatch()
    const store = useStore()
    const  {userRoleAdmin} = useAuth()
    const user = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.profile.loading)
    const allowEdit = userRoleAdmin() || selectedParams.id === user.id
    const [selectedUser, setSelectedUser] = useState(selectedParams)
    const [pieceRectoLoading, setPieceRectoLoading] = useState(true)
    const [pieceVersoLoading, setPieceVersoLoading] = useState(true)
    const [showInfos, setShowInfos] = useState(false)
    const [showParams, setShowParams] = useState(false)
    const [showPieces, setShowPieces] = useState(false)

    const getUserInfo = useCallback(async () => {
        await dispatch(getConnectedUserData())
        if(selectedParams.id === user.id) {
             const currentUser = store.getState().profile.connectedUser
            setSelectedUser(currentUser)
        }
    }, [])

    useEffect(() => {
        if(userRoleAdmin()) {
            dispatch(getAllUsers())
        }
        const unsubscribe = navigation.addListener('focus', () => {
            getUserInfo()
        })
        return unsubscribe
    }, [])

    return (
        <>
         <AppActivityIndicator visible={isLoading}/>
         <ScrollView contentContainerStyle={styles.container}>
            <View>
                <AppAvatar
                    otherContainerStyle={styles.avatarContainer}
                    imageSize={150}
                    showNottif={false}
                    showInfo={true}
                    user={selectedUser}
                />

                    <View style={styles.funds}>
                        <AppFundInfo
                            value={selectedUser.cashback}
                            label='Cash back'
                        />

                        <AppFundInfo
                            value={selectedUser.fidelitySeuil}
                            label='Seuil de fidélité'
                        />
                    </View>
                {allowEdit &&
                <AppIconButton
                    onPress={() => navigation.navigate('EditUserImagesScreen')}
                    iconSize={30}
                    buttonContainer={styles.cameraStyle}
                    iconName='camera' iconColor='black'/>}
            </View>
            <View style={{
                borderTopWidth: 1,
                marginTop: 20
            }}>
                <View style={{
                    alignSelf: 'center',
                    marginBottom: 20,
                    backgroundColor: colors.rougeBordeau
                }}>
                    <AppText style={{color: colors.blanc}}>Infos complementaires</AppText>
                </View>
                <AppLinkIcon
                    containerStyle={{marginVertical: 20}}
                    title="Pièces d'identité"
                    onPress={() => setShowPieces(!showPieces)}
                />
                {showPieces && <View style={styles.pieceContainer}>
                    <View style={styles.pieceImageStyle}>
                        {!selectedUser.pieceIdentite && <AppText style={{fontSize: 15}}>pièce recto</AppText>}
                        {selectedUser.pieceIdentite && <View style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image
                                onLoadEnd={() => setPieceRectoLoading(false)}
                                resizeMode='contain'
                                style={{height: 120, width: 160, borderRadius: 20}}
                                source={{uri: selectedUser.pieceIdentite[0]}}/>
                            {pieceRectoLoading && <View style={styles.loadingContainer}>
                                <LottieView
                                    loop={true}
                                    autoPlay={true}
                                    style={styles.imageLoading}
                                    source={require('../assets/animations/image-loading')}/>
                            </View>}

                        </View>
                        }
                    </View>
                    <View style={styles.pieceImageStyle}>
                        {!selectedUser.pieceIdentite && <AppText style={{fontSize: 15}}>pièce verso</AppText>}
                        {selectedUser.pieceIdentite?.length>1 &&
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Image
                                onLoadEnd={() => setPieceVersoLoading(false)}
                                resizeMode='contain'
                                style={{height: 120, width: 160}}
                                source={{uri: selectedUser.pieceIdentite[1]}}/>
                            {pieceVersoLoading && <View style={styles.loadingContainer}>
                                <LottieView
                                    loop={true}
                                    autoPlay={true}
                                    style={styles.imageLoading}
                                    source={require('../assets/animations/image-loading')}/>
                            </View>}

                        </View>
                        }

                    </View>
                </View>}
                <View>
                    <AppLinkIcon
                        details={showInfos}
                        title='Autres informations'
                        onPress={() => setShowInfos(!showInfos)}
                    />
                   {showInfos &&
                   <View>
                    <AppLabelWithContent label="Nom" content={selectedUser.nom}/>
                    <AppLabelWithContent label="Prenoms" content={selectedUser.prenom}/>
                    <AppLabelWithContent label="Nom d'utilisateur" content={selectedUser.username}/>
                    <AppLabelWithContent label="Telephone" content={selectedUser.phone}/>
                    <AppLabelWithContent label="Adresse mail" content={selectedUser.email}/>
                    <AppLabelWithContent label="Situation géographique" content={selectedUser.adresse}/>
                    <AppLabelWithContent label="Profession" content={selectedUser.profession} showSeparator={false}/>
                       {allowEdit && <View style={{alignSelf: 'flex-end'}}>
                           <AppButton
                               style={{marginRight: 10, marginVertical: 30}}
                               onPress={() => navigation.navigate('EditUserInfoScreen')}
                               title='Edit infos' iconSize={24}
                               iconName='account-edit'
                           />
                       </View>}
                </View>}
            </View>
            </View>
            <View>
                <AppLinkIcon
                    containerStyle={{
                        marginTop: 20
                    }}
                    title='Paramètres'
                    details={showParams}
                    onPress={() =>setShowParams(!showParams)}
                />
                {showParams && <View style={{
                    alignItems:'flex-start'
                }}>
                    <AppLabelLink
                        otherTextStyle={{fontSize: 18}}
                        handleLink={() => navigation.navigate(routes.PARAM)}
                        content='Gerez vos parametres'/>
                </View>}
            </View>
         </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    avatarContainer: {
        marginVertical: 20,
        alignItems: 'center'
    },
    funds: {
      alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    container: {
      paddingBottom: 50
    },
    pieceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20
    },
    buttonStyle: {
        alignSelf: 'flex-end',
        margin: 40
    },
    pieceImageStyle: {
        width: '45%',
        height: 130,
        marginHorizontal: 5,
        backgroundColor: colors.leger,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    labelStyle: {
        alignItems: 'flex-start',
        margin: 10,
        marginLeft: 10
    },
    cameraStyle: {
        position: 'absolute',
        right: 10,
        top: 10,
        height: 40,
        width: 40
    },
    imageLoading: {
        height: 80,
        width: 80
    },
    loadingContainer: {
        position: 'absolute',
        backgroundColor: colors.leger,
        height: 120,
        width: 160,
        alignItems: 'center',
        justifyContent: 'center'
    },
})
export default CompteScreen;