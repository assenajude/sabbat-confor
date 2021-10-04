import React, {useEffect, useCallback} from 'react';
import {useSelector, useDispatch, useStore} from "react-redux";
import {View, FlatList} from "react-native";

import {getOrdersByUser} from '../store/slices/orderSlice'
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import GetLogin from "../components/user/GetLogin";
import AppActivityIndicator from "../components/AppActivityIndicator";
import UserOrderItem from "../components/list/UserOrderItem";
import {getUserCompterReset} from "../store/slices/userProfileSlice";
import useAuth from "../hooks/useAuth";

function UserOrderScreen({navigation}) {
    const dispatch  = useDispatch()
    const store = useStore()
    const {dataSorter} = useAuth()
    const connectedUser = useSelector(state => state.profile.connectedUser)
    const userArticleDemande = useSelector(state => state.entities.order.listArticles)
    const error = useSelector(state => state.entities.order.error)
    const user = useSelector(state => state.auth.user)
    const isLoading = useSelector(state => state.entities.order.loading)
    const localDemandeList = userArticleDemande.filter(item => item.Contrats.length === 0 && !item.historique)

    const getOrderStarted = useCallback(async () => {
        if(connectedUser.articleCompter > 0) {
            await dispatch(getOrdersByUser())
            const error = store.getState().entities.order.error
            if(error !== null) return;
            dispatch(getUserCompterReset({userId: user.id, articleCompter: true}))
        }
    }, [])



    useEffect(() => {
        getOrderStarted()
    }, [])

    if(!user) {
        return <GetLogin message='Connectez vous pour consulter vos demandes'/>
    }


    if(error !== null) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Erreur...Impossible de consulter vos demandes.Veuillez reessayer plutard.</AppText>
        </View>
    }



    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
           {localDemandeList.length > 0 && error === null && !isLoading &&
           <FlatList data={dataSorter(localDemandeList)} keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) =>
           <UserOrderItem
               order={item}
               header='A'
               isDemande={true}
              />
       }/>}
            {localDemandeList.length === 0 && !isLoading && error === null && <View style={{
                flex: 1, justifyContent: 'center', alignItems: 'center',
            }}>
                <AppText>Vous n'avez aucune demande en cours..</AppText>
                <AppButton
                    style={{
                        marginVertical: 20,
                        width: 300
                    }}
                    title='Commander maintenant' onPress={() => navigation.navigate('E-commerce')}/>
            </View>}
       </>
    );
}

export default UserOrderScreen;