import React from 'react';
import {View, FlatList} from "react-native";
import AppText from "../components/AppText";
import {useSelector } from "react-redux";
import GetLogin from "../components/user/GetLogin";
import useAuth from "../hooks/useAuth";
import UserOrderItem from "../components/list/UserOrderItem";

function UserServiceHistoryScreen() {
    const {dataSorter} = useAuth()
    const userServicesData = useSelector(state => state.entities.order.listServices)
    const error = useSelector(state => state.entities.order.error)
    const isLoading = useSelector(state => state.entities.order.loading)
    const user = useSelector(state => state.auth.user)
    const localHistoriqueServices = userServicesData.filter(item => item.historique === true)


    if(!user) {
        return <GetLogin message='Connectez vous pour voir votre historique..'/>
    }

    if (error !== null) {
        return <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <AppText>Impossible de consulter votre historique. Une erreur est apparue..</AppText>
        </View>
    }

    return (
        <>
        {!isLoading && error === null && localHistoriqueServices.length > 0 &&
        <FlatList data={dataSorter(localHistoriqueServices)} keyExtractor={(item, index) => index.toString()}
                 renderItem={({item}) => {
                         return (
                             <UserOrderItem
                                 header='S'
                                 isDemande={false}
                                 isHistorique={true}
                                 order={item}
                             />
                         )
                 }}/>}
            {!isLoading && error === null && localHistoriqueServices.length === 0 && <View style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Votre historique est vide...</AppText>
            </View>}
                 </>
    );
}

export default UserServiceHistoryScreen;