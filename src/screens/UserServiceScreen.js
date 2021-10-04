import React from 'react';
import {useSelector} from "react-redux";
import {View, FlatList} from "react-native";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import GetLogin from "../components/user/GetLogin";
import AppActivityIndicator from "../components/AppActivityIndicator";
import useAuth from "../hooks/useAuth";
import UserOrderItem from "../components/list/UserOrderItem";

function UserServiceScreen({navigation}) {
    const {dataSorter} = useAuth()
    const error = useSelector(state => state.entities.order.error)
    const isLoading = useSelector(state => state.entities.order.loading)
    const userServices = useSelector(state => state.entities.order.listServices)
    const user = useSelector(state => state.auth.user)
    const localDemandeList = userServices.filter(item => item.Contrats.length === 0 && !item.historique)


    if(!user) {
        return <GetLogin message='Connectez vous pour consulter vos demandes'/>
    }

    if(error !== null) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Impossible de consulter vos demandes de service..Une erreur est apparue.</AppText>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
       {!isLoading && error === null && localDemandeList.length > 0 &&
       <FlatList data={dataSorter(localDemandeList)} keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => {
                          return (
                              <UserOrderItem
                                   header='S'
                                  isHistorique={false}
                                  isDemande={true}
                                  order={item}
                              />
                          )

                  } }/>}
            {!isLoading && error === null && localDemandeList.length === 0 &&
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Vous n'avez pas demande de service en cours..</AppText>
                <AppButton
                    style={{
                        marginVertical: 20,
                        width: 300
                    }}
                    title='Demander maintenant'
                    onPress={() => navigation.navigate('E-service')}/>
                </View>}
                  </>
    );
}

export default UserServiceScreen;