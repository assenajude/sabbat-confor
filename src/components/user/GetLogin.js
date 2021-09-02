import React from 'react';
import {useNavigation} from '@react-navigation/native'
import {View} from "react-native";
import AppText from "../AppText";
import AppButton from "../AppButton";
import routes from "../../navigation/routes";

function GetLogin({message}) {
    const navigation = useNavigation()
    return (
        <View style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
        }}>
            <AppText>{message}</AppText>
            <AppButton title='me connecter' onPress={() => navigation.navigate(routes.LOGIN)}/>
        </View>
    );
}

export default GetLogin;