import React from 'react';
import {ScrollView,Image, View, StyleSheet} from 'react-native'
import AppText from "../components/AppText";
import colors from "../utilities/colors";
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import AppLabelLink from "../components/AppLabelLink";

function HelpScreen({navigation}) {
    return (
        <ScrollView>
            <Image source={require('../assets/help.jpg')} style={{
                width: '100%',
                height: 300
            }}/>
            <View style={{padding: 10}}>
            <AppText style={{color: colors.rougeBordeau, fontWeight: 'bold'}}>Avez-vous besoin d'aide?</AppText>
            <AppText style={{fontWeight: 'bold'}}>Contactez nous ici</AppText>
            <View style={{marginTop: 40}}>
                <View style={styles.phoneContact}>
                    <View style={{left: 20, flexDirection: 'row', justifyContent: 'center',alignItems: 'center'}}>
                    <FontAwesome5 name="whatsapp-square" size={40} color="green" />
                    <AntDesign name="phone" size={30} color="black" />
                    </View>
                    <View>
                        <AppText style={{marginLeft: '20%', fontSize: 18, fontWeight: 'bold'}}>+225 0708525827</AppText>
                        <AppText style={{fontWeight: 'bold'}}>sabbat.com</AppText>
                    </View>

                </View>
                <View style={styles.messengerContact}>
                    <View style={{left: 20, flexDirection: 'row'}}>
                    <AntDesign name="facebook-square" size={40} color="blue" />
                    <FontAwesome5 name="facebook-messenger" size={40} color="blue" />
                    </View>
                    <AppText style={{marginLeft: '20%', fontWeight: 'bold', fontSize: 18}}>sabbat.com</AppText>
                </View>
                <View style={styles.faq}>
                <AppText>Consulter la</AppText>
                    <AppLabelLink
                        otherTextStyle={{fontSize: 18}}
                        handleLink={() => navigation.navigate('AccueilNavigator', {screen: 'FaqScreen'})}
                        content='FAQ'/>
                    <AppText>ou</AppText>
                    <AppLabelLink
                        otherTextStyle={{fontSize: 18}}
                        handleLink={() => navigation.navigate('AccueilNavigator', {screen: 'QuestionScreen'})}
                        content='Poser une question' />
                </View>
            </View>
                <AppLabelLink
                    otherTextStyle={{fontSize: 18}}
                    handleLink={() => navigation.navigate('CGUScreen')}
                    containerStyle={{
                        marginVertical: 20
                    }}
                    content="Conditions Générales d'utilisation"/>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    phoneContact: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    messengerContact: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    faq: {
        marginTop: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default HelpScreen;