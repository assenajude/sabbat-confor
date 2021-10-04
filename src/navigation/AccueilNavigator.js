import React from 'react';
import {useSelector} from 'react-redux'
import {createStackNavigator, TransitionPresets} from "@react-navigation/stack";
import AccueilScreen from "../screens/AccueilScreen";
import Color from "../utilities/colors";
import ArticleDetailScreen from '../screens/ArticleDetailScreen';
import ShoppingCartScreen from "../screens/ShoppingCartScreen";
import OrderScreen from "../screens/OrderScreen";
import PlanScreen from "../screens/PlanScreen";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import OrderPayementScreen from "../screens/OrderPayementScreen";
import OrderLivraisonScreen from "../screens/OrderLivraisonScreen";
import UserFavorisScreen from "../screens/UserFavorisScreen";
import CompteScreen from "../screens/CompteScreen";
import ElocationScreen from "../screens/ElocationScreen";
import UserAdresseScreen from "../screens/UserAdresseScreen";
import OrderDetailsScreen from "../screens/OrderDetailsScreen";
import FactureDetailsScreen from "../screens/FactureDetailsScreen";
import NewUserAdresseScreen from "../screens/NewUserAdresseScreen";
import CartIconRight from "../components/shoppingCart/CartIconRight";
import UserLocationNavigator from "./UserLocationNavigator";
import UserServiceNavigator from "./UserServiceNavigator";
import UserOrderNavigator from "./UserOrderNavigator";
import UserFactureNavigator from "./UserFactureNavigator";
import routes from "./routes";
import EditUserInfoScreen from "../screens/EditUserInfoScreen";
import LocationDetailScreen from "../screens/LocationDetailScreen";
import NewOptionScreen from "../screens/NewOptionScreen";
import PlanDetailScreen from "../screens/PlanDetailScreen";
import PropositionScreen from "../screens/PropositionScreen";
import PlanPropositionScreen from "../screens/PlanPropositionScreen";
import NewPropositionScreen from "../screens/NewPropositionScreen";
import NewPlanScreen from "../screens/NewPlanScreen";
import AppAvatar from "../components/user/AppAvatar";
import HelpScreen from "../screens/HelpScreen";
import FaqScreen from "../screens/FaqScreen";
import QuestionScreen from "../screens/QuestionScreen";
import ResponseScreen from "../screens/ResponseScreen";
import ServiceDetailScreen from "../screens/ServiceDetailScreen";
import EditUserImagesScreen from "../screens/EditUserImagesScreen";
import ParrainageNavigator from "./ParrainageNavigator";
import OrderParrainageScreen from "../screens/OrderParrainageScreen";
import FactureTrancheScreen from "../screens/FactureTrancheScreen";
import HomeScreen from "../screens/HomeScreen";
import UserParamScreen from "../screens/UserParamScreen";
import CguScreen from "../screens/CGUScreen";
import AppHeaderLeft from "../components/AppHeaderLeft";
import OtherFileNavigator from "./OtherFileNavigator";
import CategorieScreen from "../screens/CategorieScreen";
import NewCategorieScreen from "../screens/NewCategorieScreen";

const ArticleStackNavigator = createStackNavigator();

