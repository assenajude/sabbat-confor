import React from 'react';
import {Badge, IconButton} from "react-native-paper";
import colors from "../../utilities/colors";
import {View, StyleSheet} from "react-native";
import {useSelector} from "react-redux";

function AppShoppingCart({onPress}) {
    const cartItemLenght = useSelector(state => state.entities.shoppingCart.itemsLenght)

    return (
        <View>
            <IconButton
                color={colors.blanc}
                icon="cart"
                size={30}
                onPress={onPress}
            />
            <Badge
                visible={cartItemLenght>0}
                style={styles.badge}
            >{cartItemLenght}</Badge>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        top:5,
        right:10,
        position: 'absolute'
    },
})

export default AppShoppingCart;