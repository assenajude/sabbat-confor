import React from 'react';
import {TouchableWithoutFeedback, StyleSheet, Image, View, Alert} from "react-native";
import * as ImagePicker from 'expo-image-picker'
import {Entypo} from "@expo/vector-icons";

import colors from "../utilities/colors";

function AppInputImage({imageUrl, changeImage}) {

    const chooseImage = async () => {
        try {
            if(imageUrl) {
                Alert.alert('Alert', 'Voulez vous supprimer cette image?', [
                    {text: 'oui', onPress: () => changeImage(null)},
                    {text: 'non', onPress: () => {return;}}
                    ] )

            } else {
                const result = await ImagePicker.requestMediaLibraryPermissionsAsync()
                if(!result.granted) return ;
                const image = await ImagePicker.launchImageLibraryAsync({
                    base64: true
                })
                if(image.cancelled) return;
                changeImage({url: image.uri, base64Data:image.base64})
            }
        } catch (e) {
            throw new Error(`erreur: ${e}`)
        }
    }

    return (
        <TouchableWithoutFeedback onPress={chooseImage}>
            <View style={styles.container}>
            {!imageUrl && <Entypo name='camera' size={40} color={colors.dark}/>}
            {imageUrl && <Image source={{uri: imageUrl}} style={styles.imageStyle}/>}
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: colors.blanc,

    },
    imageStyle: {
        height: "100%",
        width: "100%"
    }
})

export default AppInputImage;