import React from 'react';
import {StyleSheet, TouchableOpacity} from "react-native";
import {useSelector} from "react-redux";
import colors from "../../utilities/colors";
import {Badge, Avatar} from "react-native-paper";
import AppText from "../AppText";


function AppAvatar({otherContainerStyle,imageSize=30,
                    otherImageStyle, onPress, user,
                    showNottif=true, showInfo}) {

    const compterTotal = useSelector(state => {
       const connectedUser = state.profile.connectedUser
        const orderCompter = connectedUser.articleCompter + connectedUser.locationCompter + connectedUser.serviceCompter
        const factAndFavCompter = connectedUser.factureCompter + connectedUser.favoriteCompter
        const otherCompter = connectedUser.helpCompter + connectedUser.propositionCompter + connectedUser.parrainageCompter
        const compter = orderCompter + factAndFavCompter + otherCompter
        return compter || 0
    })

    return (
            <TouchableOpacity style={[otherContainerStyle, {paddingHorizontal: 10}]} onPress={onPress}>
                <Avatar.Image
                    style={[{backgroundColor: colors.blanc}, otherImageStyle]}
                    size={imageSize}
                    source={Object.keys(user).length>0 && user.avatar?{uri: user.avatar} : require('../../assets/silhouette.png')}/>
                    {showInfo && <AppText>{user.username?user.username : user.nom?user.nom: user.email}</AppText>}
                <Badge
                    visible={showNottif && compterTotal>0}
                    style={styles.avatarBadge}>{compterTotal}</Badge>
            </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    avatarBadge: {
        position: 'absolute',
        top: -5,
        right:-10,
        zIndex: 1
    }
})

export default AppAvatar;