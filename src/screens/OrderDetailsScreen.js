import React, {useCallback, useEffect, useState} from 'react';
import {View, ScrollView, StyleSheet} from "react-native";
import useOrderInfos from "../hooks/useOrderInfos";
import AppModePayement from "../components/AppModePayement";
import AppLottieViewAnim from "../components/AppLottieViewAnim";
import AppDetailCarousel from "../components/AppDetailCarousel";
import AppLabelWithValue from "../components/AppLabelWithValue";
import dayjs from "dayjs";
import StatusPicker from "../components/order/StatusPicker";
import initData from "../utilities/initData";
import useManageUserOrder from "../hooks/useManageUserOrder";
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppAvatar from "../components/user/AppAvatar";
import routes from "../navigation/routes";
import ParrainageHeader from "../components/parrainage/ParrainageHeader";
import useAuth from "../hooks/useAuth";
import useParrainage from "../hooks/useParrainage";
import {getSelectedFacture} from "../store/slices/factureSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";
import {getAllParrains, getUserParrains} from "../store/slices/parrainageSlice";

function OrderDetailsScreen({route, navigation}) {
    const dispatch = useDispatch()
    const store = useStore()
    const currentCommande = route.params
    const {formatPrice} = useAuth()
    const {getParrainagePercent} = useParrainage()
    const connectedUser = useSelector(state => state.auth.user)
    const comptesParrainage = useSelector(state => state.entities.parrainage.list)
    const loading = useSelector(state => state.entities.facture.loading)
    const findOther = useSelector(state => {
        const userListOrder = state.entities.order.currentUserOrders
        const selectedOrder = userListOrder.find(order => {
            if(order.id === route.params.id || order.numero === route.params.numero) return true
        })
        return selectedOrder
    })
    const commande = currentCommande?currentCommande : findOther
    const itemContratStatus = commande.Contrats[0]?commande.Contrats[0].status:'Pas de contrats'
    const {getModePayement,getPointRelais} = useOrderInfos()
    const {saveAccordEdit, saveLivraisonEdit} = useManageUserOrder()
    const [orderRelais, setOrderRelais] = useState()
    const [loadingParrains, setLoadingParrains] = useState(false)

   const handleChangeAccord = (value) => {
        const accordData = {
            orderId: commande.id,
            statusAccord: value
        }
        saveAccordEdit(accordData)
    }

    const handleChangeLivraison = (value) => {
        const data = {
            orderId: commande.id,
            statusLivraison: value
        }
        saveLivraisonEdit(data)
    }

    const handleGetFacture = async () => {
        await dispatch(getSelectedFacture({factureId: commande.Facture.id}))
        const error = store.getState().entities.facture.error
        if(error !== null) {
            return alert("Nous ne pouvons pas avoir la facture demandée.")
        }
        const selected = store.getState().entities.facture.selectedFacture
        const payement = getModePayement(commande.id)?getModePayement(commande.id) : currentCommande.payement
        const params = {...selected, payement}
        navigation.navigate(routes.FACTURE_DETAILS, params)
    }

    const getCompteParrainage = useCallback(async () => {
        setLoadingParrains(true)
        await dispatch(getAllParrains())
        setLoadingParrains(false)
    }, [])

    useEffect(() => {
        getCompteParrainage()
          if(commande.typeCmde === 'article' && commande.UserAdresse) {
              setOrderRelais(getPointRelais(commande.id))
          }
    }, [])

    if(!commande) {
        return (<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <AppText>La commande n'a pas été trouvée.</AppText>
        </View>)
    }
    return (
        <>
            <AppActivityIndicator visible={loading || loadingParrains}/>
        <ScrollView contentContainerStyle={{
            paddingBottom: 50
        }}>
            <View style={styles.container}>
                    <AppModePayement modePayement={getModePayement(commande.id)|| currentCommande.payement}/>
                    <AppLottieViewAnim
                        lottieSource={require('../assets/animations/data_watch')}
                        lottieStyle={{width: 150, top: -25}}
                        lottieAutoPlay={itemContratStatus.toLowerCase() === 'en cours'}
                        lottieLoop={itemContratStatus.toLowerCase() === 'en cours'}/>
                    <View style={{
                        marginTop: 30,
                        marginBottom: 10
                    }}>
                     <AppDetailCarousel carouselItems={commande.CartItems} typeFacture={commande.typeCmde === 'e-commerce'?'Commade ':''} labelValue={commande.numero}/>
                    </View>
                    <View style={styles.contentStyle}>
                        <View>
                            <AppAvatar
                                showNottif={false}
                                user={commande.User}
                                onPress={() => navigation.navigate(routes.COMPTE,commande.User)}/>
                                <AppText>{commande.User.username}</AppText>
                        </View>
                       <View style={{marginLeft: 50}}>
                           <AppLabelWithValue label='Total montant: ' labelValue={formatPrice(commande.montant)}/>
                           <AppLabelWithValue label='Total payé: ' labelValue={commande.Facture?formatPrice(commande.Facture.solde):formatPrice(0)}/>
                       </View>
                    </View>
                    <View style={{
                        borderWidth: 1
                    }}>
                        <View style={{
                            backgroundColor: colors.rougeBordeau,
                            margin: 5,
                        }}>
                            <AppText style={{color: colors.blanc}}>Dans la commande</AppText>
                        </View>
                        <View>
                            {commande.CartItems.map((orderItem, index) =>
                                <AppLabelWithValue
                                    key={index.toString()}
                                    labelStyle={{width: 200}}
                                    label={orderItem.OrderItem.quantite?orderItem.OrderItem.quantite:0}
                                    labelValue={orderItem.OrderItem.libelle}
                                    secondLabel={orderItem.OrderItem.montant?formatPrice(orderItem.OrderItem.montant):0}
                                                   />)}
                        </View>
                        <AppLabelWithValue label='Frais de livraison: ' labelValue={formatPrice(commande.fraisTransport)}/>
                        <AppLabelWithValue label="Taux d'interet: " labelValue={formatPrice(commande.interet)}/>
                    </View>
                {commande.CompteParrainages.length>0 && <View style={{padding: 5, marginTop: 10}}>
                    <View style={{backgroundColor: colors.rougeBordeau}}>
                        <AppText style={{color: colors.blanc}}>Infos parrainage</AppText>
                    </View>
                    {commande.CompteParrainages.map((cpt) =><View key={cpt.id.toString()} style={styles.compteParrainStyle}>
                        <ParrainageHeader
                            getUserProfile={() => navigation.navigate(routes.COMPTE, comptesParrainage.find(cptpar => cptpar.id === cpt.id)?.User)}
                            parrainUser={comptesParrainage.find(cptpar => cptpar.id === cpt.id)?.User}
                            ownerUsername={comptesParrainage.find(cptpar => cptpar.id === cpt.id)?.User.username}
                            ownerEmail={comptesParrainage.find(cptpar => cptpar.id === cpt.id)?.User.email}
                            action={`${formatPrice(cpt.OrderParrain.action)} (${getParrainagePercent((commande.montant-commande.interet), cpt.OrderParrain.action)} %)`}
                        />
                    </View>)}
                </View>}
                    <View style={{marginTop: 20}}>
                        <AppLabelWithValue label="Commandé le: " labelValue={dayjs(commande.dateCmde).format('DD/MM/YYYY HH:mm:ss')}/>
                        <AppLabelWithValue label={commande.dateLivraisonFinal?'Livré le: ':'Sera livré le: '} labelValue={commande.dateLivraisonFinal?dayjs(commande.dateLivraisonFinal).format('DD/MM/YYYY HH:mm:ss'):dayjs(commande.dateLivraisonDepart).format('DD/MM/YYYY HH:mm:ss')}/>
                        {commande.UserAdresse && <AppLabelWithValue label='Contact livraison: ' labelValue={commande.UserAdresse.nom} secondLabel='Tel: ' secondLabelValue={commande.UserAdresse.tel} />}
                        {orderRelais && <AppLabelWithValue label='Point relais' labelValue={orderRelais.nom} secondLabel='Tel: ' secondLabelValue={orderRelais.contact}/>}
                        <StatusPicker labelStatus='Accord'  statusValue={commande.statusAccord} statusData={initData.accordData}
                                      changeStatusValue={handleChangeAccord}/>
                        <StatusPicker labelStatus='Livraison' statusValue={commande.statusLivraison} statusData={initData.livraisonData}
                                      changeStatusValue={handleChangeLivraison}/>
                        <AppLabelWithValue label='Contrat:' labelValue={commande.Contrats.length>0?commande.Contrats[0].status: 'Pas de contrats'}/>
                        {commande.Contrats && commande.Contrats.length>0 &&
                        <AppButton
                            iconName='keyboard-backspace'
                            style={{
                                alignSelf: 'flex-start',
                                marginTop: 10
                            }}
                            onPress={handleGetFacture}
                            title='consulter la facture'
                        />}
                    </View>
            </View>

        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        paddingBottom: 20,
    },
    avatarStyle: {
        margin: 10,
        justifyContent: 'center',
        overflow: 'hidden'
    },
    contentStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    compteParrainStyle: {
        backgroundColor: colors.leger,
        marginHorizontal: 10,
        marginVertical: 5,
        paddingBottom: 10
    }
})
export default OrderDetailsScreen;