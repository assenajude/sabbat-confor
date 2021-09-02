import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {View, FlatList} from "react-native";

import {
  getOrdersByUser
} from "../store/slices/orderSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";
import GetLogin from "../components/user/GetLogin";
import UserOrderItem from "../components/list/UserOrderItem";
import useAuth from "../hooks/useAuth";
import {getUserCompterReset} from "../store/slices/userProfileSlice";


function UserOrderContratScreen() {
    const dispatch = useDispatch()
    const {dataSorter} = useAuth()

    const isLoading = useSelector(state => state.entities.order.loading)
    const listArticleContrat = useSelector(state => state.entities.order.listArticles)
    const error = useSelector(state => state.entities.order.error)
    const user = useSelector(state => state.auth.user)
    const userData = useSelector(state => state.profile.connectedUser)
    const articleRefresh = useSelector(state => state.entities.order.articleRefreshCompter)
    const localContratList = listArticleContrat.filter(item => item.Contrats.length>0 && !item.historique)




    useEffect(() => {
        if(articleRefresh>0 || userData.articleCompter>0) {
            dispatch(getOrdersByUser())
            dispatch(getUserCompterReset({userId: user.id, articleCompter: true}))
        }
    }, [])

    if(!user) {
        return <GetLogin message='Veuillez vous connecter pour consulter vos articles..'/>
    }

    if (error !== null) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Erreur...Impossible de consulter vos contrats. Veillez reessayer plutard.</AppText>
            </View>
        )
    }


    return (
        <>
        <AppActivityIndicator visible={isLoading}/>
       {localContratList.length > 0 && !isLoading && error === null &&
       <FlatList data={dataSorter(localContratList)} keyExtractor={(item, index) => item.id.toString()}
           renderItem={({item}) =>
               <UserOrderItem
                   order={item}
                   header='A'
                   isContrat={true}
               />
           }/>}
            {localContratList.length === 0 && !isLoading && error === null &&
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Vous n'avez pas de contrats de commande en cours...</AppText>
            </View> }
            </>
    );
}

export default UserOrderContratScreen;