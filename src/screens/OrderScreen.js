import React, {useState} from 'react';
import {useSelector, useDispatch, useStore} from 'react-redux'
import {View, Text, StyleSheet, Alert, ScrollView} from 'react-native'

import Color  from '../utilities/colors'
import FinalOrderItem from "../components/order/FinalOrderItem";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import {makeOrder, getFinalOrderDetails, getOrderReset} from '../store/slices/orderSlice'
import {getCurrentPlanDetail, getResetPayement} from '../store/slices/payementSlice'
import {getAdresseReset, getOrderAdresseDetails} from '../store/slices/userAdresseSlice'
import AppActivityIndicator from "../components/AppActivityIndicator";
import OrderItemDetails from "../components/order/OrderItemDetails";
import AppLabelWithValue from "../components/AppLabelWithValue";
import {getCartClear} from "../store/slices/shoppingCartSlice";
import {getUserVilleReset} from "../store/slices/villeSlice";
import usePlaceOrder from "../hooks/usePlaceOrder";
import AppModePayement from "../components/AppModePayement";
import ParrainageHeader from "../components/parrainage/ParrainageHeader";
import useAuth from "../hooks/useAuth";
import {getConnectedUserData} from "../store/slices/userProfileSlice";
import {loadArticles} from "../store/slices/articleSlice";
import {getAllLocation} from "../store/slices/locationSlice";
import {getServices} from "../store/slices/serviceSlice";
import {getAllMainData} from "../store/slices/mainSlice";
import OrderSuccessModal from "../components/order/OrderSuccessModal";

