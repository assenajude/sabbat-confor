import React from 'react';
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import UserFactureScreen from "../screens/UserFactureScreen";
import UserFactureOkScreen from "../screens/UserFactureOkScreen";
import UserFactureEncoursScreen from "../screens/UserFactureEncoursScreen";
import {Dimensions} from "react-native";

const UserFactTopNavigator = createMaterialTopTabNavigator()

function UserFactureNavigator(props) {
    return (
        <UserFactTopNavigator.Navigator
            initialLayout={{width: Dimensions.get('window').width}}
            screenOptions={{
                "tabBarLabelStyle": {
                    "textTransform": "none"
                }
            }} >
            <UserFactTopNavigator.Screen name='UserFactureScreen' component={UserFactureScreen} options={{
                title: 'Tous'
            }}/>
            <UserFactTopNavigator.Screen name='UserFactureEncoursScreen' component={UserFactureEncoursScreen} options={{
                title: 'En cours'
            }}/>
            <UserFactTopNavigator.Screen name='UserFactureOkScreen' component={UserFactureOkScreen} options={{
                title: 'soldées'
            }}/>
        </UserFactTopNavigator.Navigator>
    );
}

export default UserFactureNavigator;