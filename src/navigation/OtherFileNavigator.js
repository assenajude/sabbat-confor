import React from 'react';
import {createStackNavigator} from '@react-navigation/stack'

import OtherFileMain from "../screens/OtherFileMain";
import color from '../utilities/colors'
import CategorieScreen from "../screens/CategorieScreen";
import NewCategorieScreen from "../screens/NewCategorieScreen";
import PayementScreen from "../screens/PayementScreen";
import PointRelaisScreen from "../screens/PointRelaisScreen";
import NewPointRelaisScreen from "../screens/NewPointRelaisScreen";
import RegionScreen from "../screens/RegionScreen";
import VilleScreen from "../screens/VilleScreen";
import AppAvatar from "../components/user/AppAvatar";
import EspaceScreen from "../screens/EspaceScreen";
import LocalisationScreen from "../screens/LocalisationScreen";
import routes from "./routes";
import AppHeaderLeft from "../components/AppHeaderLeft";
import {useSelector} from "react-redux";
import NewLocalisationScreen from "../screens/NewLocalisationScreen";

const StackOther = createStackNavigator();

function OtherFileNavigator({navigation}) {
    const user = useSelector(state => state.auth.user)
    return (
        <StackOther.Navigator screenOptions={{
            headerStyle: {backgroundColor: color.rougeBordeau},
            headerTintColor: color.blanc
        }}>
            <StackOther.Screen name='FileScreen' component={OtherFileMain} options={{
                headerLeft: () => <AppAvatar user={user} onPress={() => navigation.openDrawer()}/>,
                title: 'Gestion des autres fichiers'
            }}/>
            <StackOther.Screen name='EspaceScreen' component={EspaceScreen} options={{
                title: 'Gestion des espaces'
            }}/>
            <StackOther.Screen name='CategorieScreen' component={CategorieScreen} options={({navigation}) => ({
                title: 'Toutes les categories',
                headerLeft: (props) =>
                    <AppHeaderLeft
                        onPress={() => navigation.navigate(routes.HOME)}/>
            })}/>
            <StackOther.Screen name='NewCategorieScreen' component={NewCategorieScreen} options={{
                title: 'Nouvelle categorie'
            }}/>
            <StackOther.Screen name='PayementScreen' component={PayementScreen} options={{
                title: 'Gestion des payements'
            }}/>

            <StackOther.Screen name='PointRelaisScreen' component={PointRelaisScreen} options={{
                title: 'Les Points relais'
            }}/>
            <StackOther.Screen name='NewPointRelaisScreen' component={NewPointRelaisScreen} options={{
                title: 'Nouveau point relais'
            }}/>

            <StackOther.Screen name='RegionScreen' component={RegionScreen} options={{
                title: 'Gestion des regions'
            }}/>
            <StackOther.Screen name='VilleScreen' component={VilleScreen} options={{
                title: 'Liste des villes'
            }}/>

            <StackOther.Screen name='LocalisationScreen' component={LocalisationScreen} options={{
                title: 'Toutes les localisations'
            }}/>

            <StackOther.Screen name='NewLocalisationScreen' component={NewLocalisationScreen} options={{
                title: 'Nouvelle localisation'
            }}/>
        </StackOther.Navigator>
    );
}

export default OtherFileNavigator;