import React from 'react';
import {View, useWindowDimensions} from 'react-native'
import {createDrawerNavigator} from "@react-navigation/drawer";
import {MaterialCommunityIcons} from '@expo/vector-icons'

import DrawerContent from '../components/user/DrawerContent';
import TabNavigation from "./TabNavigation";

import AppText from "../components/AppText";


const Drawer = createDrawerNavigator();

function UserCompteNavigation(props) {
    const dimensions = useWindowDimensions();

    const isLargeScreen = dimensions.width >= 768;

    return (
                <Drawer.Navigator
                    screenOptions={{
                        overlayColor: 'transparent',
                        drawerStyle: isLargeScreen ? null : { width: '90%' },
                    }}
                    drawerContent={(props) =>
                        <DrawerContent {...props}/>}
                >
                    <Drawer.Screen
                        name='Accueil'
                        component={TabNavigation}
                        options={() => ({
                            headerShown: false,
                            drawerLabel: () => <View style={{
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <MaterialCommunityIcons name='home' size={24}/>
                                <AppText style={{marginLeft: 30}}>Accueil</AppText>
                            </View>
                        })}
                    />
                </Drawer.Navigator>

    );

}

export default UserCompteNavigation;