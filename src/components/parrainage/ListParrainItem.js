import React from 'react';
import {View, StyleSheet, TouchableOpacity} from "react-native";
import {FontAwesome, MaterialCommunityIcons} from '@expo/vector-icons';

import AppText from "../AppText";
import colors from "../../utilities/colors";
import AppAvatar from "../user/AppAvatar";
import AppIconButton from "../AppIconButton";
import useAuth from "../../hooks/useAuth";


function ListParrainItem({avatarUser,parrainUsername, parrainEmail,
                             parrainQuotite,remakeParrainage,getUserProfile,
                             sendMessageToParrain, activeCompte, inSponsoring=false,
                             isParrain, isFilleul,msgResponded=false, parrainageResponseEditing,
                             editParrainageResponse, sendParrainageResponse, stopParrainage}) {
    const {formatPrice} = useAuth()

    return (
        <>
            <View  style={styles.container}>
                {parrainageResponseEditing && <View style={{alignItems: 'center', backgroundColor:colors.lightGrey, padding: 10}}>
                    <View style={{alignSelf: 'flex-end'}}>
                        <AppIconButton
                            buttonContainer={{backgroundColor: colors.rougeBordeau}}
                            onPress={editParrainageResponse}
                            iconColor={colors.blanc}
                            iconName='close'
                        />
                    </View>
                   {!inSponsoring && !msgResponded &&
                   <View style={styles.demande}>
                        <AppText style={{fontWeight: 'bold'}}>Demande de parrainage</AppText>
                       <AppIconButton
                           buttonContainer={{backgroundColor: colors.vert}}
                           iconColor={colors.blanc}
                           onPress={sendParrainageResponse}
                           iconName='account-check'
                       />
                    </View>}
                    {inSponsoring && <View style={{flexDirection: 'row'}}>
                        <AppText style={{fontWeight:'bold'}}>Arrêt de parrainage</AppText>

                        <AppIconButton
                            buttonContainer={{
                                backgroundColor: colors.rougeBordeau
                            }}
                            iconName='account-remove'
                            iconColor={colors.blanc}
                            onPress={stopParrainage}/>

                    </View>}
                    {!inSponsoring && msgResponded && <View style={{flexDirection: 'row'}}>
                        <AppText style={{fontWeight:'bold'}}>Reprise de parrainage</AppText>
                        <AppIconButton
                            iconColor={colors.blanc}
                            iconName='backup-restore'
                            onPress={remakeParrainage}
                            buttonContainer={{
                                backgroundColor: colors.bleuFbi
                            }}/>
                    </View>}

                </View>}
                <View style={{flexDirection: 'row', justifyContent: 'space-between', padding: 10}}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <AppAvatar
                            user={avatarUser}
                            showNottif={false}
                            onPress={getUserProfile}/>
                        <View style={{alignItems: 'flex-start'}}>
                            <AppText style={{fontWeight: 'bold'}}>{parrainUsername}</AppText>
                            <AppText>{parrainEmail}</AppText>
                        </View>
                    </View>
                    <View>
                        {isParrain && <View>
                            {!msgResponded && <AppText style={{color: colors.bleuFbi}}>envoyé</AppText>}
                            {msgResponded && inSponsoring &&
                            <TouchableOpacity style={styles.demandeIcon} onPress={editParrainageResponse}>
                                <View style={{flexDirection: 'row'}}>
                                    <MaterialCommunityIcons name="bus-stop-covered" size={25} color={colors.vert} />
                                    <AppText style={{color: colors.vert, fontWeight: 'bold'}}>P</AppText>
                                </View>
                            </TouchableOpacity>}
                            {msgResponded && !inSponsoring &&
                            <TouchableOpacity style={styles.demandeIcon} onPress={editParrainageResponse}>
                                <MaterialCommunityIcons name="bus-stop-covered" size={25} color={colors.rougeBordeau} />
                            </TouchableOpacity>}
                        </View>}
                       {isFilleul && !parrainageResponseEditing && <View>
                           {!msgResponded && !inSponsoring &&
                           <TouchableOpacity style={styles.demandeIcon} onPress={editParrainageResponse}>
                               <MaterialCommunityIcons name="bus-stop-covered" size={25} color='orange' />
                           </TouchableOpacity>}
                           {msgResponded && !inSponsoring &&
                           <TouchableOpacity style={styles.demandeIcon} onPress={editParrainageResponse}>
                               <MaterialCommunityIcons name="bus-stop-covered" size={25} color={colors.rougeBordeau} />
                           </TouchableOpacity>}
                           {msgResponded && inSponsoring &&
                           <TouchableOpacity style={styles.demandeIcon} onPress={editParrainageResponse}>
                               <View style={{flexDirection: 'row'}}>
                                   <MaterialCommunityIcons name="bus-stop-covered" size={25} color={colors.vert} />
                                   <AppText style={{color: colors.vert, fontWeight: 'bold'}}>F</AppText>
                               </View>
                           </TouchableOpacity>}

                        </View>}
                        {!isFilleul && !isParrain && <View>
                            <TouchableOpacity onPress={sendMessageToParrain}>
                                <FontAwesome name="send" size={25} color={colors.bleuFbi} />
                            </TouchableOpacity>
                        </View>}
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                    <AppText style={{fontWeight: 'bold', fontSize: 18, color: colors.bleuFbi}}>Quotité</AppText>
                    <AppText style={{marginLeft: 50, fontWeight: 'bold', fontSize: 18, color: colors.bleuFbi}}>{formatPrice(parrainQuotite)}</AppText>
                </View>
            {!activeCompte && <View style={styles.inactive}>
            </View>}
                {!activeCompte && <View style={styles.inactifText}>
                    <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Compte inactif</AppText>
                </View>}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    avatarStyle: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    container: {
        backgroundColor: colors.blanc,
        padding: 10,
        marginVertical:10
    },
    inactive: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        opacity: 0.6,
        zIndex: 1,
        backgroundColor: colors.blanc
    },
    inactifText: {
        position: 'absolute',
        zIndex: 10,
        alignSelf: "center"
    },
    demande: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginVertical: 20
    },
    demandeIcon: {
        backgroundColor: colors.leger,
        height: 60,
        width: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center'
    }
})
export default ListParrainItem;