import React from 'react';
import {View, StyleSheet} from "react-native";
import AppText from "../AppText";
import colors from "../../utilities/colors";
import LottieView from 'lottie-react-native'
import AppIconButton from "../AppIconButton";

function UserAdresseItem({adresseName, villeName, telephone, otherAdresse,
                             email, editAddress,deleteAddress}) {
    return (
        <View style={styles.container}>
            <View style={styles.welcome}>
            <LottieView style={{height: 50, width: '100%'}}
                source={require('../../assets/animations/welcome')}
                loop={true} autoPlay={true}/>
                <View>
                <AppText style={{fontSize: 30, fontWeight: 'bold'}}>{villeName}</AppText>
                <AppText style={{marginTop: -15, fontSize: 15}}>{otherAdresse}</AppText>
                </View>
            </View>
            <AppText style={{fontSize: 25, fontWeight: 'bold', color: colors.or}}>{adresseName}</AppText>
            <AppText iconName='phone' style={{marginLeft: 20}}>{telephone}</AppText>
            <AppText iconName='mail' style={{marginLeft: 20}}>{email}</AppText>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 20
            }}>
                <AppIconButton
                    onPress={editAddress}
                    iconName='account-edit'
                    iconColor={colors.blanc}
                    buttonContainer={[styles.icon, {backgroundColor: colors.bleuFbi}]}
                />
                <AppIconButton
                    onPress={deleteAddress}
                    iconName='account-remove'
                    iconColor={colors.blanc}
                    buttonContainer={[styles.icon, {backgroundColor: colors.rougeBordeau,marginLeft: 30}]}
                />
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        marginVertical: 20,
        backgroundColor: colors.blanc,
    },
    welcome: {
        alignItems: 'center',
        backgroundColor: colors.leger,
        height: 120,
        width: '80%'
    },
   icon: {
       height: 60,
       width: 60,
       borderRadius: 30
   }

})

export default UserAdresseItem;