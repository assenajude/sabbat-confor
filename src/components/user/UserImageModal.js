import React from 'react';
import {View, Modal, Animated, StyleSheet} from "react-native";
import colors from "../../utilities/colors";
import AppLabelLink from "../AppLabelLink";
import AppIconButton from "../AppIconButton";

function UserImageModal({imageModalVisible, dismissImageModal, takePhoto, chooseImage, deleteImage}) {
    return (
        <Modal animated animationType='slide'  transparent visible={imageModalVisible}>
            <View style={styles.overlay}>
                <Animated.View style={styles.modalContainer} >
                    <AppIconButton
                        buttonContainer={{
                            alignSelf: 'flex-end',
                            marginRight: 10,
                            marginTop: 5
                        }}
                        onPress={dismissImageModal}
                        iconSize={35}
                        iconColor={colors.rougeBordeau}
                        iconName='close'/>
                    <View style={{
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>
                        <AppLabelLink content='prendre une photo' otherTextStyle={{fontSize: 18}}  handleLink={takePhoto}/>
                        <AppLabelLink otherTextStyle={{fontSize: 18}} content='Choisir une image'  handleLink={chooseImage}/>
                        <AppLabelLink otherTextStyle={{fontSize: 18}} content='Supprimer la photo' handleLink={deleteImage}/>
                    </View>
                </Animated.View>
            </View>

        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.blanc,
        paddingBottom: 20,
        height: 250
    }
})

export default UserImageModal;