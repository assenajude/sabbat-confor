import React, { useEffect} from 'react';
import {View,StyleSheet, FlatList, Alert, ToastAndroid} from 'react-native'
import {useSelector, useDispatch} from "react-redux";

import ListFooter from "../components/list/ListFooter";
import routes from "../navigation/routes";
import AppText from "../components/AppText";
import AppButton from "../components/AppButton";
import UserAdresseItem from "../components/userAdresse/UserAdresseItem";
import {getAdresseDeleted} from "../store/slices/userAdresseSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

function UserAdresseScreen({navigation}) {
    const dispatch = useDispatch()

    const userAdresses = useSelector(state => state.entities.userAdresse.list)
    const user = useSelector(state => state.auth.user)
    const listVille = useSelector(state => state.entities.ville.list)
    const isLoading = useSelector(state => state.entities.userAdresse.loading)
    const error = useSelector(state => state.entities.userAdresse.error)

    const isUser = Object.keys(user).length>0

    const getAdresseVille = (adresse) => {
        const villeId = adresse.PointRelai.VilleId
        const selectedVille = listVille.find(ville => ville.id === villeId)
        return selectedVille.nom
    }

    const handleDeleteAdresse =  (adresse) => {
        Alert.alert('Alert!', 'Voulez-vous supprimer definitivement cette adresse?', [{text: 'oui', onPress: async () => {
              await dispatch(getAdresseDeleted(adresse))
                if(error !== null){
                    ToastAndroid.showWithGravity("Impossible de supprimer l'adresse.", ToastAndroid.LONG, ToastAndroid.TOP)
                } else {
                    ToastAndroid.showWithGravity("Adresse supprimer avec succès.",ToastAndroid.LONG, ToastAndroid.TOP)
                }
            }},
            {text: 'non', onPress: () => {return;}}
            ])
    }

    useEffect(() => {
    })

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>
            { userAdresses.length>0 && <FlatList data={userAdresses} keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) =>
                          <UserAdresseItem
                              villeName={getAdresseVille(item)}
                              adresseName={item.nom}
                              telephone={item.tel}
                              email={item.email}
                              otherAdresse={item.adresse}
                              editAddress={() => navigation.navigate(routes.NEW_USER_ADDRESS, item)}
                              deleteAddress={() => handleDeleteAdresse(item)}
                          />
                      }
            />
            }
            {isUser && userAdresses.length === 0 && <View style={styles.container}>
                <AppText>vous n'avez pas encore ajouté d'adresses.</AppText>
            </View>}
            {!isUser && <View style={styles.container}>
                <AppText>Vous devez vous connecter pour ajouter des adresses.</AppText>
                <AppButton style={{padding: 5}} title='Je me connecte' onPress={() => navigation.navigate('AccueilNavigator', {screen: routes.LOGIN})}/>
            </View>}
            {isUser && <View style={styles.addNewButton}>
            <ListFooter onPress={() =>navigation.navigate('AccueilNavigator', {screen: routes.NEW_USER_ADDRESS, params: {mode: 'addNew'}})}/>
            </View>}

        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addNewButton: {
        position: 'absolute',
        right: 5,
        bottom: 5,
    }
})
export default UserAdresseScreen;