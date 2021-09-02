import React from 'react';
import {useSelector} from "react-redux";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {AntDesign} from '@expo/vector-icons'

import AccueilNavigator from "./AccueilNavigator";
import AppIconWithBadge from "../components/AppIconWithBadge";
import LocationNavigator from "./LocationNavigator";
import CommerceNavigator from "./CommerceNavigator";
import ServiceNavigator from "./ServiceNavigator";

function TabNavigation(props) {
    const Tab = createBottomTabNavigator();
    const homeCounter = useSelector(state => state.entities.main.homeCounter)
    const serviceCompter = useSelector(state => state.entities.service.serviceRefresh)


    return (
        <Tab.Navigator
            screenOptions={{
            "tabBarActiveTintColor": "#fff",
            "tabBarActiveBackgroundColor": "#860432",
            "tabBarStyle": [
                {
                    "display": "flex"
                },
                null
            ]
        }
        }
        >
        <Tab.Screen
            name="AccueilNavigator"
            component={AccueilNavigator}
            options={() =>({
                tabBarIcon: ({size, color}) =>
                    <AppIconWithBadge
                        color={color}
                        size={size}
                        name='home'
                        badgeCount={homeCounter} />,
                title: 'Accueil',
                headerShown: false
                })}/>

        <Tab.Screen
            name="E-commerce"
            component={CommerceNavigator}
                    options={{
                        tabBarIcon: ({size, color}) =>
                            <AntDesign
                                name="shoppingcart"
                                size={size} color={color} />,
                        title: 'commerce',
                        headerShown: false
                    }} />

        <Tab.Screen
            name="E-location"
            component = {LocationNavigator}
            options={{
                tabBarIcon: ({size, color}) =>
                    <AppIconWithBadge
                        color={color}
                        size={size}
                        name='warehouse' />,
                title:'location',
                headerShown: false
            }}/>


            <Tab.Screen
                name="E-service"
                component={ServiceNavigator}
                options={{
                    tabBarIcon: ({size, color}) =>
                        <AppIconWithBadge
                            size={size}
                            color={color}
                            name='handshake'
                            badgeCount={serviceCompter} />,
                    title: 'service',
                    headerShown: false
                }}/>

    </Tab.Navigator>
);
}

export default TabNavigation;