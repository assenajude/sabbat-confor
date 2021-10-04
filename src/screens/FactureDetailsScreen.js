import React, {useState} from 'react';
import {View, ScrollView} from "react-native";
import useOrderInfos from "../hooks/useOrderInfos";
import dayjs from "dayjs";
import AppModePayement from "../components/AppModePayement";
import AppLottieViewAnim from "../components/AppLottieViewAnim";
import AppDetailCarousel from "../components/AppDetailCarousel";
import useManageUserOrder from "../hooks/useManageUserOrder";
import AppLabelWithValue from "../components/AppLabelWithValue";
import TrancheItem from "../components/TrancheItem";
import {useSelector} from "react-redux";
import AppLabelLink from "../components/AppLabelLink";
import routes from "../navigation/routes";
import AppActivityIndicator from "../components/AppActivityIndicator";

function FactureDetailsScreen({route, navigation}) {
    const currentFacture = route.params
    const {getItems, getModePayement} = useOrderInfos()
    const {payFactureTranche} = useManageUserOrder()
    const listFacture = useSelector(state => state.entities.facture.list)
    const factureLoading = useSelector(state => state.entities.facture.loading)
    const trancheLoading = useSelector(state => state.entities.tranche.loading)
    const otherFacture = listFacture.find(item => item.id === route.params.id)
    const facture = currentFacture?currentFacture : otherFacture
    const [factureItems, setFactureItems] = useState(getItems(facture.CommandeId))

    return (
        <>
            <AppActivityIndicator visible={factureLoading || trancheLoading}/>
        <ScrollView>
            <View style={{
                margin: 5,
                paddingBottom: 20
            }}>
            <View>
                <AppModePayement modePayement={getModePayement(facture.CommandeId) || currentFacture.payement}/>
              {facture.montant === facture.solde &&  <AppLottieViewAnim lottieAutoPlay={true} lottieStyle={{height: 50, width: 50}}
                                   lottieSource={require('../assets/animations/done')} lottieLoop={false}/>}
                {facture.montant !== facture.solde && <AppLottieViewAnim lottieAutoPlay={true} lottieStyle={{height: 50, width: 50}}
                                   lottieSource={require('../assets/animations/money_pending')} lottieLoop={true}/>}
                <AppDetailCarousel labelValue={facture.numero} carouselItems={factureItems || currentFacture.cartItems}
                                   typeFacture={facture.typeFacture === 'e-commerce'?'Commande':facture.typeFacture === 'e-location'?'Location':'Service'}/>
            </View>
            <View>
                <AppLabelWithValue label='Total à payer: ' labelValue={facture.montant} secondLabel='fcfa'/>
                <AppLabelWithValue label='Déjà payé: ' labelValue={facture.solde} secondLabel='fcfa'/>
                <AppLabelWithValue label='Facture du: ' labelValue={dayjs(facture.dateDebut).format('DD/MM/YYYY HH:mm:ss')}/>
                <AppLabelWithValue label={facture.dateCloture?'Reglé le: ':'A reglé avant le: '} labelValue={facture.dateCloture?dayjs(facture.dateCloture).format('DD/MM/YYYY HH:mm:ss'):dayjs(facture.dateFin).format('DD/MM/YYYY HH:mm:ss')}/>

            </View>
            <View style={{borderWidth: 1, paddingVertical: 10}}>
                <AppLabelLink
                    handleLink={() => navigation.navigate(routes.FACTURE_TRANCHE, facture)}
                    content={`Tranches (${facture.Tranches.length})`}/>
                <View>
                    {facture.Tranches.map((tranche, index) =>
                        <TrancheItem
                            payedState={tranche.payedState}
                            key={tranche.id.toString()}
                            trancheIndex={index+1}
                            isTranchePayed={tranche.payed}
                            trancheMontant={tranche.montant}
                            tranchePayedDate={tranche.updatedAt}
                            trancheDateEcheance={tranche.dateEcheance}
                        />)}
                </View>

            </View>
            </View>
        </ScrollView>
            </>
    );
}

export default FactureDetailsScreen;