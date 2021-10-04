import React, {useState} from 'react';
import {View,StyleSheet, TouchableOpacity,ScrollView, Image} from 'react-native'
import LottieView from 'lottie-react-native'

import AppText from "../AppText";
import colors from "../../utilities/colors";
import ListItemHeader from "./ListItemHeader";
import AppLabelWithValue from "../AppLabelWithValue";
import AppModePayement from "../AppModePayement";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";
import useOrderInfos from "../../hooks/useOrderInfos";
import {useNavigation} from '@react-navigation/native'
import routes from "../../navigation/routes";
import {useDispatch, useSelector, useStore} from "react-redux";
import AppLabelLink from "../AppLabelLink";
import AppActivityIndicator from "../AppActivityIndicator";
import {getSelectedOrder} from "../../store/slices/orderSlice";
import AppButton from "../AppButton";

function FactureListItem({facture, deleteItem}) {
    const navigation = useNavigation()
    const store = useStore()
    const dispatch = useDispatch()
    const {formatDate, formatPrice} = useAuth()
    const {getModePayement, getItems} = useOrderInfos()
    const tranchesList = useSelector(state => state.entities.tranche.list)
    const endFacture = facture.montant === facture.solde
    const orderItems = getItems(facture.CommandeId)
    const okPayement = facture.montant === facture.solde
    const waitingTranchePayed = facture.Tranches.some(tranche => tranche.payedState === 'pending')
    const tranches = tranchesList.filter(tranche => tranche.FactureId === facture.id)

    const [visible, setVisible] = useState(false)



    const handleGetOrder = async () => {
        setVisible(true)
        await dispatch(getSelectedOrder({orderId: facture.Commande.id}))
        setVisible(false)
        const error = store.getState().entities.order.error
        if(error !== null) {
            return alert("Nous n'avons pas pu joindre le serveur, veuillez reessayer plutard.")
        }
        const selectedOrder =  store.getState().entities.order.selectedOrder
        navigation.navigate(routes.ORDER_DETAILS, selectedOrder)
    }

    return (
          <>
              <AppActivityIndicator visible={visible}/>
              <View style={styles.mainContainer}>
                      <AppModePayement modePayement={getModePayement(facture.CommandeId)}/>
                  {orderItems && <ScrollView horizontal>
                      {orderItems.map((item, index) => <TouchableOpacity  key={index}>
                          <Image resizeMode='stretch' style={{height: 50, width: 50, margin: 10}} source={{uri: item.OrderItem.image}}/>
                      </TouchableOpacity>)}
                  </ScrollView>}
                  <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
                      <ListItemHeader headerTitle='F'/>
                      <AppText style={{fontWeight: 'bold', fontSize: 20, color: colors.or}}>{facture.numero}</AppText>
                  </View>
                  <View style={{marginTop: 20}}>
                  <AppLabelWithValue label='Montant ' labelValue={formatPrice(facture.montant)}/>
                  <AppLabelWithValue label='Déjà payé ' labelValue={formatPrice(facture.solde) || formatPrice(0)}/>
                  <AppLabelWithValue label='Debut' labelValue={formatDate(facture.dateEmission)}/>
                  <AppLabelWithValue label='Fin' labelValue={formatDate(facture.dateFin)}/>
                      <AppLabelLink
                          otherTextStyle={{fontSize: 18, marginVertical: 10}}
                          handleLink={() => navigation.navigate(routes.FACTURE_TRANCHE, facture)}
                          content={`Tranches de payement (${tranches.length})`}/>
                  </View>
                  <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                  }}>
                      <AppButton
                          onPress={() => navigation.navigate('AccueilNavigator', {screen :routes.FACTURE_DETAILS, params: facture})}
                          iconName="plus"
                          title='Details'
                      />
                      <AppButton
                          iconName='keyboard-backspace'
                          title='Voir la cmd'
                          onPress={handleGetOrder}/>
                  </View>
              </View>
              <View style={ {
                  position: 'absolute',
                  top: 30,
                  right: 20
              }}>
                  {okPayement && !waitingTranchePayed && <LottieView style={{height: 100, width: 100}} autoPlay={true} loop={false} source={require('../../assets/animations/done')}/>}
                  { waitingTranchePayed && <View>
                  <LottieView
                      style={{height: 80, width: 80}}
                      autoPlay={true}
                      loop={false}
                      source={require('../../assets/animations/money_pending')}/>
                  </View>
                  }
                  {!okPayement && !waitingTranchePayed &&
                  <LottieView style={{height: 80, width: 80}} autoPlay={true} loop={true} source={require('../../assets/animations/money_pending')}/>}
              </View>
              {endFacture &&  <View style={styles.deleteIcon}>
                  <AppIconButton
                      iconColor={colors.rougeBordeau}
                      onPress={deleteItem}
                      buttonContainer={{
                      backgroundColor: colors.lightGrey
                      }}
                      iconName='delete-forever'
                    />
              </View>
              }
                </>
    );
}

const styles = StyleSheet.create({
    tranches: {
        backgroundColor: colors.blanc,
        justifyContent: 'center',
        alignItems: 'center',
        height: 100,
        width: '100%'
    },
    mainContainer: {
        backgroundColor: colors.blanc,
        marginTop: 30,
        paddingBottom: 15,
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    deleteIcon: {
        position: 'absolute',
        right: 20,
        top: 250
    }
})

export default FactureListItem;