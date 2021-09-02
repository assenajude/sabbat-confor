import React, {useEffect, useState} from 'react';
import {View, StyleSheet} from "react-native";
import colors from "../utilities/colors";
import AppText from "./AppText";
import {useNetInfo} from "@react-native-community/netinfo";
import AppIconButton from "./AppIconButton";


function OfflineNotice({noInternetContainer}) {
    const netInfo = useNetInfo()

    const [noInternet, setNoInternet] = useState(false)

    useEffect(() => {
        const isNotInternet = netInfo.type !== "unknown" && netInfo.isInternetReachable === false
        if(isNotInternet) {
            setNoInternet(true)
        }else{
            setNoInternet(false)
        }
    }, [netInfo])

    if(noInternet) {
        return (
            <View style={[styles.container, noInternetContainer]}>
                <AppIconButton
                    iconColor={colors.bleuFbi}
                    onPress={() => setNoInternet(false)}
                    iconName='close'
                    buttonContainer={{
                    alignSelf: 'flex-end',
                        marginRight:10,
                        marginTop: 5
                }}/>
                <AppText  style={styles.textStyle}>Vous n'avez pas d'accès internet.</AppText>

            </View>
        );
    }
    return null

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.blanc,
        height: 80,
        width: '100%'
    },
    textStyle: {
        color:colors.rougeBordeau,
        fontSize: 15,
        position: 'absolute',
        top: -20
    }
})
export default OfflineNotice;