const AccueilNavigator = () => {
    const user = useSelector(state => state.auth.user)
    const cartItemLenght = useSelector(state => state.entities.shoppingCart.itemsLenght)
    return (
        <ArticleStackNavigator.Navigator
            initialRouteName='HomeScreen'
            screenOptions={({navigation}) => ({
                headerStyle: {backgroundColor: Color.rougeBordeau},
                headerTintColor: Color.blanc,
                ...TransitionPresets.SlideFromRightIOS,
                headerRight: ({size, color}) => (
                <CartIconRight cartLenght={cartItemLenght} getToCartScreen={() => navigation.navigate('AccueilNavigator', {screen: 'ShoppingCartScreen'})}/>
            )
        })}>
            <ArticleStackNavigator.Screen name='AccueilScreen' component={AccueilScreen}
               options={({navigation}) => ({
                   headerShown: false,
                   headerLeft: () =>
                       <AppAvatar
                           user={user}
                           showNottif={true}
                           onPress={() =>navigation.openDrawer()}/>,
               })}/>

              <ArticleStackNavigator.Screen name='ShoppingCartScreen' component={ShoppingCartScreen}
              options={{title: 'Panier' }}/>
            <ArticleStackNavigator.Screen name='RegisterScreen' component={RegisterScreen} options={{title: 'Compte utilisateur'}}/>
            <ArticleStackNavigator.Screen name='LoginScreen' component={LoginScreen} options={{title: 'Compte utilisateur'}}/>
            <ArticleStackNavigator.Screen name='OrderPayementScreen' component={OrderPayementScreen} options={{title: 'Payement de la commande'}}/>
            <ArticleStackNavigator.Screen name='OrderLivraisonScreen' component={OrderLivraisonScreen} options={{title: 'Adresse de livraison'}}/>
            <ArticleStackNavigator.Screen
                name='UserOrder'
                component={UserOrderNavigator} options={({navigation}) => ({
                title: 'Vos commandes',
                headerLeft:(props) =>
                    <AppHeaderLeft
                    onPress={() => navigation.navigate(routes.HOME)
                }/>})}/>
            <ArticleStackNavigator.Screen name='UserFavorisScreen' component={UserFavorisScreen} options={({navigation}) =>({
                title: 'Vos Favoris',
                headerLeft: (props) =>
                    <AppHeaderLeft onPress={() => navigation.navigate(routes.HOME)}/>
            })}/>
            <ArticleStackNavigator.Screen
                name='UserFacture'
                component={UserFactureNavigator} options={({navigation}) => ({
                title: 'Vos Factures',
                headerLeft: (props) =>
                    <AppHeaderLeft onPress={() => navigation.navigate(routes.HOME)}/>
            })}/>
            <ArticleStackNavigator.Screen name='CompteScreen' component={CompteScreen} options={{title: 'Gerez votre compte'}}/>
            <ArticleStackNavigator.Screen name='ParamScreen' component={UserParamScreen} options={{title: 'Gestion des parametres'}}/>
            <ArticleStackNavigator.Screen name='LocationScreen' component={ElocationScreen} options={{title: 'Vos Locations'}}/>
            <ArticleStackNavigator.Screen name='HelpScreen' component={HelpScreen} options={{title: "Besoin d'aide?"}}/>
            <ArticleStackNavigator.Screen name='CGUScreen' component={CguScreen} options={{title: "Terms & Conditions"}}/>
            <ArticleStackNavigator.Screen name='OrderScreen' component={OrderScreen} options={{title: 'Resumé de votre commande'}}/>
            <ArticleStackNavigator.Screen
                name='OrderDetailsScreen'
                component={OrderDetailsScreen}
                options={({route,navigation}) =>
                ({title: 'Detail Commande'+' '+ route.params.numero,
                    headerLeft: (props) =>
                        <AppHeaderLeft onPress={() => navigation.navigate(routes.HOME)}/>
                })
            }/>
            <ArticleStackNavigator.Screen name='FactureDetailsScreen' component={FactureDetailsScreen} options={({route}) =>
                ({title: 'Detail Facture'+' '+ route.params.numero })
            }/>

            <ArticleStackNavigator.Screen name='FactureTranche' component={FactureTrancheScreen} options={({route}) =>
                ({title: 'Facture Tranches'})
            }/>
            <ArticleStackNavigator.Screen name='UserAdresse' component={UserAdresseScreen} options={{
                title: 'Vos adresses'
            }}/>
            <ArticleStackNavigator.Screen name='PropositionScreen' component={PropositionScreen} options={{
                title: 'Liste des propositions'
            }}/>
            <ArticleStackNavigator.Screen name='NewUserAdresseScreen' component={NewUserAdresseScreen} options={{
                title: 'Ajout nouvelle adresse'
            }}/>
            <ArticleStackNavigator.Screen name='EditUserInfoScreen' component={EditUserInfoScreen} options={{
                title: 'Editez votre profile'
            }}/>
            <ArticleStackNavigator.Screen name='PlanPropositionScreen' component={PlanPropositionScreen} options={{
                title: 'Plans & Propositions'
            }}/>
            <ArticleStackNavigator.Screen name='NewPropositionScreen' component={NewPropositionScreen} options={{
                title: 'Nouvelle proposition'
            }}/>


            <ArticleStackNavigator.Screen name='UserService' component={UserServiceNavigator} options={({navigation}) =>({
                title: 'Vos services',
                headerLeft:(props) =>
                    <AppHeaderLeft onPress={() => navigation.navigate(routes.HOME)
                }/>
            })}/>
            <ArticleStackNavigator.Screen name='UserLocation' component={UserLocationNavigator} options={({navigation}) => ({
                title: 'Vos Locations',
                headerLeft:(props) =>
                    <AppHeaderLeft onPress={() => {
                    navigation.navigate(routes.HOME)}
                }/>
            })}/>
            <ArticleStackNavigator.Screen name='ArticleDetailScreen' component={ArticleDetailScreen}
                  options={({route}) =>
                  ({title: 'Detail '+route.params.designArticle})}/>

            <ArticleStackNavigator.Screen
                name='LocationDetailScreen'
                component={LocationDetailScreen}
                options={({route}) => ({
                title: 'Detail '+route.params.libelleLocation
            })}/>
            <ArticleStackNavigator.Screen name='PlanScreen' component={PlanScreen} options={{
                title: 'Liste des plans'
            }}/>
            <ArticleStackNavigator.Screen name='NewPlanScreen' component={NewPlanScreen} options={{
                title: 'Nouveau plan'
            }}/>

            <ArticleStackNavigator.Screen name='PlanDetailScreen' component={PlanDetailScreen} options={({route}) => ({
                title: 'Detail '+route.params.libelle
            })}/>

            <ArticleStackNavigator.Screen name='NewOptionScreen' component={NewOptionScreen} options={{
                title: 'Ajouter un detail'
            }}/>
            <ArticleStackNavigator.Screen name='FaqScreen' component={FaqScreen} options={{
                title: 'FAQ'
            }}/>
            <ArticleStackNavigator.Screen name='QuestionScreen' component={QuestionScreen} options={{
                title: 'Posez votre question'
            }}/>
            <ArticleStackNavigator.Screen name='ResponseScreen' component={ResponseScreen} options={{
                title: 'Ajouter une reponse'
            }}/>
            <ArticleStackNavigator.Screen name='ServiceDetailScreen' component={ServiceDetailScreen} options={({route}) => ({
                title: 'Detail '+route.params.libelle
            })}/>
            <ArticleStackNavigator.Screen name='Parrainage' component={ParrainageNavigator} options={({navigation}) =>({
                headerLeft: (props) =>
                    <AppHeaderLeft onPress={() => navigation.navigate(routes.HOME)}/>
            })}/>
            <ArticleStackNavigator.Screen name='EditUserImagesScreen' component={EditUserImagesScreen} options={({route}) => ({
                title: 'Edition image profil'
            })}/>
            <ArticleStackNavigator.Screen name='OrderParrainageScreen' component={OrderParrainageScreen} options={({route}) => ({
                title: 'Parrainage commande'
            })}/>

            <ArticleStackNavigator.Screen
                name='HomeScreen'
                component={HomeScreen}
                options={({route}) => ({
                headerShown: false
            })}/>
            <ArticleStackNavigator.Screen
                name='OtherMain'
                component={OtherFileNavigator}
                options={{
                    headerShown: false
                }}
            />
            <ArticleStackNavigator.Screen name='CategorieScreen' component={CategorieScreen} options={({navigation}) => ({
                title: 'Toutes les categories',
                headerLeft: (props) =>
                    <AppHeaderLeft
                        onPress={() => navigation.navigate(routes.HOME)}/>
            })}/>
            <ArticleStackNavigator.Screen name='NewCategorieScreen' component={NewCategorieScreen} options={{
                title: 'Nouvelle categorie'
            }}/>

        </ArticleStackNavigator.Navigator>
)};

export default AccueilNavigator;