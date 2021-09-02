import React from 'react';
import {View, StyleSheet, TouchableOpacity} from "react-native";
import AppAvatar from "../user/AppAvatar";
import AppText from "../AppText";

function ParrainageHeader({parrainUser, ownerUsername, ownerEmail, getUserProfile, action}) {

    return (
        <TouchableOpacity onPress={getUserProfile} style={{
            marginVertical: 10,
        }}>
            <View style={styles.headerContainer}>
                <AppAvatar
                    user={parrainUser}
                    showNottif={false}
                    onPress={getUserProfile}
                />
                <View style={{
                    alignItems: 'flex-start',
                }}>
                     <AppText>{ownerUsername?ownerUsername : ownerEmail}</AppText>
                    {action && <AppText style={{marginTop: -10}}>{action}</AppText>}
                </View>
            </View>
        </TouchableOpacity>
    );
}
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default ParrainageHeader;