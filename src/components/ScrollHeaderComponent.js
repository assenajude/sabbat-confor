import React from 'react';
import {View, StyleSheet} from "react-native";
import {IconButton,Badge} from 'react-native-paper'
import {useSelector} from "react-redux";
import {useNavigation} from '@react-navigation/native'
import colors from "../utilities/colors";
import AppAvatar from "./user/AppAvatar";
import AppShoppingCart from "./shoppingCart/AppShoppingCart";

function ScrollHeaderComponent() {
    const navigation = useNavigation()
    const user = useSelector(state => state.auth.user)

    return (
        <View style={styles.avatar}>
            <AppAvatar
                user={user}
                onPress={() => navigation.openDrawer()}/>
            <AppShoppingCart
                onPress={() => navigation.navigate('AccueilNavigator', {screen: 'ShoppingCartScreen'})}/>
        </View>
    );
}
const styles = StyleSheet.create({
    avatar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.rougeBordeau,
        paddingVertical: 5,
        height: 50,
    },
})

export default ScrollHeaderComponent;