function OrderScreen({navigation}) {
    const store = useStore()
    const dispatch = useDispatch();
    const {formatPrice} = useAuth()
    const {getTotal,getShippingRate, getPayementRate, getTauxPercent} = usePlaceOrder()

    const selectedPayemet = useSelector(state => state.entities.payement.selectedPayement)
    const currentPlan = useSelector(state => state.entities.payement.currentPlan);
    const currentOrder = useSelector(state => state.entities.order.currentOrder);
    const selectedAdesse = useSelector(state => state.entities.userAdresse.selectedAdresse)
    const selectedAdesseRelais = useSelector(state => state.entities.userAdresse.adresseRelais)
    const serviceDate = useSelector(state => state.entities.order.servicePayementDate)
    const loading = useSelector(state => state.entities.order.loading)
    const selectedParrains = useSelector(state => state.entities.order.currentOrderParrains)
    const [successVisible, setSuccessVisible] = useState(false)
    const [newAdded, setNewAdded] = useState({})

    const resetOrder = async () => {
        dispatch(getCartClear())
        dispatch(getOrderReset())
        dispatch(getAdresseReset())
        dispatch(getResetPayement())
        dispatch(getUserVilleReset())
        dispatch(getConnectedUserData())
        await dispatch(getAllMainData())
        dispatch(loadArticles())
        dispatch(getAllLocation())
        dispatch(getServices())
    }

    const saveOrder = async () => {
        let adresseId;
        if(selectedAdesse) {
            adresseId = selectedAdesse.id
        }
        let livraisonDate;
        let dateNow = new Date()
        const dateOfNow = dateNow.getDate()
        dateNow.setDate(dateOfNow+3)
        if(currentOrder.type === 'service') {
            livraisonDate = serviceDate
        } else {
            livraisonDate = dateNow.getTime()
        }

        const order = {
            userAdresseId: adresseId,
            planId: currentPlan.id,
            items: currentOrder.items,
            itemsLength: currentOrder.itemsLenght,
            interet: getPayementRate(),
            fraisTransport: getShippingRate(),
            montant: getTotal(),
            dateLivraisonDepart:livraisonDate,
            typeCmde: currentOrder.type
        }
         await dispatch(makeOrder({order, parrains:selectedParrains}))
        const error =  store.getState().entities.order.error
        if(error !== null) {
            Alert.alert('Echec!!', 'Impossible de faire la commande maintenant', [
                {text: 'ok', onPress: () => navigation.navigate(routes.HOME)}
            ], {cancelable: false})
        } else {

            const newAdded = store.getState().entities.order.newAdded
            setNewAdded(newAdded)
            setSuccessVisible(true)
        }
    }

    const handleGoToOrder = async () => {
        setSuccessVisible(false)
        await resetOrder()
        if(newAdded.typeCmde === 'article') {
            navigation.navigate(routes.USER_ORDER)
        }else if(newAdded.typeCmde === 'location') {
            navigation.navigate(routes.USER_LOCATION)
        }else {
            navigation.navigate(routes.USER_SERVICE)
        }
    }

    return (
        <>
            <AppActivityIndicator visible={loading}/>
            {Object.keys(currentOrder).length === 0 &&
            <View style={styles.emptyStyle}>
                <Text>Aucune commande encours. Vous pouvez faire des achats</Text>
                </View>}
                {Object.keys(currentOrder).length>0 && <>
                    <View style={styles.container}>
                            <View style={styles.header}>
                                <View>
                                    <AppModePayement modePayement={selectedPayemet.mode}/>
                                </View>
                                <View style={{width: '80%'}}>
                                    <AppText style={{color: Color.blanc}}>Veuillez verifier les details de votre commande puis finaliser</AppText>
                                </View>
                            </View>
                        <ScrollView contentContainerStyle={{
                            paddingBottom: 50
                        }}>
                            <View>
                                {selectedPayemet.mode.toLowerCase() === 'credit' && <View>
                                    <View style={{backgroundColor: Color.rougeBordeau, alignSelf: 'center'}}>
                                        <AppText style={{color: Color.blanc}}>Option de couverture</AppText>
                                    </View>
                                    <AppText style={{color: Color.or, fontWeight: 'bold'}}>{selectedParrains.length>0?'Parrainage':'Seuil de fidelité'}</AppText>
                                    {selectedParrains.length>0 && <View>
                                        {selectedParrains.map((item, index) => <View key={item.id.toString()} style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            padding: 10
                                        }}>
                                            <ParrainageHeader
                                                parrainUser={item.User}
                                                ownerUsername={item.User.username}
                                                ownerEmail={item.User.email}
                                                action={formatPrice(item.parrainAction)}
                                            />
                                        </View>)}
                                    </View>}
                                </View>}
                            </View>
                           {currentOrder.type === 'location' &&
                           <FinalOrderItem  header="Location" label1={currentOrder.items[0].libelle}
                                            label2='Montant: ' label2Value={currentOrder.amount}
                                            label4='Part total caution: ' detailsInfo={currentOrder.showDetails}
                                            getOrderItemDetails={() => dispatch(getFinalOrderDetails())}>
                               <OrderItemDetails quantite={currentOrder.items[0].quantite} montant={currentOrder.items[0].montant}
                                                 imageSource={{uri: currentOrder.items[0].image}} libelle={currentOrder.items[0].libelle}/>
                                                 <View>
                                                     <AppLabelWithValue label={`Coût ${currentOrder.items[0].frequence}`} labelValue={currentOrder.items[0].prix} secondLabel='fcfa'/>
                                                     <AppLabelWithValue label='Caution' labelValue={currentOrder.items[0].caution} secondLabel={currentOrder.items[0].frequence.toLowerCase() === 'mensuelle'?'Mois':'Jour(s)'}/>
                                                 </View>
                           </FinalOrderItem>}

                            {currentOrder.type === 'service' &&
                            <FinalOrderItem header="Service" label1={currentOrder.items[0].libelle}
                                            label2='Montant: ' label2Value={currentOrder.amount} detailsInfo={currentOrder.showDetails}
                                            getOrderItemDetails={() => dispatch(getFinalOrderDetails())}>

                                <View>
                                    <OrderItemDetails imageSource={{uri: currentOrder.items[0].image}} quantite={currentOrder.items[0].quantite}
                                                      montant={currentOrder.items[0].montant} libelle={currentOrder.items[0].libelle}/>
                                </View>
                            </FinalOrderItem>}

                           {currentOrder.type === 'article' &&
                                     <FinalOrderItem header='Commande' label1= "Nombre d'articles: " label1Value={currentOrder.itemsLenght}
                                                      label2='Montant: ' label2Value={currentOrder.amount}
                                                     detailsInfo={currentOrder.showDetails} getOrderItemDetails={() => dispatch(getFinalOrderDetails())
                                                     }>
                                         <View>
                                            {currentOrder.items.map(item => <OrderItemDetails key={item.id.toString()} libelle={item.libelle} imageSource={{uri: item.image}}
                                                                                              quantite={item.quantite} montant={item.montant}/>)}
                                         </View>

                                    </FinalOrderItem>}

                            <FinalOrderItem  header='Mode de payement' label1='Mode: ' label1Value={selectedPayemet.mode}
                            label2={`Taux d'interet (${getTauxPercent()}%): `} label2Value={getPayementRate()} label3='Plan: '
                                            label3Value={currentPlan.libelle} changeLabel3={() => navigation.navigate(routes.ORDER_PAYEMENT)} label4='Description:' label4Value={currentPlan.descripPlan}
                                             detailsInfo={currentPlan.CurrentPlanDetail} isPayement={true} getOrderItemDetails={() => dispatch(getCurrentPlanDetail())}>
                                <View>
                                    <AppText>{currentPlan.descripPlan}</AppText>
                                </View>
                            </FinalOrderItem>

                         { currentOrder.type === 'article' && <FinalOrderItem header='Livraison' label1='Agence de retrait: ' label1Value={selectedAdesseRelais.nom}
                                        label2='Coût: ' label2Value={getShippingRate()}
                                        label3='Votre contact: ' label3Value={selectedAdesse.nom} changeLabel3={() => navigation.navigate(routes.ORDER_LIVRAISON)} label4="Plus d'infos: "
                                         label4Value={selectedAdesse.tel} detailsInfo={selectedAdesse.showDetails} getOrderItemDetails={() => dispatch(getOrderAdresseDetails())}>
                             <View>
                                 <AppLabelWithValue label='Tel: ' labelValue={selectedAdesse.tel}/>
                                 <AppLabelWithValue label='E-mail: ' labelValue={selectedAdesse.email}/>
                                 <AppLabelWithValue label='Autres adresses: ' labelValue={selectedAdesse.adresse}/>
                             </View>
                         </FinalOrderItem>}

                            <View style={styles.totalFinal}>
                                <AppText style={{fontSize: 20, fontWeight: 'bold'}}>Montant total TTC: </AppText>
                                <AppText style={{color: Color.rougeBordeau, fontSize: 20, fontWeight: 'bold'}}>{formatPrice(getTotal())}</AppText>
                            </View>
                             <AppButton
                                 onPress={saveOrder}
                                 style={styles.finalButton}
                                 title='Finaliser votre demande'/>
                        </ScrollView>
                         </View>
                </>}
            <OrderSuccessModal
                goHome={async () => {
                    setSuccessVisible(false)
                    await resetOrder()
                    navigation.navigate(routes.HOME)
                }}
                goToOrder={handleGoToOrder}
                newOrder={newAdded}
                orderSuccessVisible={successVisible}/>
            </>
        );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    emptyStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    listFooterStyle: {
        backgroundColor: Color.rougeBordeau,
        padding: 10,
        marginTop: 30,
        marginBottom: 50,
        left: '25%'

    },
    header: {
        alignItems: 'center',
        backgroundColor: Color.rougeBordeau,
        flexDirection: 'row',
        height: 80,
        paddingRight: 20,
        marginBottom: 20
    },
    finalButton: {
        alignSelf: 'center',
        marginVertical: 40,
    },
    totalFinal: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderWidth: 1,
        width: '90%',
        alignSelf: 'center',
        margin: 30,
        padding: 10,
        borderRadius: 10,
        backgroundColor: Color.blanc
    },
    commandeModal: {
        flexDirection: 'row',
        marginBottom: 20
    },
    factureModal: {
        flexDirection: 'row',
        marginBottom: 20
    },
    modalButton: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    modalContainer: {
        flex:1,
        justifyContent: 'space-around',
    },
    modalHeader: {
        alignSelf: 'flex-start'
    },
})
export default OrderScreen;