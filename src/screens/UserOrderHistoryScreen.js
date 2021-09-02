import React, { useEffect} from 'react';
import {useSelector} from "react-redux";
import {View, FlatList} from "react-native";
import AppText from "../components/AppText";
import GetLogin from "../components/user/GetLogin";
import UserOrderItem from "../components/list/UserOrderItem";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";

function UserOrderHistoryScreen() {
    const {dataSorter} = useAuth()

    const orderHistoryArticle = useSelector(state => state.entities.order.listArticles)
    const error = useSelector(state => state.entities.order.error)
    const loading = useSelector(state => state.entities.order.loading)
    const user = useSelector(state => state.auth.user)
    let localHistoryList = orderHistoryArticle.filter(item => item.historique === true)


    useEffect(() => {
    },[localHistoryList])

    if(!user) {
        return <GetLogin message='Connectez vous pour voir votre historique'/>
    }

    if(error !== null) {
        return <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'}
        }>
            <AppText>Erreur...Impossible de consulter vos historiques.Veuilez reessayer plutard</AppText>
        </View>
    }


    return (
        <>
            <AppActivityIndicator visible={loading}/>
            {error === null && localHistoryList.length > 0 && !loading &&
            <FlatList data={dataSorter(localHistoryList)} keyExtractor={(item, index) => item.id.toString()}
               renderItem={({item}) => {
                       return (
                           <UserOrderItem
                               order={item}
                               header='A'
                               isHistorique={true}
                           />
                       )
               }} />}
            {error === null && localHistoryList.length === 0 && !loading && <View style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Vous n'avez pas de commandes dans votre historique.</AppText>
            </View>}
            </>
    );
}

export default UserOrderHistoryScreen;