import React, {useState, useRef, useEffect} from 'react';
import {StatusBar, View} from 'react-native'
import authStorage from "./src/store/persistStorage";
import {autoLoginUser,getLogout} from "./src/store/slices/authSlice";
import AppLoading from "expo-app-loading";
import {NavigationContainer} from "@react-navigation/native";
import * as Notifications from 'expo-notifications'
import UserCompteNavigation from "./src/navigation/UserCompteNavigation";
import OfflineNotice from "./src/components/OfflineNotice";
import {useDispatch} from "react-redux";
import useAuth from "./src/hooks/useAuth";
import useNotification from "./src/hooks/useNotification";
import {navigationRef} from './src/navigation/routeNavigation'
import LottieView from 'lottie-react-native'
import colors from "./src/utilities/colors";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});
function AppWrapper(props) {
    const dispatch = useDispatch()
    const {resetConnectedUserData, initUserDatas, getStarted: getData} = useAuth()
    const {handleReceivedNotification} = useNotification()

    const [isReady, setIsReady] = useState(false)
    const [notification,setNotification] = useState(false)
    const notificationListener = useRef();
    const responseListener = useRef();

    const getStarted = async () => {
        const user = await authStorage.getUser();
        await getData()
        if (user !== null) {
            await dispatch(autoLoginUser(user))
            await initUserDatas()
        } else {
            await dispatch(getLogout())
            resetConnectedUserData()
        }
    }

    const handleReceivedListener = (notification) => {
        setNotification(notification)
    }

    const handleNotificationResponse = (response) => {
        handleReceivedNotification(response.notification.request.content)
    }

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener(handleReceivedListener);
        responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, [])

    if(!isReady) {
        return (
        <>
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.blanc
            }}>
                <LottieView
                    autoPlay={true}
                    loop={true}
                    source={require('./assets/animations/loading')}
                    style={{
                    height: 100,
                    width: 200
                }}/>
            </View>
        <AppLoading
            startAsync={getStarted}
            onFinish={() => setIsReady(true)} onError={(error) =>{
            throw new Error(error)
        }}/>
        </>
        )
    }

    return (
        <>
            <StatusBar
                style='auto'
                backgroundColor="#860432"
                barStyle='light-content'
            />
            <NavigationContainer ref={navigationRef}>
                <UserCompteNavigation/>
            </NavigationContainer>
                <OfflineNotice noInternetContainer={{
                    position: 'absolute',
                    bottom: 0
                }}/>
        </>
    );
}

export default AppWrapper;