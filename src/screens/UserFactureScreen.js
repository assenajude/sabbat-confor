import React, {useCallback, useEffect, useState} from 'react';
import {View,FlatList} from "react-native";
import {useSelector, useDispatch, useStore} from "react-redux";

import {
    getFacturesByUser
} from '../store/slices/factureSlice'
import FactureListItem from "../components/list/FactureListItem";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";
import {getUserCompterReset} from "../store/slices/userProfileSlice";
import {getTranches} from "../store/slices/trancheSlice";

function UserFactureScreen({navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const {userRoleAdmin, dataSorter} = useAuth()
    const user = useSelector(state => state.auth.user)
    const connectedUser = useSelector(state => state.profile.connectedUser)
    const [factureLoading, setFactureLoading] = useState(false)
    const userFactures = useSelector(state => {
        let newFactures = []
        const user = state.auth.user
        const factures = state.entities.facture.list
        if(userRoleAdmin()) {
            newFactures = factures
        }else{
            newFactures = factures.filter(item => item.Commande.UserId === user.id)
        }
        return dataSorter(newFactures)
    })

    const getUserFactures = useCallback(async () => {
        setFactureLoading(true)
            await dispatch(getFacturesByUser())
            await dispatch(getTranches())
        setFactureLoading(false)
            const error = store.getState().entities.facture.error
            if(error !== null) return;
            dispatch(getUserCompterReset({userId: user.id, factureCompter: true}))
    }, [])

    useEffect(() => {
        if(Object.keys(connectedUser.length>0) || connectedUser.factureCompter > 0) {
            getUserFactures()
        }
    }, [])



    if(user && userFactures.length >=1) {
       return (
           <>
               <AppActivityIndicator visible={factureLoading}/>
               <View style={{bottom: 20}}>
           <FlatList data={userFactures} keyExtractor={item => item.id.toString()}
                    renderItem={({item}) =>
                        <FactureListItem facture={item}/>
                    } />
               </View>
                    </>
       )
    } else if (user && userFactures.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <AppText>Vous n'avez aucune facture enregistrée...</AppText>
            </View>

        )
    } else {
        return (
            <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                <AppText>Vous devez vous connecter pour voir vos factures..</AppText>
                <AppButton title='Se connecter' onPress={() => navigation.navigate('AccueilNavigator', {screen: routes.LOGIN})}/>
            </View>
        )
    }


}

export default UserFactureScreen;