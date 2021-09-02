import React from 'react';
import {Dimensions} from 'react-native'
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import UserServiceScreen from "../screens/UserServiceScreen";
import UserServiceContratScreen from "../screens/UserServiceContratScreen";
import UserServiceHistoryScreen from "../screens/UserServiceHistoryScreen";

const ServiceTopNavigator = createMaterialTopTabNavigator()
function UserServiceNavigator(props) {
    return (
        <ServiceTopNavigator.Navigator
            initialLayout={{width: Dimensions.get('window').width}}
            initialRouteName='UserServiceScreen'
            screenOptions={{
                "tabBarLabelStyle": {
                    "textTransform": "none"
                }
            }}
        >
            <ServiceTopNavigator.Screen name='UserServiceContratScreen' component={UserServiceContratScreen} options={{
                title: 'Contrats'
            }}/>

            <ServiceTopNavigator.Screen name='UserServiceScreen' component={UserServiceScreen} options={{
                title: 'Demandes'
            }}/>
            <ServiceTopNavigator.Screen name='UserServiceHistoryScreen' component={UserServiceHistoryScreen} options={{
                title: 'Historique'
            }}
            />
        </ServiceTopNavigator.Navigator>
    );
}

export default UserServiceNavigator;