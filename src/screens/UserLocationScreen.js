import React from 'react';
import {useSelector} from "react-redux";
import {View, FlatList} from "react-native";

import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import GetLogin from "../components/user/GetLogin";
import AppActivityIndicator from "../components/AppActivityIndicator";
import UserOrderItem from "../components/list/UserOrderItem";
import useAuth from "../hooks/useAuth";

function UserLocationScreen({navigation}) {
    const {dataSorter} = useAuth()
    const userLocations = useSelector(state => state.entities.order.listLocations)
    const isLoading = useSelector(state => state.entities.order.loading)
    const error = useSelector(state => state.entities.order.error)
    const user = useSelector(state => state.auth.user)
    const localLocationList = userLocations.filter(item => item.Contrats.length === 0 && !item.historique)




    if(!user) {
        return <GetLogin message='Veuillez vous connecter pour voir vos demandes de locations.'/>
    }


    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        {!isLoading && localLocationList.length> 0 && error === null &&
        <FlatList data={dataSorter(localLocationList)} keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => {
                          return (
                              <UserOrderItem
                                  order={item}
                                  header='L'
                                  isDemande={true}
                              />
                          )

                  }}  />}
            {!isLoading && error === null && localLocationList.length === 0 && <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: 'center'}
            }>
                <AppText>Vous n'avez pas de demandes de location en cours</AppText>
                <AppButton
                    textStyle={{fontSize: 15}}
                    width={200}
                    title='Commander maintenant'
                    onPress={() => navigation.navigate('E-location')}/>
            </View>}
                  </>
    );
}

export default UserLocationScreen;