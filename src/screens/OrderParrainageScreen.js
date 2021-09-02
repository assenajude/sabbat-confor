import React from 'react';
import {StyleSheet,ScrollView, TextInput, TouchableOpacity, View} from "react-native";
import AppText from "../components/AppText";
import {useDispatch, useSelector} from "react-redux";
import usePlaceOrder from "../hooks/usePlaceOrder";
import {getQuotiteEditShown, getSelectedParrain} from "../store/slices/parrainageSlice";
import {getAddOrderParrain} from "../store/slices/orderSlice";
import colors from "../utilities/colors";
import {AntDesign} from "@expo/vector-icons";
import ParrainageHeader from "../components/parrainage/ParrainageHeader";
import AppButton from "../components/AppButton";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";

function OrderParrainageScreen({navigation}) {
    const dispatch = useDispatch()
    const {getTotal, getPayementRate} = usePlaceOrder()
    const {formatPrice} = useAuth()

    const listParrains = useSelector(state => {
        const parrains = state.entities.parrainage.userParrains
        const activeCompte = parrains.filter(parr => parr.active)
        return activeCompte
    })
    const totalParrains = useSelector(state => {
        let total = 0
        const allParrains = state.entities.order.currentOrderParrains
        allParrains.forEach(parrain => {
            total += parrain.parrainAction
        })
        return total
    })


    const selectItem = (item) => {
        if(item.selected && !item.showQuotiteEdit){
            dispatch(getSelectedParrain(item))
            const compteData = {...item, parrainAction: 0, showQuotiteEdit: false}
            dispatch(getAddOrderParrain(compteData))
            dispatch(getQuotiteEditShown(compteData))
        } else {
            dispatch(getQuotiteEditShown({...item, showQuotiteEdit: true}))
            dispatch(getSelectedParrain(item))

        }
    }

    const handleQuotieValue = (actionValue, selectedItem) => {
            const parsingAction = Number(actionValue)
        if(parsingAction>selectedItem.quotite){
            return alert("Vous ne pouvez pas specifier une valeur superieure à la quotité disponible")
        }

        if(actionValue !== '') {
            const compteData = {...selectedItem, parrainAction: parsingAction, showQuotiteEdit: false}
            dispatch(getAddOrderParrain(compteData))
            dispatch(getQuotiteEditShown(compteData))
        } else {
            alert("Vous n'avez pas specifié la valeur de la quotité")
        }

    }


    return (
        <>
            <ScrollView>
                <View style={{flexDirection: 'row', alignItems: 'center',
                    padding: 20}}>
                    <AntDesign name="infocirlceo" size={20} color={colors.bleuFbi} />
                    <AppText style={{marginLeft: 10, color: colors.bleuFbi}}>La couverture parrains doit être à 100% de votre commande</AppText>
                </View>
                <View style={{ borderWidth: 1, width: '90%',borderRadius: 20,
                    justifyContent: 'center', alignItems: 'center', margin: 10}}>
                    <View style={{flexDirection: 'row'}}>
                    <AppText style={{color: colors.rougeBordeau}}> {formatPrice(totalParrains)}</AppText>
                    <AppText style={{color: colors.dark}}>/</AppText>
                    <AppText>{formatPrice(getTotal()-getPayementRate())}</AppText>
                    </View>
                </View>

                {listParrains.length>0 && <ScrollView>
                    {listParrains.map((item) => <View key={item.id.toString()} style={{padding: 10, marginTop: 20, backgroundColor: colors.blanc}}>
                        <TouchableOpacity onPress={() => selectItem(item)}>
                            <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                                <View style={{flexDirection: 'row',justifyContent: 'flex-start', alignItems: 'center'}}>
                                    <View style={styles.checkButton}>
                                        {item.selected && <AntDesign name="check" size={24} color={colors.vert} />}
                                    </View>
                                    <ParrainageHeader
                                        getUserProfile={() => navigation.navigate(routes.COMPTE, item.User)}
                                        parrainUser={item.User}
                                        ownerEmail={item.User.email}
                                        ownerUsername={item.User.username}
                                    />
                                </View>

                                { !item.showQuotiteEdit && item.selected && <TouchableOpacity
                                    onPress={() => dispatch(getQuotiteEditShown({...item, parrainAction:item.parrainAction, showQuotiteEdit: true}))}>
                                    <View style={{marginLeft: 50}}>
                                        <AntDesign name="edit" color={colors.rougeBordeau} size={20}/>
                                    </View>
                                </TouchableOpacity>}
                            </View>
                            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                                <AppText style={{fontWeight: 'bold'}}>Quotite:</AppText>
                                <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{item.resteQuotite>=0?item.resteQuotite:item.quotite}</AppText>
                            </View>
                        </TouchableOpacity>
                        {item.showQuotiteEdit && <View style={styles.inputContainer}>
                            <TextInput placeholder='0' keyboardType='numeric' onSubmitEditing={ (event) => handleQuotieValue(event.nativeEvent.text, item)}
                                       style={styles.quotiteInput}/>
                            <View style={{marginLeft: 30}}>
                                <TouchableOpacity onPress={() => dispatch(getQuotiteEditShown({...item, parrainAction: item.parrainAction, showQuotiteEdit: false}))}>
                                    <AntDesign name="close" size={24} color={colors.rougeBordeau} />
                                </TouchableOpacity>
                            </View>
                        </View>}
                        <View style={{position: 'absolute', right: '20%', top: 5}}>
                            {Number(item.parrainAction)>0?<AppText style={{color: colors.rougeBordeau}}>{item.parrainAction}</AppText>:<AppText>{''}</AppText>}

                        </View>

                    </View>)}
                </ScrollView>}
                    {totalParrains === (getTotal()-getPayementRate()) && <View style={{
                        alignItems: 'center',
                        margin: 50
                    }}>
                        <AppButton
                            width={200}
                            title='Continuer'
                            onPress={() => navigation.navigate(routes.ORDER)}/>
                    </View>}
                {listParrains.length === 0 && <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',

                }}>
                    <AppText>Aucun parrain trouvé.</AppText>
                    <AppButton width={200} style={{marginVertical: 50}} title='Ajouter' onPress={() => navigation.navigate('Parrainage', {screen: 'ListeParrainScreen'})}/>
                </View>}
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    checkButton: {
        justifyContent: 'center',
        height:20,
        width: 20,
        marginRight: 20,
        borderWidth: 1
    },
    quotiteInput: {
        width: 100,
        height: 25,
        backgroundColor: colors.blanc,
        borderWidth: 1,
        paddingLeft: 5,
        paddingRight: 5
    },
    inputContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
        flexDirection: 'row'
    }
})

export default OrderParrainageScreen;