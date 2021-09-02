import React from 'react';
import {View, StyleSheet, Image, TouchableWithoutFeedback} from 'react-native'
import {Swipeable} from "react-native-gesture-handler";
import {MaterialCommunityIcons} from '@expo/vector-icons'
import AppText from "../AppText";
import useAuth from "../../hooks/useAuth";
import AppIconButton from "../AppIconButton";
import colors from "../../utilities/colors";

function ListItem({imageUrl,selected,selectItem, propriety2, propriety3, propriety4, handleDeleteItem, handleEditItem}) {
    const {userRoleAdmin} = useAuth()
    return (

        <Swipeable renderRightActions={() =>userRoleAdmin()?<View
            style={styles.swipeable}>
            <AppIconButton
                onPress={handleEditItem}
                buttonContainer={{
                    marginVertical: 5,
                }}
                iconColor={colors.bleuFbi}
                iconName='circle-edit-outline'/>
            <AppIconButton
                onPress={handleDeleteItem}
                iconColor={colors.rougeBordeau}
                buttonContainer={{
                    marginHorizontal: 20
                }}
                iconName='delete-forever'/>
        </View> : null}>
            <TouchableWithoutFeedback onPress={selectItem}>
                <View style={styles.container}>
                    <View style={styles.selectContainer}>
                        {selected && <MaterialCommunityIcons name='check' size={24} color={colors.bleuFbi}/> }
                    </View>
                    {imageUrl && <Image source={imageUrl} style={styles.imageStyle}/>}
                    <AppText lineNumber={1} style={styles.info}>{propriety2}   {propriety3}   {propriety4}</AppText>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 80,
        marginTop: 20,
        alignItems: 'center',
        marginHorizontal: 10
    },
    info: {
     marginLeft: 20
    },
    imageStyle: {
        height: 80,
        width: 80,
        overflow: 'hidden'
    },
    swipeable: {
        backgroundColor: colors.leger,
        width: 130,
        height: 80,
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    selectContainer: {
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1
    }
})
export default ListItem;