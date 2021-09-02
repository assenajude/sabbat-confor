import React from 'react';
import {View, StyleSheet, ScrollView} from "react-native";
import {useDispatch, useSelector, useStore} from "react-redux";
import ParrainageEncoursItem from "../components/parrainage/ParrainageEncoursItem";
import {getSponsorDetails} from "../store/slices/parrainageSlice";
import routes from "../navigation/routes";
import useOrderInfos from "../hooks/useOrderInfos";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import useAuth from "../hooks/useAuth";
import useParrainage from "../hooks/useParrainage";
import {getSelectedOrder} from "../store/slices/orderSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

function UserParrainageScreen({navigation}) {
    const {getLastCompteFactureProgress} = useOrderInfos()
    const {formatPrice} = useAuth()
    const {getInvestissement, getTotalGain, getRestituteInvest, getFilleulOrders} = useParrainage()
    const dispatch = useDispatch()
    const store = useStore()

    const loading = useSelector(state => state.entities.order.loading)
    const userActiveParrainage = useSelector(state => {
        const filleuls = state.entities.parrainage.userFilleuls
        const inSponsoringComptes = state.entities.parrainage.inSponsoringState
        const activeParrainage = filleuls.filter(compte => inSponsoringComptes.some(item => item.id === compte.UserId))
        return activeParrainage
    })

    const handleGetOrder = async (order) => {
        await dispatch(getSelectedOrder({orderId: order.id}))
        const error = store.getState().entities.order.error
        if(error !== null) {
            return alert("Ne n'avons pas pu obtenir les details de cette commande.")
        }
        const selected = store.getState().entities.order.selectedOrder
        navigation.navigate('AccueilNavigator', {screen: routes.ORDER_DETAILS, params: {...selected, payement: 'CREDIT'}})
    }

    if(userActiveParrainage.length === 0){
        return <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <AppText>Aucun parrainage trouvé</AppText>
        </View>
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
        <ScrollView contentContainerStyle={{
            paddingVertical: 30,
            paddingBottom: 60
        }}>
            <View style={styles.fundContainer}>
                <AppText style={{fontWeight: 'bold'}}>Total investissement</AppText>
                <View style={styles.fundContent}>
                    <AppText style={{fontSize: 20, fontWeight: 'bold'}}>{formatPrice(getInvestissement())}</AppText>
                </View>
            </View>
            <View style={styles.fundContainer}>
                <AppText style={{fontWeight: 'bold'}}>Total remboursé</AppText>
                <View style={styles.fundContent}>
                    <AppText style={{fontSize: 20, fontWeight: 'bold'}}>{formatPrice(getRestituteInvest().restituteQuotite)}</AppText>
                </View>
            </View>
            <View style={styles.fundContainer}>
                <AppText style={{fontWeight: 'bold'}}>Total gain</AppText>
                <View style={styles.fundContent}>
                    <AppText style={{fontSize: 15, fontWeight: 'bold', color: colors.vert}}>{formatPrice(getRestituteInvest().actuGain)} / {formatPrice(getTotalGain())}</AppText>
                </View>
            </View>
            <View>
                {userActiveParrainage.map((filleul) =>
                    <ParrainageEncoursItem
                        parrainUser={filleul.User}
                        getOrderDetails={handleGetOrder}
                       key={filleul.id.toString()}
                       ownerUsername={filleul.User.username}
                       ownerEmail={filleul.User.email}
                       sponsorDetails={filleul.sponsorDetails}
                       getUserProfile={() => navigation.navigate(routes.COMPTE, filleul.User)}
                       openSponsorDetails={() => dispatch(getSponsorDetails(filleul))}
                       parrainageOrders={getFilleulOrders(filleul)}
                       orderProgress={getLastCompteFactureProgress(filleul)>0?getLastCompteFactureProgress(filleul): 0}
                       showProgress={getLastCompteFactureProgress(filleul)?getLastCompteFactureProgress(filleul)>0:false}
                    />)}
            </View>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    fundContainer: {
        backgroundColor: colors.leger,
        width: '90%',
        height: 150,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginVertical: 5
    },
    fundContent: {
        backgroundColor: colors.blanc,
        height: 100,
        width: '85%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    }

})
export default UserParrainageScreen;