import React from 'react'
import {useSelector, useDispatch} from "react-redux";
import {DrawerItem, DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import {View,Text, StyleSheet, TouchableOpacity} from 'react-native'
import {MaterialCommunityIcons} from '@expo/vector-icons'

import Color from '../../utilities/colors';
import routes from '../../navigation/routes'
import AppButton from "../AppButton";
import AppIconWithBadge from "../AppIconWithBadge";
import {getLogout} from '../../store/slices/authSlice'
import useAuth from "../../hooks/useAuth";
import AppAvatar from "./AppAvatar";
import AppText from "../AppText";
import {Button, Avatar, IconButton} from "react-native-paper";

function DrawerContent(props) {
    const dispatch = useDispatch()
    const {userRoleAdmin,resetConnectedUserData} = useAuth()

    const user = useSelector(state => state.auth.user)
    const userData = useSelector(state => state.profile.connectedUser)
    const isUser = useSelector(state => {
        const connetedUser = state.auth.user
        const isLoggedIn = Object.entries(connetedUser).length > 0?true:false
        return isLoggedIn
    })



    const handleLogout = () => {
        dispatch(getLogout())
        resetConnectedUserData()
    }


    return (
        <>
        <DrawerContentScrollView {...props}>
            <View>
            <View style={[styles.headerContainer, {marginBottom: isUser?10:20}]}>
                <AppAvatar
                    otherContainerStyle={{
                        width: 60
                    }}
                    showNottif={false}
                    onPress={() => props.navigation.navigate(routes.COMPTE, {...user, ...userData})}
                    imageSize={60}
                    otherImageStyle={{
                        backgroundColor: Color.leger
                    }}
                    user={user}/>
                {isUser && <TouchableOpacity
                    style={styles.userInfo}
                    onPress={() => props.navigation.navigate(routes.COMPTE, {...user, ...userData})}>
                    <AppText>{user.username?user.username : user.nom?user.nom : user.email}</AppText>
                    <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
                </TouchableOpacity>}
            </View>
            {!isUser && <View style={styles.login}>
                <AppButton
                    title='Connexion'
                    onPress={() => {
                        props.navigation.navigate(routes.LOGIN)
                    }}/>
                <Text> ou</Text>
                <Button
                    onPress={() => props.navigation.navigate(routes.REGISTER)}
                    mode='text'
                >
                    Créer un compte
                </Button>
            </View>}

            <IconButton
                onPress={() =>props.navigation.navigate(routes.HELP)}
                color={Color.bleuFbi}
                style={styles.help}
                icon='head-question'
                size={40}/>
            </View>
            <DrawerItemList {...props} />
            <DrawerItem
                icon={() =>
                    <AppIconWithBadge
                        badgeCount={userData.favoriteCompter}
                        name='heart-outline'
                    />}
                label='Favoris'
                onPress={() => props.navigation.navigate(routes.USER_FAVORIS)}
            />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    name='billboard'
                    badgeCount={userData.factureCompter}
                />}
                label='Mes factures'
                onPress={() => {props.navigation.navigate(routes.USER_FACTURE)}}
            />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    name='bag-personal'
                    badgeCount={userData.articleCompter}
                />}
                label='cmd articles'
                onPress={() => {props.navigation.navigate(routes.USER_ORDER)}} />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    name='store'
                    badgeCount={userData.locationCompter}
                />}
                label='cmd locations'
                onPress={() => {props.navigation.navigate('UserLocation')}} />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    badgeCount={userData.serviceCompter}
                    name="room-service"
                />}
                label='cmd services'
                onPress={() => {props.navigation.navigate(routes.USER_SERVICE)}} />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    name='routes'
              />
               }
                label='Mes adresses'
                onPress={() => {props.navigation.navigate(routes.USER_ADDRESS)}} />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    name='bus-stop-covered'
                    badgeCount={userData.parrainageCompter}
                />}
                label='Parrainage'
                onPress={() => {props.navigation.navigate('Parrainage')}}
            />
            <DrawerItem
                icon={() =>
                <AppIconWithBadge
                    name='wallet-giftcard'
                    badgeCount={userData.propositionCompter}
                />}
                label='Plans & Propositions'
                onPress={() => {props.navigation.navigate('AccueilNavigator',{screen: 'PlanPropositionScreen'})}} />
            {userRoleAdmin() && <DrawerItem
                icon={() =>
                    <AppIconWithBadge
                        name="dots-horizontal"
                    />
                }
                label='Gerer'
                onPress={() => {props.navigation.navigate('OtherMain')}} />}
        </DrawerContentScrollView>
            {isUser &&
            <AppButton
                style={{alignSelf: 'center', marginVertical: 10, backgroundColor: Color.rougeBordeau}}
                iconName='logout'
                title='Se deconnecter'
                onPress={() => handleLogout()}/>}
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    help: {
        position: 'absolute',
        right: 0,
        top: -10,
    },
    login:{
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 10
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10
    }
})

export default DrawerContent;