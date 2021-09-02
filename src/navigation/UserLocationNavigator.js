import React from 'react';
import {Dimensions} from 'react-native'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import UserLocationScreen from "../screens/UserLocationScreen";
import UserLocationContratScreeen from "../screens/UserLocationContratScreeen";
import UserLocationHistoryScreen from "../screens/UserLocationHistoryScreen";

const LocationTopTab = createMaterialTopTabNavigator()

function UserLocationNavigator(props) {
    return (
        <LocationTopTab.Navigator
            initialRouteName='UserLocationScreen'
            initialLayout={{width: Dimensions.get('window').width}}
            screenOptions={{
                "tabBarLabelStyle": {
                    "textTransform": "none"
                }
            }}>
            <LocationTopTab.Screen name='UserLocationContratScreen' component={UserLocationContratScreeen} options={{
                title: 'Contrats'
            }}/>

            <LocationTopTab.Screen name='UserLocationScreen' component={UserLocationScreen} options={{
                title: 'Demandes'
            }}/>

            <LocationTopTab.Screen name='UserLocationHistoryScreen' component={UserLocationHistoryScreen} options={{
                title: 'historique'
            }}/>

        </LocationTopTab.Navigator>
    );
}

export default UserLocationNavigator;