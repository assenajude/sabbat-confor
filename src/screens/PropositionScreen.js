import React from 'react';
import {View, StyleSheet, FlatList} from "react-native";
import ListFooter from "../components/list/ListFooter";
import {useDispatch, useSelector} from "react-redux";
import PropositionItem from "../components/proposition/PropositionItem";
import AppText from "../components/AppText";
import {getSelectedProposition} from "../store/slices/propositionSlice";

function PropositionScreen({navigation}) {
    const dispatch = useDispatch()
    const user = useSelector(state => state.auth.user)
    const listProposition = useSelector(state => state.entities.proposition.list)
    const isUser = Object.keys(user).length > 0


    return (
        <>
          {listProposition.length>0 && <FlatList data={listProposition} keyExtractor={item => item.id.toString()}
           renderItem={({item}) => <PropositionItem
               propositionImage={{uri: item.imagesProposition[0]}} isPropositionImage={item.imagesProposition.length>0}
               label={item.designation} descriptionOptions={item.description}
               propositionNotReady={!item.isOk}
               editProposition={() => {
                   dispatch(getSelectedProposition(item))
                   navigation.navigate('AccueilNavigator',{screen: 'NewPropositionScreen', params: {mode: 'edit'}})
               }}
               getPropositionOrder={() => {
                   if(item.typeReference.toLowerCase() === 'article') {
                       navigation.navigate('AccueilNavigator',{screen: 'ArticleDetailScreen', params: {id: item.referenceId, designArticle: item.designation}})
                   } else {
                       navigation.navigate('AccueilNavigator',{screen: 'LocationDetailScreen', params: {id: item.referenceId, libelleLocation: item.designation}})
                   }
               }
               }/>}/>}
            {listProposition.length === 0 && <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <AppText>Aucune proposition trouvée..</AppText>
            </View>}
            {isUser && <View style={styles.addNewButton}>
            <ListFooter  onPress={() => navigation.navigate('AccueilNavigator',{screen: 'NewPropositionScreen', params: {mode: 'add'} })}/>
            </View>}
        </>
    );
}

const styles = StyleSheet.create({

    addNewButton: {
        position: 'absolute',
        right: 20,
        bottom: 40
    }
})

export default PropositionScreen;