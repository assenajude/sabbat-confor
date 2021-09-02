import React from 'react';
import {View, TouchableOpacity, StyleSheet,Image} from "react-native";
import * as ImagePicker from 'expo-image-picker'

import colors from "../../utilities/colors";
import AppText from "../AppText";
import UserImageModal from "./UserImageModal";
import AppIconButton from "../AppIconButton";


function ProfileImagePicker({onChangeImage,onChangePhoto, imageUrl,showImageModal,
                                imageLabel,deleteImage,imageModalVisible,dismissImageModal,
                                deleteExistImage, otherImageStyle})
{


    const chooseImage = async() => {
        try {
        const result = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(!result.granted) {
            alert("Vous devez accepter pour choisir l'image.")
            return ;
        }
        const selectedImage = await ImagePicker.launchImageLibraryAsync({base64: true, allowsEditing: true})

        if(selectedImage.cancelled) {
            return ;
        }

        onChangeImage({url: selectedImage.uri, base64Data: selectedImage.base64})
        } catch (e) {
           throw new Error(e)
        }

    }

    const takePhoto = async () => {
        try {
        const result  = await ImagePicker.requestCameraPermissionsAsync()
        if(!result.granted) {
            alert('Vous devez accepter pour prendre la photo')
            return ;
        }
        const photo = await ImagePicker.launchCameraAsync({base64: true, allowsEditing:true})
        if(photo.cancelled) {
            return;
        }
        onChangePhoto({url: photo.uri, base64Data: photo.base64})
        } catch (e) {
          throw new Error(e)
        }
    }

    return (
        <>
            <UserImageModal
                imageModalVisible={imageModalVisible} dismissImageModal={dismissImageModal}
                chooseImage={chooseImage} takePhoto={takePhoto} deleteImage={deleteImage}/>
            <View style={styles.container}>
                <View>
                    {!imageUrl && <View style={styles.imageContainer}>
                        <AppText>{imageLabel}</AppText>
                    </View>}
                    {imageUrl &&  <TouchableOpacity onPress={deleteExistImage}>
                     <Image source={imageUrl} style={[styles.imageStyle, otherImageStyle]}/>
                    </TouchableOpacity>}
                </View>
                <AppIconButton
                    onPress={showImageModal}
                    buttonContainer={{
                    height: 60,
                        width: 60
                }}
                    iconColor={colors.dark}
                    iconSize={40}
                    iconName="camera"/>
            </View>
            </>
    );
}

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
        margin: 10
    },
    cameraStyle: {
        width: 60,
        height: 60,
        backgroundColor: colors.blanc,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.blanc,
        borderWidth: 1
    },
    imageStyle: {
        height:80,
        width: 80,
        margin: 10
    }

})

export default ProfileImagePicker;