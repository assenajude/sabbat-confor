import React from 'react';
import {useDispatch, useSelector, useStore} from "react-redux";
import {View, StyleSheet, FlatList, Alert} from 'react-native'
import ListFooter from "../components/list/ListFooter";
import routes from "../navigation/routes";
import ItemSeparator from "../components/list/ItemSeparator";
import ListItem from "../components/list/ListItem";
import AppText from "../components/AppText";
import {deleteOneRelais} from "../store/slices/pointRelaisSlice";
import AppActivityIndicator from "../components/AppActivityIndicator";

function PointRelaisScreen({navigation}) {
    const store = useStore()
    const dispatch = useDispatch()
    const pointsRelais = useSelector(state => state.entities.pointRelais.list)
    const loading = useSelector(state => state.entities.pointRelais.loading)

    const deleteRelais = (relais) => {
        Alert.alert("Attention", "Voulez-vous supprimer ce point relais?", [{
            text: "non", onPress: () => null
        }, {
            text: 'oui', onPress:async () => {
                await dispatch(deleteOneRelais({relaisId: relais.id}))
                const error = store.getState().entities.pointRelais.error
                if(error !== null) {
                    alert("Impossible de supprimer le point relais.")
                }else {
                    alert("Point relais supprimer avec succès.")
                }
            }
        }])
    }


    return (
        <>
            <AppActivityIndicator visible={loading}/>
          {pointsRelais.length > 0 &&
          <FlatList
              ItemSeparatorComponent={ItemSeparator}
              data={pointsRelais} keyExtractor={item => item.id.toString()}
            renderItem={({item}) =>
                <ListItem
                    handleDeleteItem={() => deleteRelais(item)}
                    handleEditItem={() => navigation.navigate(routes.NEW_POINT_RELAIS, item)}
                    propriety1={item.nom}
                    propriety2={item.contact}
                    propriety3={item.adresse}
                    propriety4={item.email}/>
            }/>}
            {pointsRelais.length === 0 && <View>
                <AppText>Aucun point relais trouvé</AppText>
            </View>}
            <View style={{
                position: 'absolute',
                bottom: 10,
                right: 10
            }}>
                <ListFooter otherStyle={styles.buttonStyle} onPress={() => navigation.navigate(routes.NEW_POINT_RELAIS)}/>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    },
    buttonStyle: {
        alignSelf: 'flex-end'
    }
})
export default PointRelaisScreen;