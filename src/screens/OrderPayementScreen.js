import React, { useState} from 'react';
import {View,StyleSheet, ScrollView, TouchableOpacity,Modal} from "react-native";
import {useSelector, useDispatch} from "react-redux";


import AppText from "../components/AppText";
import colors from "../utilities/colors";
import {
    getPayementActive,
    getPlanDetail,
    getSelectedPlan
} from '../store/slices/payementSlice'
import PayementListItem from "../components/list/PayementListItem";
import AppButton from "../components/AppButton";
import ModeItemCheck from "../components/payement/ModeItemCheck";
import AppActivityIndicator from "../components/AppActivityIndicator";
import usePayementPlan from "../hooks/usePayementPlan";
import usePlaceOrder from "../hooks/usePlaceOrder";
import {AntDesign, EvilIcons, Octicons} from "@expo/vector-icons";
import ConditionsModal from "../components/payement/ConditionsModal";
import ParrainListModal from "../components/payement/ParrainListModal";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";

function OrderPayementScreen({navigation}) {
    const dispatch = useDispatch()
    const {formatPrice} = useAuth()
    const {getPayementRate, getTotal} = usePlaceOrder()
    const {permitCredit, isPlanDisabled} = usePayementPlan()
    const currentUserData = useSelector(state => state.profile.connectedUser)
    const totalParrains = useSelector(state => {
        let total = 0
        const allParrains = state.entities.order.currentOrderParrains
        allParrains.forEach(parrain => {
            total += parrain.parrainAction
        })
        return total
    })
    const payements = useSelector(state => state.entities.payement.list)
    const payementPlans = useSelector(state => state.entities.payement.payementPlans)
    const loading = useSelector(state => state.entities.payement.loading)
    const selectedPayement = useSelector(state => state.entities.payement.selectedPayement)
    const selectedPlan = useSelector(state => state.entities.payement.currentPlan)
    const livraisonLoading = useSelector(state => state.entities.userAdresse.loading)
    const typeCmde = useSelector(state => state.entities.shoppingCart.type)
    const [openConditionsModal, setOpenConditionsModal] = useState(false)
    const [parrainModalVisible, setParrainModalVisible] = useState(false)
    const [creditOptionModal, setCreditOptionModal] = useState(false)
    const [selectedOption, setSelectedOption] = useState('')


    const handleDismissParrainModal = () => {
        if(totalParrains>0 && totalParrains !== getTotal()){
            return alert("Le total parrain doit être egal au total commande")
        }
        setParrainModalVisible(false)
    }


    const handleOrderNext = () => {
        const isCredit = selectedPayement.mode.toLowerCase() === 'credit'
        const isPLanSelected = Object.keys(selectedPlan).length>0
        if (isCredit && isPLanSelected) {
            setCreditOptionModal(true)
        } else navigation.navigate(routes.ORDER)
    }

    const handleModalOptionNext = () => {
        if(selectedOption.toLowerCase() === 'fidelityseuil') {
            setCreditOptionModal(false)
            navigation.navigate(routes.ORDER)
        }
        else {
            setCreditOptionModal(false)
            navigation.navigate(routes.ORDER_PARRAINAGE)
        }
    }


    if(loading) {
        return (
            <AppActivityIndicator visible={loading}/>
        )
    }


    return (
        <>
            <ConditionsModal conditionModalVisible={openConditionsModal} dismissConditionModal={() => setOpenConditionsModal(false)}/>
            <ParrainListModal parrainageModalVisible={parrainModalVisible} dismissParrainModal={handleDismissParrainModal}/>
        <ScrollView>
            <View style={{alignItems: 'flex-start', padding: 10}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <AntDesign name="infocirlceo" size={20} color={colors.bleuFbi} />
                    <AppText>Avant de faire une commande à credit, </AppText>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center',width:'90%', paddingHorizontal: 20}}>
                    <View>
                        <AppText>assurez-vous de respecter les</AppText>
                    </View>
                    <TouchableOpacity onPress={() => setOpenConditionsModal(true)}>
                        <AppText style={{color: colors.bleuFbi}}>conditions d'eligibités</AppText>
                    </TouchableOpacity>

                </View>
            </View>
            <View style={styles.summary}>
                <View style={styles.itemLine}>
                    <AppText style={{fontWeight: 'bold'}} >Montant actuel commande: </AppText>
                    <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{formatPrice(getTotal()-getPayementRate())}</AppText>
                </View>
                <View style={styles.itemLine}>
                    <AppText style={{fontWeight: 'bold'}}>Interet payement: </AppText>
                    <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}> {formatPrice(getPayementRate())}</AppText>
                </View>
                <View style={styles.itemLine}>
                    <AppText style={{fontWeight: 'bold'}}>Net actuel à payer: </AppText>
                    <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{formatPrice(getTotal())}</AppText>
                </View>
            </View>
            <View>
                <View style={styles.headerStyle}>
                <AppText style={{color: colors.blanc, fontWeight: 'bold', fontSize: 12}}>Dites nous comment vous voulez payer votre commande</AppText>
                </View>
            </View>
            <ScrollView>
                <View  style={{paddingBottom: 30}}>
                <View style={styles.modePayement}>
                    <View style={{
                        height: 35,
                        backgroundColor: colors.rougeBordeau,
                        justifyContent: 'center'
                    }}>
                    <AppText style={{fontWeight: 'bold', color: colors.blanc}}>Mode</AppText>
                    </View>
                    <View style={{marginLeft: 20}}>
                    <ScrollView horizontal>
                        {payements.map((item, index) => <View key={index.toString()}>
                            <ModeItemCheck isActive={item.active} modeTitle={item.mode} getModeActive={() => {
                                if(typeCmde === 'service' && item.mode.toLowerCase() === 'cash') {
                                    alert('Désolé, vous ne pouvez pas choisir ce mode de payement pour cette commande.')
                                } else {
                                    if(item.mode.toLowerCase() === 'credit' && !permitCredit()) {
                                        alert('Impossible de choisir ce mode, un ou plusieurs articles de votre commande ne peuvent être vendus à credit')
                                    } else {
                                      dispatch(getPayementActive(item.id))
                                    }
                                }
                            }} isPayementDisabled={typeCmde === 'service' && item.mode.toLowerCase() === 'cash'}/>
                        </View>)}
                    </ScrollView>
                    </View>

                </View>
                <View style={styles.listContainer}>
                    <View style={{
                        backgroundColor: colors.rougeBordeau,
                        width: '50%',
                        alignSelf: 'center',
                        marginBottom: 20
                    }}>
                        <AppText style={{color: colors.blanc}}>Choisissez un plan</AppText>
                    </View>
                    {!payementPlans || payementPlans.length === 0 && <View>
                        <AppText>Il n'y a pas de plans dans ce mode.</AppText>
                    </View>}
                    <View style={{justifyContent: 'flex-start'}}>
                    {payementPlans.map((plan, index) =>
                        <PayementListItem
                            showMoreButton={false} disablePlan={isPlanDisabled(plan)}
                            libelle={plan.libelle} description={plan.descripPlan} key={index}
                            checked={plan.checked} selectItem={() => {
                                if(isPlanDisabled(plan)) {
                                    return alert('Vous ne pouvez pas choisir ce plan pour cette commande, veuillez choisir un autre plan SVP')
                                }
                                dispatch(getSelectedPlan(plan))
                            }} planDelai={plan.nombreMensualite>0?plan.nombreMensualite+' m':'3 j'}
                            showDetail={plan.showPlanDetail} getDetails={() => dispatch(getPlanDetail(plan.id))}
                            goToPlanDetail={() => navigation.navigate('AccueilNavigator', {screen: 'PlanDetailScreen', params: plan})}
                            goToDisabledPlanDetail={() => navigation.navigate('AccueilNavigator', {screen: 'PlanDetailScreen', params: plan})}/>)}
                    </View>

                </View>
              {Object.keys(selectedPlan).length>0 &&
              <AppButton
                  style={styles.buttonStyle}
                  title='continuer'
                  onPress={handleOrderNext}/>}
                </View>
            </ScrollView>
        </ScrollView>
            <Modal visible={creditOptionModal} transparent>
                <View style={styles.mainContainer}>
                </View>
                <View style={styles.optionContainer}>
                    <View style={{alignSelf: 'flex-end', padding: 5}}>
                        <TouchableOpacity onPress={() => setCreditOptionModal(false)}>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <EvilIcons name="close" size={24} color={colors.rougeBordeau} />
                            <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>fermer</AppText>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                    <AppText style={{color: colors.bleuFbi}}>Veuillez choisir une option de credit pour continuer </AppText>
                    </View>
                    <View style={{alignItems: 'flex-start', marginTop: 10, marginLeft: 50}}>
                    <TouchableOpacity onPress={() => {
                        if(currentUserData.fidelitySeuil < 500000) {
                            alert("Vous ne pouvez pas utiliser cette option, vous n'avez pas encore atteint votre seuil de fidelité")
                        }else {
                        setSelectedOption('fidelitySeuil')

                        }
                    }}>

                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
                        <View style={{height: 20,width: 20, borderWidth: 1, borderRadius: 10,
                            justifyContent: 'center', alignItems: 'center'}}>
                            {selectedOption.toLowerCase() === 'fidelityseuil' && <Octicons name="primitive-dot" size={24} color={colors.or} />}
                        </View>
                        <AppText style={{fontWeight: 'bold', marginLeft: 10}}>Seuil de fidelité</AppText>
                    </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedOption('parrainage')}>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 15}}>
                        <View style={{height: 20,width: 20, borderWidth: 1,
                            borderRadius: 10,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                          {selectedOption.toLowerCase() === 'parrainage' &&  <Octicons name="primitive-dot" size={24} color={colors.or} />}
                        </View>
                        <AppText style={{fontWeight: 'bold', marginLeft: 10}}>Parrainage</AppText>
                    </View>
                    </TouchableOpacity>
                </View>

                {selectedOption.length>0 &&
                  <AppButton
                      style={{alignSelf: 'center'}}
                      title='continuer' onPress={handleModalOptionNext}/>
            }
                </View>

            </Modal>
          </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    summary: {
        margin: 10,
        borderWidth: 1,
        borderRadius: 10
    },
    itemLine: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modePayement: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        paddingTop: 10,
        paddingBottom: 10,
        borderWidth: 1
    },
    listContainer: {
        margin: 5,
        marginLeft: 20,
        paddingTop: 10,
    },
    headerStyle: {
        backgroundColor: colors.rougeBordeau,
        marginTop: 10,
        marginBottom: 10
    },
    buttonStyle: {
        alignSelf: 'center',
        marginVertical: 50
    },
    optionContainer: {
        backgroundColor: colors.blanc,
        position: 'absolute',
        zIndex: 10,
        width: '100%',
        height: 'auto',
        paddingBottom: 20,
        top: '20%',
    },
    mainContainer: {
        flex: 1,
        zIndex: -10,
        backgroundColor: colors.dark,
        opacity: 0.7
    }
})

export default OrderPayementScreen;