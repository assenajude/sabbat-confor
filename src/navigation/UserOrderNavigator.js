import React from 'react';
import {Dimensions} from 'react-native'
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import UserOrderScreen from "../screens/UserOrderScreen";
import UserOrderContratScreen from "../screens/UserOrderContratScreen";
import UserOrderHistoryScreen from "../screens/UserOrderHistoryScreen";


const UserCmdeTopNavigator = createMaterialTopTabNavigator()

function UserOrderNavigator(props) {
    return (
        <UserCmdeTopNavigator.Navigator
            initialLayout={{width: Dimensions.get('window').width}}
            initialRouteName='UserOrderScreen'
            screenOptions={{
                "tabBarLabelStyle": {
                    "textTransform": "none"
                }
            }}>
            <UserCmdeTopNavigator.Screen name='UserOrderContratScreen' component={UserOrderContratScreen} options={{
                title: 'Contrats'
            }}/>
            <UserCmdeTopNavigator.Screen name='UserOrderScreen' component={UserOrderScreen} options={{
                title: 'Demandes'
            }}/>
            <UserCmdeTopNavigator.Screen name='UserOrderHistoryScreen' component={UserOrderHistoryScreen} options={{
                title: 'historique'
            }}/>

        </UserCmdeTopNavigator.Navigator>
    );
}

export default UserOrderNavigator;