import React from 'react';
import {Modal, View, TouchableOpacity, FlatList, StyleSheet, TextInput, Keyboard} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import colors from "../../utilities/colors";
import AppButton from "../AppButton";
import {useDispatch, useSelector} from "react-redux";
import ParrainageHeader from "../parrainage/ParrainageHeader";
import {getQuotiteEditShown, getSelectedParrain} from "../../store/slices/parrainageSlice";
import AppText from "../AppText";
import ItemSeparator from "../list/ItemSeparator";
import {getAddOrderParrain} from "../../store/slices/orderSlice";
import usePlaceOrder from "../../hooks/usePlaceOrder";

function ParrainListModal({parrainageModalVisible, dismissParrainModal}) {
    const dispatch = useDispatch()
    const {getTotal} = usePlaceOrder()
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
        if(actionValue !== '') {
            const parsingAction = Number(actionValue)
            const compteData = {...selectedItem, parrainAction: parsingAction, showQuotiteEdit: false}
            dispatch(getAddOrderParrain(compteData))
            dispatch(getQuotiteEditShown(compteData))
        } else {
            alert("Vous n'avez pas specifié la valeur de la quotité")
        }

    }


    return (
        <Modal visible={parrainageModalVisible} transparent>
            <View style={{height: "85%", backgroundColor: colors.blanc, top: 55}}>
            <View style={{alignSelf: 'flex-end', margin: 10}}>
                <TouchableOpacity onPress={dismissParrainModal}>
                    <AntDesign style={{fontWeight: 'bold'}} name="close" size={24} color={colors.rougeBordeau}/>
                </TouchableOpacity>
            </View>
                <View style={{flexDirection: 'row', alignItems: 'center',
                padding: 20}}>
                    <AntDesign name="infocirlceo" size={20} color={colors.bleuFbi} />
                    <AppText style={{marginLeft: 10, color: colors.bleuFbi}}>La couverture parrains doit être à 100% de votre commande</AppText>
                </View>
                <View style={{flexDirection: 'row', borderWidth: 1, width: '100%',
                    justifyContent: 'center', alignSelf: 'center', margin: 10}}>
                    <AppText style={{fontWeight: 'bold'}}>Couverture parrains: </AppText>
                    <AppText style={{color: colors.rougeBordeau}}> {totalParrains}</AppText>
                    <AppText>/</AppText>
                    <AppText>{getTotal()}</AppText>
                </View>
            {listParrains.length>0 && <FlatList ItemSeparatorComponent={() =><ItemSeparator/>} data={listParrains} keyExtractor={item => item.id.toString()}
            renderItem={({item}) =><View style={{padding: 10, marginTop: 10}}>
                <TouchableOpacity onPress={() => selectItem(item)}>
                <View style={{flexDirection: 'row', justifyContent:'space-between', alignItems: 'center'}}>
                    <View style={{flexDirection: 'row',justifyContent: 'flex-start', alignItems: 'center'}}>
                    <View style={styles.checkButton}>
                        {item.selected && <AntDesign name="check" size={24} color={colors.vert} />}
                    </View>
                    <ParrainageHeader ownerUserAvatar={item.User.avatar} ownerEmail={item.User.email}
                                  avatarUrl={{uri: item.User.avatar}} ownerUsername={item.User.username}/>
                    </View>

                { !item.showQuotiteEdit && item.selected && <TouchableOpacity onPress={() => dispatch(getQuotiteEditShown(item))}>
                        <View style={{marginLeft: 50}}>
                        <AntDesign name="edit" color={colors.rougeBordeau} size={20}/>
                        </View>
                    </TouchableOpacity>}
                </View>
                    <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                        <AppText style={{fontWeight: 'bold'}}>Quotite:</AppText>
                        <AppText style={{fontWeight: 'bold', color: colors.rougeBordeau}}>{item.resteQuotite?item.resteQuotite:item.quotite}</AppText>
                    </View>
                </TouchableOpacity>
                {item.showQuotiteEdit && <View style={styles.inputContainer}>
                    <TextInput placeholder='0' keyboardType='numeric' onSubmitEditing={ (event) => handleQuotieValue(event.nativeEvent.text, item)}
                               style={styles.quotiteInput}/>
                    <View style={{marginLeft: 30}}>
                    <TouchableOpacity onPress={() => dispatch(getQuotiteEditShown(item))}>
                        <AntDesign name="close" size={24} color={colors.rougeBordeau} />
                    </TouchableOpacity>
                    </View>
                </View>}
                <View style={{position: 'absolute', right: '20%', top: 5}}>
                    {Number(item.parrainAction)>0?<AppText style={{color: colors.rougeBordeau}}>{item.parrainAction}</AppText>:<AppText>''</AppText>}

                </View>

            </View>}/>}
            {listParrains.length === 0 && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Aucun parrain trouvé.</AppText>
            </View>}
                <View style={{alignSelf: 'flex-end', margin: 20}} >
                    <AppButton title='fermer' onPress={dismissParrainModal}/>
                </View>
            </View>
        </Modal>
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
        justifyContent: 'flex-end',
        margin: 20,
        flexDirection: 'row'
    }
})
export default ParrainListModal;