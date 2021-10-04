import React, {useState, useEffect} from 'react';
import {ScrollView, View, StyleSheet, TouchableOpacity, Alert} from "react-native";
import {Swipeable} from 'react-native-gesture-handler'
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import useAuth from "../hooks/useAuth";
import {useDispatch, useSelector, useStore} from "react-redux";
import {showTrancheDetails} from "../store/slices/trancheSlice";
import AppLabelWithValue from "../components/AppLabelWithValue";
import AppIconButton from "../components/AppIconButton";
import useManageUserOrder from "../hooks/useManageUserOrder";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppButton from "../components/AppButton";
import AppInput from "../components/AppInput";

function FactureTrancheScreen({route}) {
    const {formatPrice, formatDate, userRoleAdmin} = useAuth()
    const {payFactureTranche} = useManageUserOrder()
    const dispatch = useDispatch()
    const store = useStore()
    const selectedFacture = route.params
    const connectedUser = useSelector(state => state.auth.user)
    const factureTranchesList = useSelector(state => {
        const list = state.entities.tranche.list
        const selectedList = list.filter(item => item.FactureId === selectedFacture.id)
        return selectedList
    })
    const isLoading = useSelector(state => state.entities.tranche.loading)

    const [factureTranches, setFactureTranches] = useState([])
    const [trancheMontant, setTrancheMontant] = useState('')

    const handlePayTranche = (data) => {
        if(!data.validation && Number(trancheMontant)<= 0) {
            return alert("Veuillez saisir un montant supérieur à zero")
        }
        if(Number(trancheMontant)>0) {
            const totalSolde = data.solde + Number(trancheMontant)
            if(totalSolde>data.montant) {
                return alert("Vous ne pouvez pas payer un montant superieur au montant total de la tranche.")
            }
        }

        Alert.alert('Alert', "Voulez-vous payer cette tranche?", [{
            text: "oui", onPress: async () => {
                await payFactureTranche({...data, montant:Number(trancheMontant)? Number(trancheMontant): 0})
                const newList = store.getState().entities.tranche.list
                const selectedList = newList.filter(tranche => tranche.FactureId === selectedFacture.id)
                setFactureTranches(selectedList)
            }
        }, {
            text: 'non', onPress: () => {return;}
        }])


    }

    const handleShowTranche = async (tranche) => {
        await dispatch(showTrancheDetails(tranche))
        const newList = store.getState().entities.tranche.list
        const selectedList = newList.filter(item => item.FactureId === selectedFacture.id)
        setFactureTranches(selectedList)
    }

    const isPermited = selectedFacture.Commande?.UserId === connectedUser.id || userRoleAdmin()

    useEffect(() => {
        setFactureTranches(factureTranchesList)
    }, [])

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
        <ScrollView contentContainerStyle={{
            paddingBottom: 50
        }}>
            <View style={styles.headerContainer}>
            <View style={styles.trancheHeader}>
                <AppText style={styles.letterF}>FP</AppText>
            </View>
                <AppText style={styles.numeroFact}>{selectedFacture.numero}</AppText>
            </View>
            <View>
                {factureTranches.map((item) =>
                    <View key={item.id.toString()}
                          style={[styles.trancheContainer, {height: item.showDetails?'auto':item.payingTranche?'auto' : 50}]}>
                        <Swipeable renderRightActions={() => !item.payingTranche?
                            <View style={{
                            width: 120,
                            alignItems: 'center',
                            justifyContent: 'center',
                                marginHorizontal: 10
                        }}>
                            {item.montant !== item.solde && isPermited &&
                            <AppButton
                                title='payer'
                                onPress={() => handleShowTranche({item, label: 'payTranche'})}/>}
                            {userRoleAdmin() && item.solde === item.montant && item.payedState !== 'confirmed' &&
                            <AppButton
                                title='Confirmer'
                                onPress={() => handlePayTranche({...item, validation: true})}/>}
                        </View> : null}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginHorizontal:10
                        }}>
                            <TouchableOpacity onPress={() => handleShowTranche({item, label: 'showDetail'})}>
                                <AppText style={{color: colors.bleuFbi}}>{item.numero}</AppText>
                            </TouchableOpacity>
                            <AppText style={{fontWeight: 'bold'}}>{formatPrice(item.montant)}</AppText>
                            {item.solde === item.montant && <View>
                                {item.payedState === 'confirmed' && <AppIconButton
                                    iconColor={colors.blanc}
                                    onPress={() => alert("Vous avez deja payé cette tranche.")}
                                    iconName='credit-card-check'
                                    buttonContainer={{
                                        backgroundColor: colors.vert
                                    }}/>}
                                    {item.payedState === 'pending' && <AppIconButton
                                        onPress={() => alert('Cette tranche est en cours de confirmation.')}
                                        buttonContainer={{
                                            backgroundColor: 'orange'
                                        }}
                                        iconName='exclamation'/>}
                            </View>}
                        </View>
                        </Swipeable>
                        <View style={{
                            marginVertical: 20,
                            backgroundColor: colors.lightGrey
                        }}>
                        {item.showDetails && <View>
                            <AppLabelWithValue label='Emis le:' labelValue={formatDate(item.dateEmission)}/>
                            <AppLabelWithValue label='Doit être payé le:' labelValue={formatDate(item.dateEcheance)}/>
                            <AppLabelWithValue label='Déjà payé:' labelValue={formatPrice(item.solde)}/>
                            {item.payed && <AppLabelWithValue label='Payé le:' labelValue={formatDate(item.updatedAt)}/>}
                            <AppIconButton
                                onPress={() => handleShowTranche({item, label: 'showDetail'})}
                                buttonContainer={styles.closeDetails}
                                iconColor={colors.dark}
                                iconName="chevron-up" />
                        </View>}
                       {item.payingTranche &&
                       <View style={{
                           paddingBottom: 30
                       }}>
                           <AppIconButton
                               onPress={() => handleShowTranche({item, label: 'payingTranche'})}
                               buttonContainer={{
                                   alignSelf: 'flex-end',
                                   marginTop: 10,
                                   marginRight: 10
                               }}
                               iconColor={colors.dark}
                               iconName="chevron-up" />
                               <View style={{
                                   alignItems: 'flex-start',
                                   marginHorizontal: 40
                               }}>
                                   <AppLabelWithValue
                                       labelValue={formatPrice(item.solde)}
                                       label='Deja payé'
                                   />
                                   <AppLabelWithValue
                                       labelValue={formatPrice(item.montant - item.solde)}
                                       label='Reste à payer'
                                   />
                               </View>
                           <AppInput
                               placeholder='montant'
                               value={trancheMontant}
                               onChangeText={val => setTrancheMontant(val)}
                               keyboardType='numeric'/>
                               <AppButton
                                   style={{
                                       alignSelf: "center"
                                   }}
                                   onPress={()=>handlePayTranche(item)}
                                   title='Payer'/>
                        </View>}
                        </View>
                </View>)}
            </View>
        </ScrollView>
            </>
    );
}

const styles = StyleSheet.create({
    closeDetails:{
        backgroundColor: colors.leger,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignSelf: 'center',
        marginVertical: 20
    },
    headerContainer: {
      width: '100%',
      height: 300,
        backgroundColor: colors.leger,
        alignItems: 'center',
        justifyContent: 'center'
    },
    letterF: {
        fontSize: 100,
        color: colors.blanc,
        fontWeight: 'bold'
    },
    numeroFact: {
      color: colors.dark,
        marginTop: -20,
        fontSize: 30,
        fontWeight: 'bold'
    },
    trancheHeader: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 200,
        width: 200,
        borderRadius:200,
        backgroundColor: colors.rougeBordeau,
        marginVertical: 20
    },
    trancheContainer: {
        marginVertical: 20,
        backgroundColor: colors.blanc
    }
})
export default FactureTrancheScreen;