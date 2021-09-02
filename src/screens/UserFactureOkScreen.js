import React from 'react';
import {FlatList, View} from "react-native";
import {useSelector} from "react-redux";
import FactureListItem from "../components/list/FactureListItem";
import AppActivityIndicator from "../components/AppActivityIndicator";
import AppText from "../components/AppText";
import useAuth from "../hooks/useAuth";

function UserFactureOkScreen() {
    const {dataSorter} = useAuth()

    const soldeList = useSelector(state => state.entities.facture.soldeList)
    const isLoading = useSelector(state => state.entities.facture.loading)

    if(soldeList.length === 0) {
        return (
            <View style={{
                flex:1,
                justifyContent: 'center',
                arguments: "center"
            }}>
                <AppText>Vous n'avez aucune facture soldée.</AppText>
            </View>
        )
    }

    return (
        <>
            <AppActivityIndicator visible={isLoading}/>

        <FlatList data={dataSorter(soldeList)} keyExtractor={item => item.id.toString()}
                  renderItem={({item}) =>
                      <FactureListItem facture={item}/>
                  } />
                  </>
    );
}


export default UserFactureOkScreen;