import React from 'react';
import {useSelector} from "react-redux";
import {View, FlatList} from "react-native";
import AppText from "../components/AppText";
import GetLogin from "../components/user/GetLogin";
import UserOrderItem from "../components/list/UserOrderItem";
import useAuth from "../hooks/useAuth";

function UserLocationHistoryScreen() {
    const {dataSorter} = useAuth()
    const locationHistory = useSelector(state => state.entities.order.listLocations)
    const error = useSelector(state => state.entities.order.error)
    const isLoading = useSelector(state => state.entities.order.loading)
    const user = useSelector(state => state.auth.user)
    const localHistoriqueList = locationHistory.filter(item => item.historique === true)


    if(!user) {
        return <GetLogin message='Veuillez vous connecter pour voir votre historique..'/>
    }

    return (
        <>
        {!isLoading && error === null && localHistoriqueList.length> 0 &&
        <FlatList data={dataSorter(localHistoriqueList)} keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => {
                          return <UserOrderItem
                              order={item}
                              header='L'
                              isHistorique={true}
                          />
                  }}/>}
            {!isLoading && error === null && localHistoriqueList.length === 0 && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'}
            }>
                <AppText>Vous n'avez pas de commandes dans votre historique</AppText>
            </View> }
                  </>

    );
}

export default UserLocationHistoryScreen;