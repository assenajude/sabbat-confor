import React from 'react';
import {View,Image,StyleSheet, TouchableOpacity} from 'react-native';
import {AntDesign} from '@expo/vector-icons'

import Color from '../../utilities/colors'
import AppText from "../AppText";
import AppButton from "../AppButton";
import CartItemQuantite from "./CartItemQuantite";
import useAuth from "../../hooks/useAuth";
import AppIconButton from "../AppIconButton";


function CartItem({source, designation,icon=false, activeDecrement,deleteItem,caution,frequence,
                      price, min, max, montantMin,montantMax,  montant, activeIncrement,showItemDetails,
                      quantite, itemQuantite,itemAmount, itemPrice, showCartItem,quantityDecrement, quantityIncrement,
                  disabledDecrement, disabledIncrement, notInStock, itemType}) {
    const {formatPrice} = useAuth()
    return (
        <View style={styles.mainContainer}>
            <View style={styles.itemContainer}>
                <View>
                    <TouchableOpacity onPress={showCartItem}>
                    <Image style={styles.imageStyle} source={source}/>
                    <View style={{width: 100}}>
                    <AppText lineNumber={1}>{designation}</AppText>
                    </View>
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <AppIconButton iconName='text-box-search' iconColor={Color.dark} onPress={showItemDetails}/>
                        <AppIconButton iconColor={Color.rougeBordeau}  iconName='delete-forever' onPress={deleteItem}/>
                    </View>
                </View>
                <View style={styles.secondContainer}>
               {price && <AppText style={{fontSize: 15}}>{formatPrice(itemPrice)}</AppText>}
                    {quantite && <CartItemQuantite disabledDecrement={disabledDecrement} disabledIncrement={disabledIncrement} minusActive={activeDecrement} plusActive={activeIncrement} quantite={itemQuantite} decrementQuantite={quantityDecrement} incrementQuantite={quantityIncrement}/>}
                {montant && <AppText style={{fontSize: 15}}>{formatPrice(itemAmount)}</AppText>}

                    {min && <AppText>{formatPrice(montantMin)}</AppText>}
                    {icon && <AntDesign name='minus' size={24} color='black'/>}
                    {max && <AppText>{formatPrice(montantMax)}</AppText>}

                </View>
            </View>
            {itemType === 'location' && <View style={{
                flexDirection: 'row',
                justifyContent: 'center'
            }}>
                <AppText style={{fontWeight: 'bold'}}>Caution: </AppText>
                <AppText style={{fontWeight: 'bold', color: Color.rougeBordeau}}>{caution} {frequence.toLowerCase() === 'mensuelle'?'Mois':'Jours'}</AppText>
            </View>}
            {notInStock && <View style={styles.notInStock}>
                <AppText style={{color: Color.rougeBordeau}}>Rupture de stock</AppText>
            </View>}
            {notInStock && <View style={styles.deleteNotInStock}>
                <AppButton
                    style={{backgroundColor: Color.rougeBordeau}}
                    onPress={deleteItem}
                    iconName='delete'
                    title='supprimer'/>
            </View>}
        </View>
    );

}

const styles = StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        borderColor: Color.leger,
        marginVertical: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginHorizontal: 10

    },
    secondContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -30
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    imageStyle: {
        height: 60,
        width: 60
    },
    notInStock: {
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8,
        backgroundColor: Color.blanc,
        width:'100%',
        height: '100%'
    },
    deleteNotInStock: {
        position: 'absolute',
        alignSelf: 'center',
        zIndex: 2,
    }

})

export default CartItem;