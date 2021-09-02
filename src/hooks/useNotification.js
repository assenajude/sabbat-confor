import React from "react";
import {useDispatch, useStore} from "react-redux";
import {Platform} from 'react-native'
import * as Notifications from 'expo-notifications'
import Constants from "expo-constants/src/Constants";
import navigation from '../navigation/routeNavigation'
import routes from "../navigation/routes";
import {getLogout} from "../store/slices/authSlice";

let useNotification;
export default useNotification = () => {
    const store = useStore()
    const dispatch = useDispatch()

    const registerForPushNotificationsAsync = async () => {
        let token = ''
        try {
            if (Constants.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    alert('Failed to get push token for push notification!');
                    return;
                }
                token = (await Notifications.getExpoPushTokenAsync()).data;
            } else {
                alert('Must use physical device for Push Notifications');
            }
            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }
            return token
        } catch (e) {
            throw new Error(e)
        }

    };

    const handleReceivedNotification = (responseData) => {
        const connectedUser = store.getState().auth.user
        const connectedUserProfile = store.getState().profile.connectedUser
        const allUserOrders = store.getState().entities.order.currentUserOrders
        const allFacture = store.getState().entities.facture.list
        const isConnected = Object.keys(connectedUser).length>0
        const notifType = responseData.data.notifType
        let params
        if(notifType === "welcome") {
            if(isConnected) {
                params = {...connectedUser, ...connectedUserProfile}
                navigation.navigate('AccueilNavigator', {
                screen: 'CompteScreen',
                    params
            })
            }else navigation.navigate(routes.HOME)
        }
        if(notifType === 'order' ) {
            if(isConnected) {
                const selectedOrder = allUserOrders.find(order => order.id === responseData.data.orderId)
                if(selectedOrder) {
                    navigation.navigate('AccueilNavigator', {
                        screen: 'OrderDetailsScreen',
                        params: selectedOrder
                    })
                }else navigation.navigate('AccueilNavigator', {screen: routes.HOME})
            }else {
                params = {type: 'order', orderId: responseData.data.orderId}
                dispatch(getLogout())
                navigation.navigate('AccueilNavigator',{screen :routes.LOGIN, params})
            }
        }
        if(notifType === 'parrainage') {
            const moreInfo = responseData.data.info
            if(isConnected) {
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
                        navigation.navigate(routes.HOME)
                }
            }else {
                dispatch(getLogout())
                params = {type: 'parrainage', moreInfo}
                navigation.navigate('AccueilNavigator',{screen :routes.LOGIN, params})
            }
            if(notifType === 'facture') {
                if(isConnected) {
                    const selectedFacture = allFacture.find(facture => facture.id === responseData.data.factureId)
                    if(selectedFacture) {
                        navigation.navigate('AccueilNavigator', {
                            screen: 'FactureDetailsScreen',
                            params: selectedFacture
                        })
                    }else navigation.navigate('AccueilNavigator', {screen: routes.HOME})
                }else {
                    params = {type: 'facture', factureId: responseData.data.factureId}
                    dispatch(getLogout())
                    navigation.navigate('AccueilNavigator',{screen :routes.LOGIN, params})
                }
            }
        }
    }

    return {registerForPushNotificationsAsync, handleReceivedNotification}
}