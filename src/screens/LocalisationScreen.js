import React, {useState} from 'react';
import AppText from "../components/AppText";
import {View, FlatList, Alert} from "react-native";
import ListFooter from "../components/list/ListFooter";
import routes from "../navigation/routes";
import useAuth from "../hooks/useAuth";
import {useDispatch, useSelector, useStore} from "react-redux";
import ListItem from "../components/list/ListItem";
import {deleteLocalisation, selectLocalisation} from "../store/slices/localisationSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

function LocalisationScreen({navigation}) {
    const {userRoleAdmin} = useAuth()
    const dispatch = useDispatch()
    const store = useStore()
    const localisations = useSelector(state => state.entities.localisation.list)
    const [loading, setLoading] = useState(false)

    const handleDeleteLocalisation = (localisation) => {
        Alert.alert('Alert', "Voulez-vous supprimer cette localisation?", [{
            text: "non", onPress: () => {return;}
        }, {
            text: 'oui', onPress: async () => {
                setLoading(true)
                await dispatch(deleteLocalisation({localisationId: localisation.id}))
                setLoading(false)
                const error = store.getState().entities.localisation.error
                if(error !== null){
                    return alert("Impossible de supprimer cette localisation.")
                }
                alert("localisation supprimée avec succès.")
            }
        }])

    }
    const handleEditLocalisation = (localisation) => {
        navigation.navigate(routes.NEW_LOCAL, localisation)
    }
    return (
        <>
            <AppActivityIndicator visible={loading}/>
            {localisations.length === 0 &&
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <AppText>Aucune localisation trouvée.</AppText>
            </View>}
        {localisations.length>0 && <FlatList
            data={localisations}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({item}) =>
                <ListItem
                    selectItem={() => dispatch(selectLocalisation(item))}
                    selected={item.selected}
                    handleDeleteItem={() => handleDeleteLocalisation(item)}
                    handleEditItem={() => handleEditLocalisation(item)}
                    propriety2={item.id}
                    propriety3={item.quartier}
                    propriety4={item.adresse} />
            }
        />}
            {userRoleAdmin() && <View style={{
                position: 'absolute',
                bottom: 10,
                right: 10
            }}>
                <ListFooter onPress={() => navigation.navigate(routes.NEW_LOCAL)}/>
            </View>}
            </>
    );
}

export default LocalisationScreen;