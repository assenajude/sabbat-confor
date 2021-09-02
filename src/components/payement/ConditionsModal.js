import React from 'react';
import {ScrollView, Modal, View, StyleSheet, TouchableOpacity} from "react-native";

import AppText from "../AppText";
import colors from "../../utilities/colors";
import AppIconButton from "../AppIconButton";

function ConditionsModal({conditionModalVisible, dismissConditionModal}) {
    return (
        <Modal visible={conditionModalVisible} style={styles.modalStyle} transparent>
            <View style={{height: "88%", backgroundColor: colors.blanc,
                alignItems: 'center', justifyContent: 'center', top: 55}}>
                <View style={{alignSelf: 'flex-end', margin: 10}}>
                    <AppIconButton
                        iconColor={colors.rougeBordeau}
                        onPress={dismissConditionModal}
                        iconName='close'
                    />
                </View>
            <ScrollView contentContainerStyle={{padding: 20, alignItems:'center'}} >
               <View>
                   <AppText style={{fontWeight: 'bold', color: colors.bleuFbi}}>Conditions generales commandes à crédit</AppText>
                   <AppText></AppText>
               </View>
                <View style={styles.itemStyle}>
                    <AppText style={{fontWeight: 'bold', marginLeft: 10}}>NB:</AppText>
                    <View>
                        <AppText> Pour reussir une commande à crédit, assurez-vous de completer votre profile utilisateur.
                            Editer votre compte utilisateur et ajouter toutes les informations demandées, une image, votre piece identité etc.
                            Ensuite utiliser l'une ou l'autre des conditions ci-dessous pour faire votre commande.
                        </AppText>
                    </View>
                </View>
                <View style={[styles.itemStyle, {marginTop: 20}]}>
                    <AppText style={{fontWeight: 'bold'}}> 1 -</AppText>
                        <View style={{alignItems: 'flex-start'}}>
                            <AppText style={{fontWeight: 'bold'}}>Atteindre le seuil de liberté</AppText>
                            <AppText> Le seuil de liberté est de 500 000 XOF, c'est le cumul de toutes vos commandes payées cash.
                                Faites des commandes et payez cash afin d'attendre le seuil de liberté et vous serez desormais libre de faire les commandes et choisir le mode de payement "credit".</AppText>
                        </View>
                </View>
                <View style={[styles.itemStyle, {marginTop: 20}]}>
                    <AppText style={{fontWeight: 'bold'}}>2 - </AppText>
                    <View style={{alignItems: 'flex-start'}}>
                        <AppText style={{fontWeight: 'bold'}}>Utiliser le systeme de parrainage</AppText>
                        <AppText>Le systeme de parrainage vous permet de faire une commande à crédit sous la garantie d'un parrain.
                            Même si vous n'êtes pas éligible par la condition 1, vous pouvez vous servir de la condition 2,
                            créer un compte de parrainage initial (aller dans le menu "parrainage" puis creer votre compte). Une fois le compte créé,
                            aller dans la liste de tous les comptes parrains puis ajouter ceux que vous desirez qu'ils soient vos parrains.
                            Vous devez donc attendre leur reponse avant de les utiliser lors de vos commandes comme parrains.</AppText>
                    </View>
                </View>
                <View style={{alignSelf: 'flex-end', margin: 10}}>
                    <TouchableOpacity onPress={dismissConditionModal}>
                        <AppText style={{fontWeight: 'bold', fontSize: 20, color: colors.bleuFbi}}>ok</AppText>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalStyle: {
        top: 50,
        bottom: 50
    },
    itemStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingRight: 10,
        paddingLeft: 10
    }
})
export default ConditionsModal;