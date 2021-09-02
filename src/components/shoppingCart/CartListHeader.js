import React from 'react';
import {View, StyleSheet} from 'react-native'
import AppText from "../AppText";

function CartListHeader({prix, quantite, montant, min, max}) {
    return (
        <View style={styles.header}>
            <AppText style={styles.textStyle}>Produit</AppText>
           {prix && <AppText style={{fontWeight: 'bold', marginLeft: 60}}>Prix</AppText>}
            { quantite && <AppText style={styles.textStyle} >Quantité</AppText>}
           {montant && <AppText style={styles.textStyle}>Montant</AppText>}
            {min && <AppText style={styles.textStyle}>Montant minimum</AppText>}
            {max && <AppText style={styles.textStyle}>Montant maximum</AppText>}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    textStyle: {
        fontWeight: 'bold',
        fontSize: 15
    }
})

export default CartListHeader;