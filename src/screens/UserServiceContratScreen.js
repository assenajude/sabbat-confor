import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {View, FlatList} from "react-native";


import {getOrdersByUser
} from "../store/slices/orderSlice";
import AppText from "../components/AppText";
import AppActivityIndicator from "../components/AppActivityIndicator";
import GetLogin from "../components/user/GetLogin";
import {getUserCompterReset} from "../store/slices/userProfileSlice";
import useAuth from "../hooks/useAuth";
import UserOrderItem from "../components/list/UserOrderItem";

function UserServiceContratScreen() {
    const dispatch = useDispatch()
    const {dataSorter} = useAuth()
    const isLoading = useSelector(state => state.entities.order.loading)
    const userData = useSelector(state => state.profile.connectedUser)
    const error = useSelector(state => state.entities.order.error)
    const user  = useSelector(state => state.auth.user)
    const userServicesData = useSelector(state => state.entities.order.listServices)
    const serviceRefresh = useSelector(state => state.entities.order.serviceRefreshCompter)
    const localServices = userServicesData.filter(item => item.Contrats.length>0 && !item.historique)





    useEffect(() => {
        if(serviceRefresh>0 || userData.serviceCompter>0) {
            dispatch(getOrdersByUser())
            dispatch(getUserCompterReset({userId: user.id, serviceCompter: true}))
        }
    }, [])

    if(!user) {
        return <GetLogin message='Veuillez vous connecter pour consulter vos services..'/>
    }


    if(error !== null) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Impossible de consulter vos services.Une erreur est apparue...</AppText>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            {!isLoading && error === null && localServices.length > 0 &&
            <FlatList data={dataSorter(localServices)} keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => {
                              return (
                                  <UserOrderItem
                                      header='S'
                                      order={item}
                                      isHistorique={false}
                                      isContrat={true}
                                  />
                              )

                      }}/>}
            {!isLoading && error === null && localServices.length === 0 && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Vous n'avez aucun contrat de service en cours...</AppText>
            </View>}
        </>
    );
}

export default UserServiceContratScreen;