import React, {useEffect, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Image} from "react-native";
import AppText from "../AppText";
import colors from "../../utilities/colors";
import ContratWatch from "../order/ContratWatch";
import ListItemHeader from "./ListItemHeader";
import AppLabelWithValue from "../AppLabelWithValue";
import AppModePayement from "../AppModePayement";
import StatusPicker from "../order/StatusPicker";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";
import useOrderInfos from "../../hooks/useOrderInfos";
import initData from "../../utilities/initData";
import useManageUserOrder from "../../hooks/useManageUserOrder";
import routes from "../../navigation/routes";
import {useNavigation} from '@react-navigation/native'
import {getItemDetail} from "../../store/slices/orderSlice";
import {useDispatch, useStore} from "react-redux";
import {getSelectedFacture} from "../../store/slices/factureSlice";
import AppActivityIndicator from "../AppActivityIndicator";
import AppLabelWithContent from "../AppLabelWithContent";
import AppButton from "../AppButton";

function UserOrderItem({order, header,isDemande,
                           isContrat,isHistorique
                       }) {
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const store = useStore()
    const {formatDate, formatPrice} = useAuth()
    const {getModePayement} = useOrderInfos()
    const {saveAccordEdit,saveLivraisonEdit,
        createOrderContrat, moveOrderToHistory,
        deleteOrder, getOrderExpirationState, secsToTime} = useManageUserOrder()
    const modePayement = getModePayement(order.id)
    const statusAccordValue = order.statusAccord
    const accordInitData = initData.accordData
    const orderItems = order.CartItems
    const showDetail = order.showDetails
    const isExpired = order.isExpired
    const playItemWatch = order.Contrats[0]?.status.toLowerCase() === 'en cours'
    const loopItemWatch = order.Contrats[0]?.status.toLowerCase() === 'en cours'
    const livraisonValue = order.statusLivraison
    const typeCmde = order.typeCmde
    const showDeleteIcon = order.montant === order.Facture?.solde
    const contrats= order.Contrats

    const [accordExpirationDate, setAccordExpirationDate] = useState(getOrderExpirationState(order))
    const [visible, setVisible] = useState(false)

    const handleGetFacture = async () => {
        setVisible(true)
        await dispatch(getSelectedFacture({factureId: order.Facture.id}))
        setVisible(false)
        const error = store.getState().entities.facture.error
        if(error !== null) {
            return alert("Nous n'avons pas pu joindre le serveur, veuillez reessayer plutard.")
        }
        const selectedFacture = store.getState().entities.facture.selectedFacture
         navigation.navigate(routes.FACTURE_DETAILS, selectedFacture)
    }

    useEffect(() => {
        let timer;
        if(getOrderExpirationState(order)>0) {
            timer = setInterval(() => {
                const newTime = getOrderExpirationState(order)
                setAccordExpirationDate(newTime)
            }, 60000)
        }
        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <>
            <AppActivityIndicator visible={visible}/>
            <View style={styles.mainContainer}>
               {isDemande && statusAccordValue.toLowerCase() === 'accepté' && <View>
                   {isExpired?<AppText style={{color:colors.rougeBordeau, fontSize: 15}}>0j 00h00m 00s</AppText>:<AppText style={{color: colors.rougeBordeau, fontSize: 15}}>{secsToTime(accordExpirationDate)}</AppText>}
               </View>}
                <AppModePayement modePayement={modePayement}/>
                <View style={{flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <ListItemHeader headerTitle={header}/>
                    <AppText style={{fontWeight: 'bold', fontSize: 20, color: colors.or}}>{order.numero}</AppText>
                </View>
                <View>
                {orderItems && <ScrollView horizontal>
                    {orderItems.map((item, index) =>
                        <TouchableOpacity  key={index}>
                        <Image resizeMode='stretch' style={{height: 50, width: 50, margin: 10}} source={{uri: item.OrderItem.image}}/>
                    </TouchableOpacity>)}
                </ScrollView>}

                <View style={{
                    position: 'absolute',
                    left: '25%',
                    bottom: -20
                }}>
                    <AppText style={{fontWeight: 'bold', fontSize: 18}}>{typeCmde !== 'article'?orderItems[0]?.OrderItem.libelle:'Achats divers'}</AppText>
                </View>
                </View>

                <View style={{marginTop: 20}}>
                    <AppLabelWithValue label='Montant' labelValue={formatPrice(order.montant)}/>
                    {!isDemande && <AppLabelWithValue label='Déjà payé ' labelValue={formatPrice(order.Facture?.solde) || formatPrice(0)}/>}
                    {!isContrat &&
                    <StatusPicker
                        labelStatus='Accord' statusValue={statusAccordValue} statusData={accordInitData}
                        changeStatusValue={(value) => saveAccordEdit({orderId:order.id, statusAccord: value})}
                        otherStatusStyle={{color: order.statusAccord.toLowerCase() === 'accepté'?colors.vert:order.statusAccord.toLowerCase() === 'refusé'?'red':'grey', fontWeight: 'bold'}}/>}
                    {!isDemande &&
                    <StatusPicker
                        labelStatus='Livraison'
                        statusValue={order.statusLivraison}
                        otherStatusStyle={{color: order.statusLivraison.toLowerCase() === 'livré'?colors.vert:order.statusLivraison.toLowerCase() === 'partiel'?'orange':'grey',fontWeight: 'bold'}}
                        statusData={initData.livraisonData}
                        changeStatusValue={(value) => saveLivraisonEdit({orderId: order.id, statusLivraison: value})}
                    />
                    }
                    {contrats && contrats.length >=1 &&
                    <AppLabelWithValue
                        label='Contrat '
                        labelValue={order.Contrats[0]?.status}
                        labelStyle={{fontSize: 15, color:order.Contrats[0]?.status.toLowerCase() === 'en cours'?'grey':order.Contrats[0]?.status.toLowerCase() === 'terminé'? colors.vert:'orange', fontWeight: 'bold'}}
                    />
                    }
                    <View style={{
                        alignItems: 'center',
                        marginBottom: 10
                    }}>
                        <AppIconButton iconColor={colors.dark}
                            onPress={() => dispatch(getItemDetail(order))}
                            buttonContainer={styles.accordIcon}
                            iconName={showDetail?'chevron-up':'chevron-down'}/>
                    </View>
                    {showDetail && orderItems && <View style={{ minWidth: '90%', backgroundColor: colors.blanc, marginTop: 5}}>
                        {orderItems.map((order, index) =>
                                <AppLabelWithValue
                                    key={index.toString()}
                                    label={order.OrderItem.quantite}
                                    labelValue={order.OrderItem.libelle}
                                    secondLabel={formatPrice(order.OrderItem.montant)}
                                    labelStyle={{width: '60%'}}
                                />
                        )}
                        <AppLabelWithValue label='Frais livraison ' labelValue={formatPrice(order.fraisTransport)}/>
                        <AppLabelWithValue label="Taux d'interêt " labelValue={formatPrice(order.interet)}/>
                        <AppLabelWithContent content={formatDate(order.dateCmde)} label="Date commande "/>
                        <AppLabelWithContent label='Livraison prevue le ' content={formatDate(order.dateLivraisonDepart)}/>
                        {!isDemande && livraisonValue.toLowerCase() === 'livré' &&
                        <AppLabelWithContent label='Livré le ' content={formatDate(order.dateLivraisonFinal)}/>}
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                                <AppButton
                                    iconName='plus'
                                    onPress={() =>navigation.navigate('AccueilNavigator', {screen: routes.ORDER_DETAILS, params: order})}
                                    title='Details'/>
                            {!isDemande &&
                            <AppButton
                                iconName='keyboard-backspace'
                                title='Voir la facture'
                                onPress={handleGetFacture}/>
                            }
                        </View>
                    </View>}
                </View>
            </View>
            <View style={{
                position: 'absolute',
                right: -25,
                top: -10
            }}>
                {!isDemande && <ContratWatch autoPlay={playItemWatch} loop={loopItemWatch}/>}

            </View>
            {contrats && contrats.length === 0 && <View style={{
                position: 'absolute',
                right: 20,
                top: 40
            }}>
                {statusAccordValue && statusAccordValue.toLowerCase() === 'refusé' &&
                    <AppIconButton
                        iconName="thumb-down"
                        iconColor={colors.rougeBordeau}
                        buttonContainer={styles.accordIcon}
                        iconSize={40}/>
                }
                {statusAccordValue && statusAccordValue.toLowerCase() === 'accepté' &&
                    <AppIconButton
                        onPress={() => createOrderContrat(order)}
                        iconSize={40}
                        buttonContainer={styles.accordIcon}
                        iconColor={colors.vert}
                        iconName="hand-heart"/>
                }
            </View>}
            <View style={{position: 'absolute',right:20,top: 210, alignItems: 'center'}}>
                {!isHistorique &&
               <AppIconButton
                   iconSize={30}
                   iconColor={colors.dark}
                   buttonContainer={styles.iconStyle}
                   onPress={() =>moveOrderToHistory(order)}
                   iconName='history'/>
                }
                {isHistorique &&
                    <AppIconButton
                        iconSize={30}
                        buttonContainer={styles.iconStyle}
                        iconColor={colors.dark}
                        iconName='reply'
                    />}
                {showDeleteIcon &&
                    <AppIconButton
                        iconColor={colors.rougeBordeau}
                        onPress={() => deleteOrder(order)}
                        buttonContainer={{
                        backgroundColor: colors.lightGrey,
                            marginVertical: 10
                        }}
                        iconName='delete-forever'/>
                }
            </View>
         {isExpired &&
         <View style={styles.expired}>
            </View>
            }

           {isExpired && <View style={styles.orderAgain}>
                <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>expiré</AppText>
               <AppIconButton
                   onPress={() => deleteOrder(order)}
                   buttonContainer={{
                       backgroundColor: colors.rougeBordeau,
                       height: 80,
                       width: 80,
                       borderRadius: 40
                   }}
                   iconName='delete-forever'/>
            </View>}

        </>
    );
}

const styles = StyleSheet.create({
    accordIcon: {
        backgroundColor: colors.leger,
        height: 60,
        width: 60,
        borderRadius: 30
    },
    mainContainer: {
        backgroundColor: colors.blanc,
        marginTop: 30,
        padding: 10
    },
    expired: {
        position: 'absolute',
        backgroundColor: colors.blanc,
        opacity: 0.8,
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    orderAgain: {
        position: 'absolute',
        zIndex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%'
    },
    iconStyle: {
        backgroundColor: colors.lightGrey,
        height: 40,
        width: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    }

})
export default UserOrderItem;