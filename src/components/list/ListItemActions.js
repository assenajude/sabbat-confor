import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from "react-native";
import { AntDesign } from '@expo/vector-icons';
import colors from "../../utilities/colors";

function ListItemActions({onPress}) {
    return (
        <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.container}>
            <AntDesign name='delete' color={colors.blanc} size={24}/>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.rougeBordeau,
        width: 50,
        justifyContent: "center",
        alignItems: "center"
    }
})
export default ListItemActions;