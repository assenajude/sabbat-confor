import React from 'react';
import {FlatList,View} from "react-native";
import FactureListItem from "../components/list/FactureListItem";
import {useSelector} from "react-redux";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";

function UserFactureEncoursScreen() {

    const encoursList = useSelector(state => state.entities.facture.encoursList)
    const loading = useSelector(state => state.entities.facture.loading)

    if(encoursList.length === 0){
        return (
            <View style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
                <AppText>Vous n'avez aucune facture dans les encours.</AppText>
            </View>
        )
    }


    return (
        <>
             <AppActivityIndicator visible={loading}/>
             <View style={{bottom: 20}}>
        <FlatList data={encoursList} keyExtractor={item => item.id.toString()}
                  renderItem={({item}) =>
                      <FactureListItem facture={item}/>
                  } />
             </View>
                  </>
    );
}

export default UserFactureEncoursScreen;