import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {View, FlatList} from "react-native";
import {
    getOrdersByUser,
} from "../store/slices/orderSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";
import GetLogin from "../components/user/GetLogin";
import UserOrderItem from "../components/list/UserOrderItem";
import {getUserCompterReset} from "../store/slices/userProfileSlice";
import useAuth from "../hooks/useAuth";

function UserLocationContratScreeen() {
    const dispatch = useDispatch()
    const {dataSorter} = useAuth()

    const isLoading = useSelector(state => state.entities.order.loading)
    const locationDatas = useSelector(state => state.entities.order.listLocations)
    const error = useSelector(state => state.entities.order.error)
    const user = useSelector(state => state.auth.user)
    const localList = locationDatas.filter(item => item.Contrats.length>0 && !item.historique)
    const locationRefreshCompter = useSelector(state => state.entities.order.locationRefreshCompter)
    const connectedUserProfile = useSelector(state => state.profile.connectedUser)



    useEffect(() => {
        if(locationRefreshCompter>0 || connectedUserProfile.locationCompter>0) {
            dispatch(getOrdersByUser())
            dispatch(getUserCompterReset({userId: user.id, locationCompter: true}))
        }
    }, [])

    if (!user) {
        return <GetLogin message='Vous devez vous connecter pour consulter vos locations'/>
    }


    if(error !== null) {
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Impossible de consulter vos locations.Une erreur est apparue..</AppText>
        </View>
    }



    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            {!isLoading && error === null && localList.length> 0 &&
            <FlatList data={dataSorter(localList)} keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => {
                              return (
                                  <UserOrderItem
                                      order={item}
                                      isContrat={true}
                                      header='L'
                                  />
                              )

                      }}/>}
            {!isLoading && error === null && localList.length === 0 && <View style={{
                flex:1,
                justifyContent: 'center',
                alignItems: 'center'}
            }>
                <AppText>Vous n'avez pas de contrat de location en cours...</AppText>
            </View>}
           </>
    )
}

export default UserLocationContratScreeen;