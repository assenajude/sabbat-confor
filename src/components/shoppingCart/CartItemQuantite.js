import React from 'react';
import {View,StyleSheet, TouchableOpacity } from "react-native";
import {AntDesign} from '@expo/vector-icons'
import AppText from "../AppText";
import colors from "../../utilities/colors";

function CartItemQuantite({quantite,style,minusActive, plusActive, decrementQuantite, incrementQuantite,
                          disabledDecrement, disabledIncrement}) {
    return (
        <View style={[styles.quantite, style]}>
           {minusActive &&
           <TouchableOpacity disabled={disabledDecrement} onPress={decrementQuantite}>
            <AntDesign name='minus' color={colors.blanc} size={15} style={{fontWeight: 'bold', backgroundColor: colors.rougeBordeau}}/>
            </TouchableOpacity>
           }
            <AppText style={{marginRight: 10, marginLeft: 10}}>{quantite}</AppText>
            {plusActive &&
            <TouchableOpacity disabled={disabledIncrement} onPress={incrementQuantite}>
            <AntDesign name='plus' color={colors.blanc} size={15} style={{fontWeight: 'bold', backgroundColor: colors.rougeBordeau}}/>
            </TouchableOpacity>}
        </View>
    );
}


const styles = StyleSheet.create({
    quantite: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0.2,
        height: 20
    }
})
export default CartItemQuantite;